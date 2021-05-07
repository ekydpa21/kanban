import axios from "axios";
import React, { useEffect, useState } from "react";
import plusIcon from "../assets/plus-icon.svg";
import Modal from "react-modal";
import BoardItem from "./BoardItem";
import { useDispatch, useSelector } from "react-redux";
import { isChangedAction } from "../store/actions/todosActions";

export default function BoardColumn({
  id,
  title,
  description,
  Draggable,
  provided,
  colIdx,
}) {
  const baseUrl = `https://todos-project-api.herokuapp.com/todos/${id}/items`;
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

  const dispatch = useDispatch();
  const { isChanged } = useSelector((state) => state.todos);
  const [items, setItems] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [input, setInput] = useState({
    name: "",
    progress_percentage: +"",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "progress_percentage") {
      const newInput = { ...input, [name]: +value };
      setInput(newInput);
    } else {
      const newInput = { ...input, [name]: value };
      setInput(newInput);
    }
  };

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(({ data }) => {
        data.length === 0 ? setItems(undefined) : setItems(data);
      })
      .catch(console.log);
  }, [baseUrl, isChanged]);

  const save = (e) => {
    e.preventDefault();
    axios.post(baseUrl, input);
    setShowAddForm(false);
    setInput({
      name: "",
      progress_percentage: +"",
    });
    dispatch(isChangedAction(true));
    setTimeout(() => {
      dispatch(isChangedAction(false));
    }, 100);
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
              Task Name
            </label>
            <input
              type="text"
              name="name"
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
              onChange={handleChange}
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

      <div
        className={`column-board column-${colIdx}`}
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        <div className="title-board">
          <p>{title}</p>
        </div>
        <div className="category-board">
          <p>{description}</p>
        </div>
        {items ? (
          items.map((item, idx) => {
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
        {provided.placeholder}
        <div className="addButton" onClick={() => setShowAddForm(true)}>
          <img src={plusIcon} alt="plus-icon" />
          <p>New Task</p>
        </div>
      </div>
    </>
  );
}
