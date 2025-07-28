import { ProjectManager } from './projectManager.js';

export const DOMController = (() => {
  const projectListEl = document.getElementById("project-list");
  const todoListEl = document.getElementById("todo-list");
  const newTodoBtn = document.getElementById("new-todo-btn");
  const newProjectBtn = document.getElementById("new-project-btn");

//   function renderProjects() {
//     projectListEl.innerHTML = "";
//     ProjectManager.getProjects().forEach(project => {
//       const btn = document.createElement("button");
//       btn.textContent = project.name;
//       btn.onclick = () => {
//         ProjectManager.switchProject(project.id);
//         renderTodos();
//       };
//       projectListEl.appendChild(btn);
//     });
//   }
function renderProjects() {
  projectListEl.innerHTML = "";
  ProjectManager.getProjects().forEach(project => {
    const container = document.createElement("div");
    container.className = "project-item";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "space-between";
    container.style.gap = "8px";
    container.style.marginBottom = "5px";

    const btn = document.createElement("button");
    btn.textContent = project.name;
    btn.className = "project-btn";
    btn.style.flex = "1"; // button takes most of the space
    btn.onclick = () => {
      ProjectManager.switchProject(project.id);
      renderTodos();
    };

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-project";
    deleteBtn.dataset.id = project.id;
    deleteBtn.style.cursor = "pointer";

    container.appendChild(btn);
    container.appendChild(deleteBtn);
    projectListEl.appendChild(container);
  });
}


projectListEl.addEventListener("click", e => {
  if (e.target.classList.contains("delete-project")) {
    const id = e.target.dataset.id;
    const confirmDelete = confirm("Delete this project?");
    if (confirmDelete) {
      ProjectManager.deleteProject(id);
      renderProjects();
      renderTodos();
    }
    e.stopPropagation(); // prevent bubbling to project switch
  }
});



  function renderTodos() {
    todoListEl.innerHTML = "";
    const project = ProjectManager.getCurrentProject();
    project.todos.forEach(todo => {
      const div = document.createElement("div");
      div.className = "todo-item";
      div.innerHTML = `
        <strong>${todo.title}</strong> (Due: ${todo.dueDate}) <span style="color:${getPriorityColor(todo.priority)}">[${todo.priority}]</span>
        <button data-id="${todo.id}" class="delete-todo">Delete</button>
        <button data-id="${todo.id}" class="edit-todo">Edit</button>
      `;
      todoListEl.appendChild(div);
    });
  }

  function getPriorityColor(priority) {
    return priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green';
  }

  function setupEventListeners() {
    newProjectBtn.onclick = () => {
      const name = prompt("Enter project name:");
      if (name) {
        ProjectManager.addProject(name);
        renderProjects();
        renderTodos();
      }
    };

    newTodoBtn.onclick = () => {
      const title = prompt("Title:");
      const description = prompt("Description:");
      const dueDate = prompt("Due Date (YYYY-MM-DD):");
      const priority = prompt("Priority (low, medium, high):");
      const notes = prompt("Notes (optional):");

      if (title && dueDate && priority) {
        ProjectManager.addTodoToCurrentProject({ title, description, dueDate, priority, notes });
        renderTodos();
      }
    };

    todoListEl.addEventListener("click", e => {
      const id = e.target.dataset.id;
      if (e.target.classList.contains("delete-todo")) {
        ProjectManager.deleteTodoFromCurrentProject(id);
        renderTodos();
      }

      if (e.target.classList.contains("edit-todo")) {
        const newTitle = prompt("New title:");
        if (newTitle) {
          ProjectManager.updateTodo(id, { title: newTitle });
          renderTodos();
        }
      }
    });
  }

  return {
    init() {
      renderProjects();
      renderTodos();
      setupEventListeners();
    }
  };
})();
