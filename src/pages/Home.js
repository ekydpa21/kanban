import axios from "axios";
import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import BoardColumn from "../components/BoardColumn";
import { fetchColumns } from "../store/actions/todosActions";

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
  const { columns, loading, error } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchColumns());
    // eslint-disable-next-line
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      // axios.patch(`${baseUrl/}`)
      // const sourceItems = [...sourceColumn.items];
      // const destItems = [...destColumn.items];
      // const [removed] = sourceItems.splice(source.index, 1);
      // destItems.splice(destination.index, 0, removed);
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...sourceColumn,
      //     items: sourceItems,
      //   },
      //   [destination.droppableId]: {
      //     ...destColumn,
      //     items: destItems,
      //   },
      // });
      console.log(sourceColumn, destColumn, result, columns);
    } else {
      // const column = columns[source.droppableId];
      // const copiedItems = [...column.items];
      // const [removed] = copiedItems.splice(source.index, 1);
      // copiedItems.splice(destination.index, 0, removed);
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...column,
      //     items: copiedItems,
      //   },
      // });
      console.log(result);
    }
  };

  // const getItem = (item) => {
  //   setPickedItem(item);
  // };

  return (
    <div className="home-container">
      <div className="title">
        <p>Product Roadmap</p>
      </div>
      <div className="content">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          {columns &&
            columns.map((column) => {
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
