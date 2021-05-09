import React, { useState } from "react";
import Modal from "react-modal";
import option from "../assets/threeDot.svg";
import backward from "../assets/backIcon.svg";
import forward from "../assets/nextIcon.svg";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/trashIcon.svg";
import warningIcon from "../assets/warningIcon.svg";
import doneIcon from "../assets/doneIcon.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchColumns, isChangedAction } from "../store/actions/todosActions";
import Swal from "sweetalert2";

export default function BoardItem({ idx, item, Draggable, colIdx, columnId }) {
  const { id, todo_id, name, progress_percentage } = item;
  const baseUrl = `https://todos-project-api.herokuapp.com/todos/${todo_id}/items/${id}`;
  const authToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MjA4ODY2OTh9.SKIV2sXUShLHAnuSl9r9kOa9vK84EE9nmJa624jx8Pg";

  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `Bearer ${authToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const dispatch = useDispatch();
  const { columns } = useSelector((state) => state.todos);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInput, setEditInput] = useState({
    name: name,
    progress_percentage: progress_percentage,
  });
  const lastIdx = columns.length - 1;

  const handleChange = (e) => {
    let { name, value } = e.target;
    const newInput = { ...editInput, [name]: value };
    setEditInput(newInput);
  };

  const edit = (e) => {
    e.preventDefault();
    if (
      editInput.progress_percentage < 0 ||
      editInput.progress_percentage > 100
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Progress value is between 0 to 100",
      });
      setEditInput({
        name: name,
        progress_percentage: progress_percentage,
      });
    } else {
      axios.patch(baseUrl, {
        target_todo_id: columnId,
        name: editInput.name,
        progress_percentage: +editInput.progress_percentage,
      });
    }
    setShowEditForm(false);
    dispatch(fetchColumns());
    dispatch(isChangedAction(true));
    setTimeout(() => {
      dispatch(isChangedAction(false));
    }, 100);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(baseUrl);
    setShowDeleteForm(false);
    dispatch(fetchColumns());
    dispatch(isChangedAction(true));
    setTimeout(() => {
      dispatch(isChangedAction(false));
    }, 100);
  };

  const handleMoveRight = async (e) => {
    e.preventDefault();
    await axios.patch(baseUrl, {
      target_todo_id: columns[colIdx + 1].id,
    });
    dispatch(fetchColumns());
    dispatch(isChangedAction(true));
    setTimeout(() => {
      dispatch(isChangedAction(false));
    }, 100);
  };

  const handleMoveLeft = (e) => {
    e.preventDefault();
    axios.patch(baseUrl, {
      target_todo_id: columns[colIdx - 1].id,
    });
    dispatch(fetchColumns());
    dispatch(isChangedAction(true));
    setTimeout(() => {
      dispatch(isChangedAction(false));
    }, 100);
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
            />
          </div>
        </form>
        <div className="footer">
          <div className="button" onClick={() => setShowEditForm(false)}>
            Cancel
          </div>
          <div className="button save" onClick={edit}>
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

      <Draggable id={id} draggableId={id.toString()} index={idx} key={id}>
        {(provided, snapshot) => {
          return (
            <div
              className="item-card"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className="text-item">
                <p>{name}</p>
              </div>
              <div className="footer">
                <div className="status">
                  {progress_percentage !== 100 ? (
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${progress_percentage}%`,
                          backgroundColor: "#1890FF",
                          borderRadius: "8px",
                        }}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  ) : (
                    <div className="progress" style={{ width: "90px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${progress_percentage}%`,
                          backgroundColor: "#52C41A",
                          borderRadius: "8px",
                        }}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  )}
                  {progress_percentage !== 100 ? (
                    <div className="percentage">
                      <p>{progress_percentage}%</p>
                    </div>
                  ) : (
                    <div className="percentage">
                      <img src={doneIcon} alt="doneIcon" />
                    </div>
                  )}
                </div>
                <div className="option">
                  <img src={option} alt="option" />
                  <div className="dropdown">
                    {colIdx !== 0 && (
                      <div className="drop-button" onClick={handleMoveLeft}>
                        <div className="icon">
                          <img src={backward} alt="back" />
                        </div>
                        <p>Move Left</p>
                      </div>
                    )}
                    {colIdx !== lastIdx && (
                      <div className="drop-button" onClick={handleMoveRight}>
                        <div className="icon">
                          <img src={forward} alt="next" />
                        </div>
                        <p>Move Right</p>
                      </div>
                    )}
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
