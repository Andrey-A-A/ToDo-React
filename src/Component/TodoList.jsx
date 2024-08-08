import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import todoImage from "../assets/todo.png"

const TodoList = () => {
  // Переменные состояния
  const [tasks, setTasks] = useState([]); // Содержит список задач
  const [inputValue, setInputValue] = useState(''); // Содержит значение поля ввода
  const [filter, setFilter] = useState('all'); // Содержит текущий тип фильтра
  const [isLoading, setIsLoading] = useState(true); // Указывает, загружаются ли данные
  const [editTaskId, setEditTaskId] = useState(null); // Содержит ID редактируемой задачи

  // Извлечение исходных данных
  useEffect(() => {
    fetchTodos();
  }, []);

  //Делаем запрос к API
  const fetchTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4');
      const todos = await response.json();
      setTasks(todos);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching todos:', error);
      setIsLoading(false);
    }
  };

  // Обрабатка изменения входных данных
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Добавление новой задачи
  const handleAddTask = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    const newTask = {
      title: inputValue,
      completed: false
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setInputValue('');
      toast.success('Task added successfully');
    } catch (error) {
      console.log('Error adding task:', error);
      toast.error('Error adding task');
    }
  };

  // Отслеживание изменения состояния чекбоса
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Удаление задачи
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  // Изменение задачи
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  // Обновление задачи
  const handleUpdateTask = async () => {
    if (inputValue.trim() === '') {
      return;
    }

    const updatedTask = {
      title: inputValue,
      completed: false
    };

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId ? { ...task, title: updatedTaskData.title } : task
        )
      );
      setInputValue('');
      setEditTaskId(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.log('Error updating task:', error);
      toast.error('Error updating task');
    }
  };

  // Отмечаем все задачи как выполненные
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  // Очистка выполненных задач
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  // Изменение фильтра
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'uncompleted') {
      return !task.completed;
    }
    return true;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>
          <img src={todoImage} alt="todo-image" /> Список задач
        </h2>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="добавьте задачу"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddTask}>
            {editTaskId ? 'Обновить' : 'Добавить'}
          </button>
        </div>

        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Текущие задачи
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Удаление задач
          </p>
        </div>

        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Фильтр</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange('all')}>
                Все
              </a>
              <a href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}>
                Незавершенные
              </a>
              <a href="#" id="com" onClick={() => handleFilterChange('completed')}>
                Выполненные
              </a>
            </div>
          </div>

          <div className="completed-task">
            <p>
              Выполнено: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Всего: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;