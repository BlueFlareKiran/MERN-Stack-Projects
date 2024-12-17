import express from "express";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

config(); // Load environment variables

const dbName = "passop";
const url = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(url);

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function startServer() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("passwords");

    // Get all passwords
    app.get("/passwords", async (req, res) => {
      try {
        const passwords = await collection.find({}).toArray();
        res.status(200).json(passwords);
      } catch (error) {
        console.error("Error fetching passwords:", error);
        res.status(500).json({ success: false, message: "Failed to fetch passwords." });
      }
    });

    // Add a new password
    app.post("/passwords", async (req, res) => {
      const { site, username, password } = req.body;
      if (!site || !username || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      try {
        const result = await collection.insertOne({ site, username, password });
        // Get the inserted document directly from the result
        const insertedPassword = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(insertedPassword);
      } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({ success: false, message: "Failed to save password." });
      }
    });

    // Delete a password
    app.delete("/passwords/:id", async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID." });
      }

      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: "Password not found." });
        }
        res.status(200).json({ success: true, message: "Password deleted successfully." });
      } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ success: false, message: "Failed to delete password." });
      }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();