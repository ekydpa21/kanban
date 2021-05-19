import React, { useState } from "react";
import { addTodo } from "../store/actions/todosActions";
import Modal from "react-modal";
import { useDispatch } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);
  const [input, setInput] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    let { name, value } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };

  const add = (e) => {
    e.preventDefault();
    dispatch(addTodo(input));
    setInput({ title: "", description: "" });
    setShowAddTodoForm(false);
  };

  return (
    <>
      <div className="home-header">
        <p>Product Roadmap</p>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddTodoForm(true)}
        >
          Add Todo
        </button>
      </div>

      {/* Add Todo Modal */}
      <Modal
        isOpen={showAddTodoForm}
        className="AddTodoModal shadow-lg"
        overlayClassName="Overlay"
        onRequestClose={() => setShowAddTodoForm(false)}
        ariaHideApp={false}
      >
        <p>Add New Todo</p>
        <form>
          <div style={{ marginBottom: "8px" }}>
            <label htmlFor="TodoTitle" className="form-label label">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={input.title}
              onChange={handleChange}
              className="form-control form"
              id="TodoTitle"
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label label">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={input.description}
              onChange={handleChange}
              className="form-control descriptionForm"
              id="description"
            />
          </div>
        </form>
        <div className="footer">
          <div className="button" onClick={() => setShowAddTodoForm(false)}>
            Cancel
          </div>
          <div className="button save" onClick={add}>
            Add Todo
          </div>
        </div>
      </Modal>
    </>
  );
}
