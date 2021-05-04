import axios from "axios";
import React, { useEffect, useState } from "react";
import plusIcon from "../plus-icon.svg";
import option from "../threeDot.svg";
import Modal from "react-modal";
import { useDispatch } from "react-redux";

export default function BoardColumn({
  id,
  title,
  description,
  Draggable,
  provided,
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
        setItems(data);
      })
      .catch(console.log);
  }, [baseUrl]);

  const save = (e) => {
    e.preventDefault();
    axios.post(baseUrl, input);
    setShowAddForm(false);
    setInput({
      name: "",
      progress_percentage: +"",
    });
  };

  return (
    <>
      <Modal
        isOpen={showAddForm}
        className="AddModal shadow-lg"
        overlayClassName="Overlay"
        onRequestClose={() => setShowAddForm(false)}
        ariaHideApp={false}
      >
        <p>ini modal</p>
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
        className="column-board"
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
              <Draggable
                id={item.id}
                draggableId={item.id.toString()}
                index={idx}
                key={item.id}
              >
                {(provided, snapshot) => {
                  console.log(provided, "----");
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
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Draggable>
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
