import React, { useState } from "react";
import plusIcon from "../assets/plus-icon.svg";
import Modal from "react-modal";
import BoardItem from "./BoardItem";
import { useDispatch } from "react-redux";
import { addTask, deleteTodo, editTodo } from "../store/actions/todosActions";
import Swal from "sweetalert2";
import option from "../assets/threeDot.svg";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/trashIcon.svg";
import warningIcon from "../assets/warningIcon.svg";

export default function BoardColumn({
  id,
  title,
  description,
  Draggable,
  provided,
  colIdx,
  Tasks,
}) {
  const dispatch = useDispatch();
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [input, setInput] = useState({
    task_todo: "",
    progress_percentage: "",
  });
  const [editInput, setEditInput] = useState({
    title: title,
    description: description,
  });

  const handleAddChange = (e) => {
    let { name, value } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };

  const handleEditChange = (e) => {
    let { name, value } = e.target;
    const newInput = { ...editInput, [name]: value };
    setEditInput(newInput);
  };

  const save = (e) => {
    e.preventDefault();
    if (input.progress_percentage < 0 || input.progress_percentage > 100) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Progress value is between 0 to 100",
      });
    } else {
      dispatch(addTask(id, input));
    }
    setShowAddForm(false);
    setInput({
      name: "",
      progress_percentage: "",
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteTodo(id));
    setShowDeleteForm(false);
  };

  const edit = (e) => {
    e.preventDefault();
    dispatch(editTodo(id, editInput));
    setShowEditForm(false);
  };

  return (
    <>
      {/* Add Form Modal */}
      <Modal
        isOpen={showAddForm}
        className="AddModal shadow-lg"
        overlayClassName="Overlay"
        onRequestClose={() => setShowAddForm(false)}
        ariaHideApp={false}
      >
        <p>Create Task</p>
        <form>
          <div style={{ marginBottom: "8px" }}>
            <label htmlFor="taskName" className="form-label label">
              Task Title
            </label>
            <input
              type="text"
              name="task_todo"
              onChange={handleAddChange}
              className="form-control form"
              id="taskName"
              placeholder="example: Build rocket to Mars."
            />
          </div>
          <div>
            <label htmlFor="progress" className="form-label label">
              Progress
            </label>
            <input
              type="text"
              name="progress_percentage"
              onChange={handleAddChange}
              className="form-control progressForm"
              id="progress"
              placeholder="0%"
            />
          </div>
        </form>
        <div className="footer">
          <div className="button" onClick={() => setShowAddForm(false)}>
            Cancel
          </div>
          <div className="button save" onClick={save}>
            Save Task
          </div>
        </div>
      </Modal>

      {/* Edit Todo Form Modal */}
      <Modal
        isOpen={showEditForm}
        className="EditTodoModal shadow-lg"
        overlayClassName="Overlay"
        onRequestClose={() => setShowEditForm(false)}
        ariaHideApp={false}
      >
        <p>Edit Todo</p>
        <form>
          <div style={{ marginBottom: "8px" }}>
            <label htmlFor="todoTitle" className="form-label label">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editInput.title}
              onChange={handleEditChange}
              className="form-control form"
              id="todoTitle"
            />
          </div>
          <div>
            <label htmlFor="descriptionTodo" className="form-label label">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={editInput.description}
              onChange={handleEditChange}
              className="form-control descriptionTodoForm"
              id="descriptionTodo"
            />
          </div>
        </form>
        <div className="footer">
          <div className="button" onClick={() => setShowEditForm(false)}>
            Cancel
          </div>
          <div className="button save" onClick={edit}>
            Save
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteForm}
        className="DeleteModal shadow-lg"
        overlayClassName="Overlay"
        onRequestClose={() => setShowDeleteForm(false)}
        ariaHideApp={false}
      >
        <div className="header">
          <img src={warningIcon} alt="warning" />
          <div className="text-header">
            <p>Delete Todo</p>
          </div>
        </div>
        <div className="content">
          <p>
            Are you sure want to delete this Todo? <br /> your action can’t be
            reverted.
          </p>
        </div>
        <div className="footer">
          <div className="button" onClick={() => setShowDeleteForm(false)}>
            Cancel
          </div>
          <div className="button delete" onClick={handleDelete}>
            Delete
          </div>
        </div>
      </Modal>

      <div
        className={`column-board column-${colIdx}`}
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        <div className="board-header">
          <div className="title-board">
            <p>{title}</p>
          </div>
          <div className="board-option">
            <img src={option} alt="option" />
            <div className="dropdown">
              <div
                className="drop-button"
                onClick={() => {
                  setShowEditForm(true);
                }}
              >
                <div className="icon">
                  <img src={editIcon} alt="back" />
                </div>
                <p>Edit</p>
              </div>
              <div
                className="drop-button"
                onClick={() => {
                  setShowDeleteForm(true);
                }}
              >
                <div className="icon">
                  <img src={deleteIcon} alt="back" />
                </div>
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
        <div className="category-board">
          <p>{description}</p>
        </div>
        <div className="task-container">
          {Tasks.length !== 0 ? (
            Tasks.map((item, idx) => {
              return (
                <BoardItem
                  columnId={id}
                  Draggable={Draggable}
                  item={item}
                  idx={idx}
                  key={item.id}
                  colIdx={colIdx}
                />
              );
            })
          ) : (
            <div className="empty-item-card">
              <div className="text-item">
                <p>No Task Available</p>
              </div>
            </div>
          )}
        </div>
        {provided.placeholder}
        <div className="addButton" onClick={() => setShowAddForm(true)}>
          <img src={plusIcon} alt="plus-icon" />
          <p>New Task</p>
        </div>
      </div>
    </>
  );
}
