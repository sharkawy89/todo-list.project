const form = document.getElementById('todo-form');
const input = document.getElementById('new-todo');
const todosContainer = document.getElementById('todos-container');
const todoStats = document.getElementById('todo-stats');

// Todo array to store tasks
let todos = [];

// Load todos from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    renderTodos();
  }
});

// Event listener for form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

// Function to add new todo
function addTodo() {
  const todoText = input.value.trim();
  if (todoText === '') return;

  const todo = {
    id: Date.now().toString(),
    text: todoText,
    completed: false
  };

  todos.push(todo);
  input.value = '';
  
  // Save and render todos
  saveTodos();
  renderTodos();
}

// Function to toggle todo completion
function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  
  // Save and render todos
  saveTodos();
  renderTodos();
}

// Function to delete todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  
  // Save and render todos
  saveTodos();
  renderTodos();
}

// Function to save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to render todos
function renderTodos() {
  // Clear todos container
  todosContainer.innerHTML = '';
  
  // Show empty state if no todos
  if (todos.length === 0) {
    todosContainer.innerHTML = '<p class="empty-state">No tasks yet. Add one above!</p>';
    todoStats.textContent = '';
    return;
  }
  
  // Create todo elements
  todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    todoItem.innerHTML = `
      <div class="todo-left">
        <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
      </div>
      <button class="delete-btn" data-id="${todo.id}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;
    
    todosContainer.appendChild(todoItem);
  });
  
  // Add event listeners to checkboxes
  const checkboxes = document.querySelectorAll('.todo-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      const id = checkbox.getAttribute('data-id');
      toggleTodo(id);
    });
  });
  
  // Add event listeners to delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      deleteTodo(id);
    });
  });
  
  // Update stats
  const completedCount = todos.filter(todo => todo.completed).length;
  todoStats.textContent = `${completedCount} of ${todos.length} tasks completed`;
}
