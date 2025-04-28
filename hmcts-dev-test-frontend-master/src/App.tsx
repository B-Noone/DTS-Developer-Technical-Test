import React, { use, useEffect } from 'react';
import './App.css';
import Task from './Task';
import EditMenu from './EditMenu';
import AddMenu from './AddMenu';

const BASEURL = 'http://localhost:4000';
interface TaskResponse {
  allTasks: TaskProps[];
}

interface TaskResponseFiltered {
  tasks: TaskProps[];
}

interface TaskProps {
  id: string;
  title: string;
  status: string;
  due_date: string;
  description?: string;
}

function App() {
  const [tasks, setTasks] = React.useState<TaskProps[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [removeTask, setRemoveTask] = React.useState("");
  const [sendEditTask, setSendEditTask] = React.useState(false);
  const [sendAddTask, setSendAddTask] = React.useState(false);

  const [addTask, setAddTask] = React.useState({
    title: "",
    status: "",
    dueDate: new Date(),
    description: "",
  });
  const [editTask, setEditTask] = React.useState({
    id: "",
    title: "",
    status: "",
    dueDate: new Date(),
    description: "",
  });

  const [searchTaskID, setSearchTaskID] = React.useState<string>("");
  const [searchTaskTitle, setSearchTaskTitle] = React.useState<string>("");
  const [searchTaskStatus, setSearchTaskStatus] = React.useState<string>("");
  const [searchTaskDueDate, setSearchTaskDueDate] = React.useState<string>("");
  const [searchTaskDescription, setSearchTaskDescription] = React.useState<string>("");
  const [searchTask, setSearchTask] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTask) return;
      try {
        if (searchTaskID || searchTaskTitle || searchTaskStatus || searchTaskDueDate || searchTaskDescription) return;
        var response = await fetch(`${BASEURL}/tasks`);
        if (!response.ok) {
          setLoading(false);
          throw new Error('Network response was not ok');
        }
        const data = await response.json() as TaskResponse;
        setTasks(data.allTasks);
        console.log('Fetched data:', data.allTasks);
        console.log(data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loading]);

  useEffect(() => {
    const removeTaskFromList = async () => {
      if (!removeTask) return;
      try {
        console.log(`${BASEURL}/delete/${removeTask}`);
        const response = await fetch(`${BASEURL}/delete/${removeTask}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Task removed:', data);
      } catch (error) {
        console.error('Error removing task:', error);
      }
      finally {
        setLoading(true);
        setRemoveTask("");
      };
    }
    removeTaskFromList();
  }, [removeTask]);

  useEffect(() => {
    CloseEditMenu();
    const sendEditTaskToServer = async () => {
      console.log("sendEditTask: ", editTask);
      if (!sendEditTask) return;
      if(!CheckValidDate(editTask.dueDate.toString())) return;
      try {
        const response = await fetch(`${BASEURL}/update/${editTask.id}?title=${editTask.title}&status=${editTask.status}&due_date=${editTask.dueDate.toISOString()}&description=${editTask.description}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Task edited:', data);
      } catch (error) {
        console.error('Error editing task:', error);
      }
      finally {
        setLoading(true);
        setSendEditTask(false);
      };
    }
    sendEditTaskToServer();
  }, [sendEditTask]);

  useEffect(() => {
    CloseAddMenu();
    const sendAddTaskToServer = async () => {
      if (!sendAddTask) return;
      try {
        const response = await fetch(`${BASEURL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'title': addTask.title,
            'status': addTask.status,
            'due_date': addTask.dueDate.toISOString(),
            'description': addTask.description,
          }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Task added:', data);
      } catch (error) {
        console.error('Error adding task:', error);
      }
      finally {
        setLoading(true);
        setSendAddTask(false);
      };
    }
    sendAddTaskToServer();
  }, [sendAddTask]);

  const CheckValidDate = (newDate:string) => {
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (searchTask) {
      const fetchData = async () => {
        try {
          if (searchTaskDueDate && !CheckValidDate(searchTaskDueDate)) return;
          var response = await fetch(`${BASEURL}/findTasks?title=${searchTaskTitle}&status=${searchTaskStatus}&due_date=${searchTaskDueDate}&description=${searchTaskDescription}`);
          console.log("response: ", response);
          if (!response.ok) {
            setLoading(false);
            setSearchTask(false);
            throw new Error('Network response was not ok');
          }
          const data = await response.json() as TaskResponseFiltered;
          console.log('Filtered data:', data.tasks);
          setTasks(data.tasks);

          console.log(data);
        } catch (error: any) {
          console.error('Error fetching data:', error);
          setError(error);
        } finally {
          setLoading(false);
          setSearchTask(false);
        }
      };
      fetchData();
    }
  }, [searchTask]);

  const removeTaskButton = (id: string) => {
    setRemoveTask(id);
  };

  const EditTaskButton = (id: string, title: string, status: string, dueDate: Date, description?: string) => {
    console.log("Edit Task Button Pressed", id, title, status, dueDate, description);
    setEditTask({
      id: id,
      title: title,
      status: status,
      dueDate: new Date(dueDate),
      description: description || "",
    });
    OpenEditMenu();
  };

  const OpenEditMenu = () => {
    const centerScreen = document.querySelector('#EditMenu') as HTMLElement;
    if (centerScreen) {
      centerScreen.style.display = 'flex';
    }
  }
  const CloseEditMenu = () => {
    const centerScreen = document.querySelector('#EditMenu') as HTMLElement;
    if (centerScreen) {
      centerScreen.style.display = 'none';
    }
  }

  const OpenAddMenu = () => {
    const centerScreen = document.querySelector('#AddMenu') as HTMLElement;
    if (centerScreen) {
      centerScreen.style.display = 'flex';
    }
  }
  const CloseAddMenu = () => {
    const centerScreen = document.querySelector('#AddMenu') as HTMLElement;
    if (centerScreen) {
      centerScreen.style.display = 'none';
    }
  }

  const finishEditTask = (data: any) => {
    console.log("finishEditTask: ", data);
    setEditTask({
      id: data.id,
      title: data.title,
      status: data.status,
      dueDate: new Date(data.dueDate),
      description: data.description || "",
    });
    setSendEditTask(true);
  }


  const finishAddTask = (data: any) => {
    setAddTask({
      title: data.title,
      status: data.status,
      dueDate: new Date(data.dueDate),
      description: data.description || "",
    });
    setSendAddTask(true);
  }

  const SearchClick = () => {
    setSearchTask(true);
    setLoading(true);
  }

  return (
    !loading && !error ? (
      <div className="App">
        <button className="add-task-button" onClick={OpenAddMenu}>Add Task</button>
        <div className='search-bar'>
          <input type="text" placeholder="ID" value={searchTaskID} onChange={(e) => setSearchTaskID(e.target.value)} />
          <input type="text" placeholder="Title" value={searchTaskTitle} onChange={(e) => setSearchTaskTitle(e.target.value)} />
          <input type="text" placeholder="Description" value={searchTaskDescription} onChange={(e) => setSearchTaskDescription(e.target.value)} />
          <input type="text" placeholder="Status" value={searchTaskStatus} onChange={(e) => setSearchTaskStatus(e.target.value)} />
          <input type="text" placeholder="Due Date" value={searchTaskDueDate} onChange={(e) => setSearchTaskDueDate(e.target.value)} />
          <button className="search-button" onClick={SearchClick}>Search</button>
          <button className="clear-button" onClick={() => {
            setSearchTaskID("");
            setSearchTaskTitle("");
            setSearchTaskStatus("");
            setSearchTaskDueDate("");
            setSearchTaskDescription("");
            setSearchTask(false);
            setLoading(true);
          }}>Clear</button>
        </div>
        <AddMenu
          title={addTask.title}
          status={addTask.status}
          dueDate={addTask.dueDate}
          description={addTask.description}
          finishClick={finishAddTask} />
        <EditMenu
          id={editTask.id}
          title={editTask.title}
          status={editTask.status}
          dueDate={editTask.dueDate}
          description={editTask.description}
          finishClick={finishEditTask} />
        <table className="task-table">
          <tr>
            <th className="task-table-header">
              ID
            </th>
            <th className="task-table-header">
              Title
            </th>
            <th className="task-table-header">
              Description
            </th>
            <th className="task-table-header">
              Status
            </th>
            <th className="task-table-header">
              Due Date
            </th>
          </tr>
          {tasks.length > 0 && tasks.map((task) => (
            <Task
              id={task.id}
              title={task.title}
              status={task.status}
              dueDate={new Date(task.due_date)}
              description={task.description}
              removeClick={() => removeTaskButton(task.id)}
              editClick={() => EditTaskButton(task.id, task.title, task.status, new Date(task.due_date), task.description)}
            />
          ))}
        </table>
      </div>
    ) : (
      <div className="App">
        <p>Loading...</p>
      </div>
    )
  );
}

export default App;
