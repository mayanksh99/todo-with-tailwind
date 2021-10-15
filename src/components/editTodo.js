import React from "react";
import DatePicker from "react-datepicker";
import { Editor, EditorState } from "draft-js";

const EditTodo = ({ modalRef, CloseBtn, data, update }) => {
  console.log(data);
  return (
    <>
      <div
        className="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
        ref={modalRef}
      >
        <div className="modBg relative top-40 mx-auto p-4  w-96 shadow-lg rounded-md">
          <div className="flex justify-end ">
            <CloseBtn
              className="text-xl cursor-pointer mr-2"
              onClick={() => {
                modalRef.current.classList.add("hidden");
                modalRef.current.classList.remove("block");
              }}
            >
              X
            </CloseBtn>
          </div>
          <p className="text-2xl mb-4 text-center">Edit Todo</p>
          <hr />
          <form onSubmit={update}>
            <div>
              <p className="mt-4 text-xl">Title </p>
              <input
                className="text-black mt-2 w-full rounded p-2 "
                type="text"
                placeholder="Add a todo"
                value={data ? data.title : ""}
                //   onChange={(e) => setTitle(e.target.value)}
              ></input>
            </div>
            {/* <p className="mt-4 text-xl mb-2">Description </p>
            <Editor
                editorState={description}
                onChange={setDescription}
                placeholder="Add description"
              /> */}

            <p className="mt-4 mb-2 text-xl">Due Date </p>
            <DatePicker
              className="text-black p-1 rounded"
              selected={data ? data.due_date : ""}
              // onChange={(date) => setDueDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />

            <button
              className="w-full mt-6 rounded px-2 py-1 btn text-black font-semibold"
              type="submit"
            >
              Update task
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTodo;
