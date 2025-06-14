import { TodoService } from '../boundary/todo_service.js';

/**
 * A mock implementation of `TodoService` for testing and development.
 * 
 * Stores todos in memory and mimics async behavior.
 */
export class MockTodoService extends TodoService {
  #todos = new Map();
  #nextId = 1;

  async addTodo(todo) {
    const id = this.#nextId++;
    const newTodo = { id, ...todo };

    this.#todos.set(id, newTodo);

    return newTodo;
  }

  async updateTodo(todo) {
    if (!this.#todos.has(todo.id)) {
      return null;
    }

    this.#todos.set(todo.id, todo);

    return todo;
  }

  async removeTodo(todo) {
    this.#todos.delete(todo.id);

    return todo;
  }

  async searchTodos() {
    return [...this.#todos.values()];
  }
}
