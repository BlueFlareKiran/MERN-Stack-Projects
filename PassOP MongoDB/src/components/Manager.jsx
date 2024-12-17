import React, { useEffect, useState } from "react";

const Manager = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, index: null });

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/passwords");
    const passwords = await req.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const savePassword = async () => {
    if (!form.site || !form.username || !form.password) {
      showToast("All fields are required!", "error");
      return;
    }

    const formattedSite =
      form.site.startsWith("http://") || form.site.startsWith("https://")
        ? form.site
        : `https://${form.site}`;

    const newPassword = { site: formattedSite, username: form.username, password: form.password };

    // Send POST request to your API
    const response = await fetch("http://localhost:3000/passwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPassword),
    });

    // Check if the response status is OK
    if (response.ok) {
      const addedPassword = await response.json();
      setPasswordArray((prev) => [...prev, addedPassword]); // Update local state with the added password
      setForm({ site: "", username: "", password: "" }); // Reset form fields
      showToast("Password added successfully!", "success");
    } else {
      // If response is not OK, get the error message from the response
      const errorResponse = await response.json();
      showToast(errorResponse.message || "Failed to add password!", "error");
    }
  };

  const deletePassword = (index) => {
    setModal({ isOpen: true, index });
  };

  const confirmDelete = async () => {
    const passwordToDelete = passwordArray[modal.index];

    // Send DELETE request to your API
    const response = await fetch(`http://localhost:3000/passwords/${passwordToDelete._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const updatedPasswords = passwordArray.filter((_, i) => i !== modal.index);
      setPasswordArray(updatedPasswords);
      setModal({ isOpen: false, index: null });
      showToast("Password deleted successfully!", "success");
    } else {
      showToast("Failed to delete password!", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, type) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <>
      {/* Toast */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toastMessage.message}
        </div>
      )}

      {/* Delete Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to delete?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModal({ isOpen: false, index: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          background: "linear-gradient(to bottom right, #FF8C42, #FF3C83, #7A3CFF, #3CFFDD)",
        }}
      ></div>

      {/* Navbar */}
      <div
        className="w-full py-4 px-6"
        style={{ background: "linear-gradient(to right, #6A0572, #A903D4)" }}
      >
        <h1 className="text-white text-2xl font-bold text-center">Password Manager</h1>
      </div>

      {/* Centered Container */}
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div
          className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-3/4 lg:w-2/3"
          style={{
            background: "linear-gradient(to bottom, #EAF4FC, #FDE3D4)",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="text-purple-700"> &lt;</span>
            Pass
            <span className="text-purple-700"> OP/&gt;</span>
          </h1>
          <p className="text-pink-700 text-lg text-center font-bold">Your own password manager</p>

          {/* Inputs and Button */}
          <div className="flex flex-col p-4 text-black gap-5">
            <input
              className="rounded-full border border-purple-500 w-full p-4 py-1"
              type="text"
              placeholder="Enter Website URL"
              value={form.site}
              onChange={handleChange}
              name="site"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="rounded-full border border-purple-500 w-full p-4 py-1"
                type="text"
                placeholder="Enter User Name"
                value={form.username}
                onChange={handleChange}
                name="username"
              />

              <div className="relative">
                <input
                  className="rounded-full border border-purple-500 w-full p-4 py-1 pr-10"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-purple-500"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Add Password Button */}
            <div className="flex justify-center mt-4">
              <button
                className="bg-purple-500 rounded-full px-6 py-3 text-white font-bold shadow-lg hover:bg-purple-600 transition-all duration-300"
                onClick={savePassword}
              >
                Add Password
              </button>
            </div>
          </div>

          {/* Passwords Table */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Saved Passwords</h2>
            {passwordArray.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-purple-400">
                  <thead>
                    <tr className="bg-purple-200">
                      <th className="border border-purple-400 px-4 py-2">Website</th>
                      <th className="border border-purple-400 px-4 py-2">Username</th>
                      <th className="border border-purple-400 px-4 py-2">Password</th>
                      <th className="border border-purple-400 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passwordArray.map((entry, index) => (
                      <tr key={entry._id} className="relative text-center">
                        <td className="border border-purple-400 px-4 py-2 text-blue-600 underline">
                          <a
                            href={entry.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-700"
                          >
                            {entry.site}
                          </a>
                        </td>
                        <td className="border border-purple-400 px-4 py-2 relative">
                          {entry.username}
                          <button
                            className="absolute right-2 top-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            onClick={() => copyToClipboard(entry.username)}
                          >
                            Copy
                          </button>
                        </td>
                        <td className="border border-purple-400 px-4 py-2 relative">
                          {entry.password}
                          <button
                            className="absolute right-2 top-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            onClick={() => copyToClipboard(entry.password)}
                          >
                            Copy
                          </button>
                        </td>
                        <td className="border border-purple-400 px-4 py-2">
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                            onClick={() => deletePassword(index)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No passwords saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;