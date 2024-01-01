import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedTask } from "./redux/slices/tasksSlice";

const TaskForm = ({ setReloadTasks }) => {
  const selectedTask = useSelector((state) => state.tasks.selectedTask);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
  });

  const clearForm = () => {
    const newFormState = {
      name: "",
      description: "",
    };

    setFormState(newFormState);
  };

  useEffect(() => {
    if (selectedTask) {
      const newFormState = {
        name: selectedTask.name,
        description: selectedTask.description,
      };
      setFormState(newFormState);
    } else {
      clearForm();
    }
  }, [selectedTask]);
  const handleFormChange = (event) => {
    const {
      target: { name, value },
    } = event;

    const newFormState = {
      ...formState,
      [name]: value,
    };

    setFormState(newFormState);
  };

  const handleSubmit = async () => {
    if (!formState.name) {
      alert("name is empty");
      return;
    }

    if (!formState.description) {
      alert("description is empty");
      return;
    }
    let body;
    if (selectedTask) {
      body = {
        ...selectedTask,
        ...formState,
      };
      delete body.status;
    } else {
      body = {
        ...formState,
      };
    }

    let content = {
      method: selectedTask ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    let url = selectedTask
      ? `${apiBaseUrl}/tasks/${selectedTask.id}/`
      : `${apiBaseUrl}/tasks/`;

    try {
      const response = await fetch(url, content);
      if (response.ok) {
        await response.json();
        const msg = selectedTask
          ? "task updated successfully"
          : "task created successfully";
        alert(msg);
        setReloadTasks(new Date());
        clearForm();
        dispatch(setSelectedTask(null));
      } else {
        alert("error ocurred");
      }
    } catch (e) {
      console.error(e);
      alert("error ocurred");
    }
  };

  const confirmDelete = async () => {
    const confirmAction = confirm(`delete task: ${selectedTask.name}`);
    if (confirmAction) {
      let content = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

      let url = `${apiBaseUrl}/tasks/${selectedTask.id}/`;

      try {
        const response = await fetch(url, content);
        if (response.ok) {
          const msg = "task deleted successfully";
          alert(msg);
          setReloadTasks(new Date());
          clearForm();
          dispatch(setSelectedTask(null));
        } else {
          alert("error ocurred");
        }
      } catch (e) {
        console.error(e);
        alert("error ocurred");
      }
    }
  };

  return (
    <div className='task-form'>
      <div className='mb-3'>
        <label htmlFor='taskName' className='form-label'>
          Task Name
        </label>
        <input
          name='name'
          value={formState.name}
          className='form-control'
          id='taskName'
          onChange={handleFormChange}
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='taskDescription' className='form-label'>
          Task Description
        </label>
        <textarea
          name='description'
          value={formState.description}
          className='form-control'
          id='taskDescription'
          rows='3'
          onChange={handleFormChange}
        ></textarea>
      </div>
      <button
        onClick={handleSubmit}
        type='button'
        className='btn btn-primary mb-3'
      >
        Submit
      </button>
      {selectedTask ? (
        <>
          <button
            onClick={confirmDelete}
            type='button'
            className='mx-3 btn btn-danger mb-3'
          >
            Delete
          </button>
          <button
            onClick={() => {
              dispatch(setSelectedTask(null));
            }}
            type='button'
            className='btn btn-secondary mb-3'
          >
            Cancel
          </button>
        </>
      ) : null}
    </div>
  );
};
export default TaskForm;
TaskForm.propTypes = {
  setReloadTasks: PropTypes.func.isRequired,
};
