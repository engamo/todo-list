import { createTodo } from './todo.js';
import { createProject } from './project.js';

let projects = JSON.parse(localStorage.getItem('projects')) || [createProject("Default")];
let currentProjectId = projects[0].id;

function save() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

export const ProjectManager = {
    getProjects: () => projects,
    getCurrentProject: () => projects.find(p => p.id === currentProjectId),
    addProject(name) {
        const project = createProject(name);
        projects.push(project);
        currentProjectId = project.id;
        save();
    },

    deleteProject(id) {
        projects = projects.filter(project => project.id !== id);
        if (projects.length > 0) {
            currentProjectId = projects[0].id;
        } else {
            currentProjectId = null;
        }
        save();
    },

    switchProject(id) {
        currentProjectId = id;
        save();
    },
    addTodoToCurrentProject(todoData) {
        const todo = createTodo(todoData);
        this.getCurrentProject().todos.push(todo);
        save();
    },
    deleteTodoFromCurrentProject(id) {
        const project = this.getCurrentProject();
        project.todos = project.todos.filter(todo => todo.id !== id);
        save();
    },
    updateTodo(id, updates) {
        const todo = this.getCurrentProject().todos.find(t => t.id === id);
        if (todo) Object.assign(todo, updates);
        save();
    }
};
