import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { useDispatch } from "react-redux";
import { setSelectedTask } from "./redux/slices/tasksSlice";

function Tasks() {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [reloadTasks, setReloadTasks] = useState(new Date());
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/tasks`);
        const jsonData = await response.json();
        setTasks(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTasks();
  }, [reloadTasks]);

  return (
    <main className='d-grid'>
      <h3 className='title'>Tasks</h3>
      <div className='task-container'>
        <div className='task-overflow'>
          {tasks.map((task, index) => (
            <div
              key={index}
              onClick={() => dispatch(setSelectedTask(task))}
              className='task'
            >
              <div className='task-name'>{task.name}</div>
              <div className='task-description'>{task.description}</div>
            </div>
          ))}
        </div>
      </div>
      <TaskForm setReloadTasks={setReloadTasks} />
    </main>
  );
}
export default Tasks;
