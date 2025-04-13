import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    axios.get('http://localhost:8080/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newTask = {
      title,
      description,
      completed: false
    }

    axios.post('http://localhost:8080/api/tasks', newTask)
      .then(res => {
        setTasks(prev => [...prev, res.data])
        setTitle('')
        setDescription('')
      })
      .catch(err => console.error('Error creating task:', err))
  }
const handleDelete = (id) => {
  axios.delete(`http://localhost:8080/api/tasks/${id}`)
    .then(() => {
      setTasks(prev => prev.filter(task => task.id !== id))
    })
    .catch(err => console.error('Error deleting task:', err))
}

  return (
    <div className="App">
      <h1>Task Tracker</h1>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map(task => (
            <li key={task.id}>
              <div className="task-item">
                <div>
                  <strong>{task.title}</strong>: {task.description}
                  <span className={task.completed ? "complete" : "incomplete"}>
                    {task.completed ? " ✅" : " ❌"}
                  </span>
                </div>
                <button onClick={() => handleDelete(task.id)}>🗑 Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App
