import axios from "axios";
import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import BoardColumn from "../components/BoardColumn";
import { fetchColumns, isChangedAction } from "../store/actions/todosActions";

const baseUrl = "https://todos-project-api.herokuapp.com/todos";
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

export default function Home() {
  const dispatch = useDispatch();
  const { columns } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchColumns());
    // eslint-disable-next-line
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      await axios.patch(
        `${baseUrl}/${+source.droppableId}/items/${+draggableId}`,
        {
          target_todo_id: +destination.droppableId,
        }
      );
      dispatch(isChangedAction(true));
      setTimeout(() => {
        dispatch(isChangedAction(false));
      }, 100);
    }
  };

  return (
    <div className="home-container">
      <div className="title">
        <p>Product Roadmap</p>
      </div>
      <div className="content">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          {columns &&
            columns.map((column, idx) => {
              const { id, title, description } = column;
              return (
                <Droppable droppableId={id.toString()} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <BoardColumn
                        key={id}
                        id={id}
                        title={title}
                        description={description}
                        Draggable={Draggable}
                        provided={provided}
                        colIdx={idx}
                      />
                    );
                  }}
                </Droppable>
              );
            })}
        </DragDropContext>
      </div>
    </div>
  );
}
