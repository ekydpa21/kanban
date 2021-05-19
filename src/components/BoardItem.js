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
import { fetchTodos } from "../store/actions/todosActions";
import Swal from "sweetalert2";

export default function BoardItem({ idx, item, Draggable, colIdx, columnId }) {
  const { id, boardId, task_todo, progress_percentage } = item;
  const baseUrl = `https://new-kanbans.herokuapp.com/todos/${boardId}/tasks/${id}`;
  const access_token = localStorage.getItem("access_token");

  const dispatch = useDispatch();
  const { columns } = useSelector((state) => state.todos);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInput, setEditInput] = useState({
    task_todo: task_todo,
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
        task_todo: task_todo,
        progress_percentage: progress_percentage,
      });
    } else {
      axios.put(
        baseUrl,
        {
          task_todo: editInput.task_todo,
          progress_percentage: +editInput.progress_percentage,
        },
        { headers: { access_token } }
      );
    }
    setShowEditForm(false);
    dispatch(fetchTodos());
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(baseUrl, { headers: { access_token } });
    setShowDeleteForm(false);
    dispatch(fetchTodos());
  };

  const handleMoveRight = async (e) => {
    e.preventDefault();
    await axios.patch(
      baseUrl,
      {
        newBoardId: columns[colIdx + 1].id,
      },
      { headers: { access_token } }
    );
    dispatch(fetchTodos());
  };

  const handleMoveLeft = (e) => {
    e.preventDefault();
    axios.patch(
      baseUrl,
      {
        newBoardId: columns[colIdx - 1].id,
      },
      { headers: { access_token } }
    );
    dispatch(fetchTodos());
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
              name="task_todo"
              value={editInput.task_todo}
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
                <p>{task_todo}</p>
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
