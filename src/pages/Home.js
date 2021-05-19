import axios from "axios";
import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import BoardColumn from "../components/BoardColumn";
import { fetchTodos } from "../store/actions/todosActions";

export default function Home() {
  const baseUrl = "https://new-kanbans.herokuapp.com/todos";
  const access_token = localStorage.getItem("access_token");
  const dispatch = useDispatch();
  const { columns } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
    // eslint-disable-next-line
  }, [dispatch]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      await axios.patch(
        `${baseUrl}/${+source.droppableId}/tasks/${+draggableId}`,
        {
          newBoardId: +destination.droppableId,
        },
        { headers: { access_token } }
      );
      dispatch(fetchTodos());
    }
  };

  return (
    <div className="home-container">
      <div className="content">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          {columns &&
            columns.map((column, idx) => {
              const { id, title, description, Tasks } = column;
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
                        Tasks={Tasks}
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
