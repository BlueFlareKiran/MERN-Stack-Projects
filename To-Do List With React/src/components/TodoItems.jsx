import React from "react";
import "./Assets/CSS/TodoItems.css";
import check from "./Assets/check.png";
import circle from "./Assets/circle.png";
import close from "./Assets/close.png";

const TodoItems = ({ no, display, text, settodos }) => {
  const toggle = (no) => {
    let data = JSON.parse(localStorage.getItem("todos")) || [];
    data = data.map((item) => {
      if (item.no === no) {
        return { ...item, display: item.display === "" ? "line-through" : "" };
      }
      return item;
    });
    settodos(data);
    localStorage.setItem("todos", JSON.stringify(data));
  };

  const remove = (no) => {
    let data = JSON.parse(localStorage.getItem("todos")) || [];
    data = data.filter((item) => item.no !== no);
    settodos(data);
    localStorage.setItem("todos", JSON.stringify(data));
  };

  return (
    <div className="todoitems">
      <div className="todoitems-container" onClick={() => toggle(no)}>
        {display === "" ? (
          <img className="check" src={circle} alt="circle" />
        ) : (
          <img className="check" src={check} alt="check" />
        )}
        <div
          className="todoitems-text"
          style={{ textDecoration: display }}
        >
          {text}
        </div>
      </div>
      <img
        className="todoitems-close-icon"
        src={close}
        alt="close"
        onClick={() => remove(no)}
      />
    </div>
  );
};

export default TodoItems;
