import React, { useState } from "react";
import "./assets/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill, RiTimerFill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(() =>
    EditorState.createEmpty()
  );
  const [status, setStatus] = useState();
  const [dueDate, setDueDate] = useState(new Date());
  const [todo, setTodo] = useState({
    Pending: [],
    "In Progress": [],
    Done: [],
  });

  console.log(todo);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status === "pending") {
      setTodo({
        ...todo,
        Pending: [
          ...todo.Pending,
          {
            id: uuidv4(),
            title,
            description: stateToHTML(description.getCurrentContent()),
            status,
            created_at: new Date(),
            due_date: dueDate,
          },
        ],
      });
    } else {
      setTodo({
        ...todo,
        "In Progress": [
          ...todo["In Progress"],
          {
            id: uuidv4(),
            title,
            description: stateToHTML(description.getCurrentContent()),
            status,
            created_at: new Date(),
            due_date: dueDate,
          },
        ],
      });
    }
    setTitle("");
    setDescription(() => EditorState.createEmpty());
    setStatus();
    setDueDate(new Date());
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      const copiedItem = todo[source.droppableId];
      const [removed] = copiedItem.splice(source.index, 1);
      copiedItem.splice(destination.index, 0, removed);
      setTodo({ ...todo, [source.droppableId]: copiedItem });
    } else {
      const sourceList = todo[source.droppableId];
      const destiList = todo[destination.droppableId];
      const [removed] = sourceList.splice(source.index, 1);
      destiList.splice(destination.index, 0, removed);
      setTodo({
        ...todo,
        [destination.droppableId]: destiList,
        [source.droppableId]: sourceList,
      });
    }
  };

  const onDeleteTodo = (id, name) => {
    const list = todo[name].filter((item) => (item.id !== id ? item : null));
    setTodo({ ...todo, [name]: list });
  };

  return (
    <div className="contnr ">
      <div className=" mt-10 text-center">
        <p className="text-5xl">Task for today</p>
      </div>
      <div className="flex mt-12 justify-center gap-x-4">
        <div className="	rounded w-72 shadow-2xl">
          <div className="bg-[] rounded m-1 p-2">
            <form onSubmit={handleSubmit}>
              <p className="text-center mb-2 text-xl">Add Todo</p>
              <hr />
              <div>
                <p className="mt-4 text-xl">Title </p>
                <input
                  className="text-black mt-2 w-full rounded p-2 "
                  type="text"
                  placeholder="Add a todo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
              <p className="mt-4 text-xl mb-2">Description </p>
              <Editor
                editorState={description}
                onChange={setDescription}
                // className="bg-white p-2"
                placeholder="Add description"
              />

              <p className="mt-4 text-xl">Status </p>
              <div className="flex justify-around">
                <div>
                  <input
                    className="mt-1 mr-2"
                    type="radio"
                    id="pending"
                    name="status"
                    value="pending"
                    checked={status === "pending"}
                    onChange={(e) => setStatus(e.target.value)}
                  ></input>
                  <label htmlFor="pending">Pending</label>
                </div>
                <div>
                  <input
                    className="mt-1 mr-2"
                    type="radio"
                    id="progress"
                    name="fav_language"
                    value="progress"
                    checked={status === "progress"}
                    onChange={(e) => setStatus(e.target.value)}
                  ></input>
                  <label htmlFor="progress">In progress</label>
                </div>
              </div>
              <p className="mt-4 mb-2 text-xl">Due Date </p>
              <DatePicker
                className="text-black p-1 rounded"
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
              />

              <button
                className="w-full mt-6 rounded px-2 py-1 btn text-black font-semibold"
                type="submit"
              >
                Add task
              </button>
            </form>
          </div>
        </div>
        <DragDropContext onDragEnd={(res) => onDragEnd(res)}>
          {Object.entries(todo).map(([name, column]) => {
            return (
              <Droppable droppableId={name}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="shadow-2xl	rounded w-72 p-2 min-h-screen"
                      style={{
                        background: snapshot.isDraggingOver
                          ? "rgba(200, 221, 228, 0.326)"
                          : "#1b283a",
                      }}
                    >
                      <p className="text-center mb-2 text-xl p-1 ">{name}</p>
                      <hr />
                      {column.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className=" rounded mt-4 p-2 bg"
                                  style={{
                                    background: `linear-gradient(90deg,rgba(255, 102, 20, 1) 0%,rgba(255, 69, 17, 1) 100%)`,
                                    userSelect: "none",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <p className="text-xl truncate mb-1">
                                    {item.title}
                                  </p>
                                  <hr />

                                  <p
                                    className="text-md  mt-1 h-32 overflow-scroll noScroll"
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                  ></p>

                                  <div className="flex gap-1 mt-2">
                                    <RiTimerFill className="text-2xl" />
                                    <p>
                                      {item.due_date.getDate() +
                                        "/" +
                                        (1 + item.due_date.getMonth()) +
                                        "/" +
                                        item.due_date.getFullYear()}
                                    </p>
                                  </div>
                                  <div className="flex justify-end gap-2 text-2xl">
                                    <MdDelete
                                      className="cursor-pointer"
                                      onClick={() =>
                                        onDeleteTodo(item.id, name)
                                      }
                                    />
                                    <RiEdit2Fill />
                                  </div>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
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

export default App;
