import React, { useState } from 'react';

function Section({ section, tasks, onUpdateTasks, onBack }) {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask) {
      onUpdateTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleComplete = (index) => {
    const updated = tasks.map((task, i) => i === index ? { ...task, completed: !task.completed } : task);
    onUpdateTasks(updated);
  };

  return (
    <>
      <button onClick={onBack}>Volver</button>
      <h2>{section}</h2>
      <ul className="checklist">
        {tasks.map((task, index) => (
          <li key={index} className="checklist-item">
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(index)} />
            {task.text}
          </li>
        ))}
      </ul>
      <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea" />
      <button onClick={addTask}>Agregar ítem</button>
    </>
  );
}

export default Section;
