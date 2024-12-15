import React, { useEffect, useRef, useState } from "react";
import "./Assets/CSS/Todo.css";
import TodoItems from "./TodoItems";

let count = Number(localStorage.getItem("todos_count")) || 0;

const Todo = () => {
  const [todos, settodos] = useState([]);
  const inputref = useRef(null);

  const add = () => {
    const task = inputref.current.value.trim();
    if (task !== "") {
      const newTask = { no: count++, text: task, display: "" };
      const updatedTodos = [...todos, newTask];
      settodos(updatedTodos);
      inputref.current.value = "";
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      localStorage.setItem("todos_count", count);
    }
  };

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    settodos(savedTodos);
  }, []);

  return (
    <div className="todo">
      <div className="todo-header">To-Do List</div>
      <div className="todo-add">
        <input
          ref={inputref}
          type="text"
          placeholder="Add Your Task"
          className="todo-input"
        />
        <div onClick={add} className="todo-add-btn">
          Add
        </div>
      </div>
      <div className="todo-list">
        {todos.map((item) => (
          <TodoItems
            key={item.no}
            settodos={settodos}
            no={item.no}
            display={item.display}
            text={item.text}
          />
        ))}
      </div>
    </div>
  );
};

export default Todo;
