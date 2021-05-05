import React, { useState } from "react";
import Modal from "react-modal";
import option from "../assets/threeDot.svg";
import backward from "../assets/backIcon.svg";
import forward from "../assets/nextIcon.svg";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/trashIcon.svg";
import warningIcon from "../assets/warningIcon.svg";
import axios from "axios";

export default function BoardItem({ idx, item, Draggable }) {
  const { id, todo_id, name, progress_percentage } = item;
  const baseUrl = `https://todos-project-api.herokuapp.com/todos/${todo_id}/items/${id}`;
  const authToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MjA0ODQxNTl9.CtAQRpl4Pbs2NZF3iUNKYkA9qyFrvHny5YllbixXonc";

  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `Bearer ${authToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInput, setEditInput] = useState({
    name: name,
    progress_percentage: progress_percentage,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "progress_percentage") {
      const newInput = { ...editInput, [name]: +value };
      setEditInput(newInput);
    } else {
      const newInput = { ...editInput, [name]: value };
      setEditInput(newInput);
    }
  };

  const save = (e) => {
    e.preventDefault();
    axios.patch(baseUrl, editInput);
    setShowEditForm(false);
    setEditInput({
      name: name,
      progress_percentage: progress_percentage,
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(baseUrl);
    setShowDeleteForm(false);
  };

  return (
    <>
      {/* Edit Form Modal */}
      <Modal
        isOpen={showEditForm}
        className="EditModal shadow-lg"
        overlayClassName="Overlay"
        onRequestClose={() => setShowEditForm(false)}
        ariaHideApp={false}
      >
        <p>Edit Task</p>
        <form>
          <div style={{ marginBottom: "8px" }}>
            <label htmlFor="taskName" className="form-label label">
              Task Name
            </label>
            <input
              type="text"
              name="name"
              value={editInput.name}
              onChange={handleChange}
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
              value={editInput.progress_percentage}
              onChange={handleChange}
              className="form-control progressForm"
              id="progress"
              placeholder="0%"
            />
          </div>
        </form>
        <div className="footer">
          <div className="button" onClick={() => setShowEditForm(false)}>
            Cancel
          </div>
          <div className="button save" onClick={save}>
            Save Task
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
            <p>Delete Task</p>
          </div>
        </div>
        <div className="content">
          <p>
            Are you sure want to delete this task? <br /> your action can’t be
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

      <Draggable
        id={item.id}
        draggableId={item.id.toString()}
        index={idx}
        key={item.id}
      >
        {(provided, snapshot) => {
          return (
            <div
              className="item-card"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className="text-item">
                <p>{item.name}</p>
              </div>
              <div className="footer">
                <div className="status">
                  <p>status</p>
                </div>
                <div className="option">
                  <img src={option} alt="option" />
                  <div className="dropdown">
                    <div className="drop-button">
                      <div className="icon">
                        <img src={backward} alt="back" />
                      </div>
                      <p>Move Left</p>
                    </div>
                    <div className="drop-button">
                      <div className="icon">
                        <img src={forward} alt="next" />
                      </div>
                      <p>Move Right</p>
                    </div>
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
            </div>
          );
        }}
      </Draggable>
    </>
  );
}
