import { TodoService } from './todo_service/boundary/todo_service.js';
import { MockTodoService } from './todo_service/control/mock_todo_service.js';

/**
 * Central registry of application-wide service instances.
 * 
 * Provides a static access point to core services like the to-do service.
 */
export class TodosServices {
  /**
   * A singleton instance of the to-do service.
   * 
   * Can be replaced with a different implementation (e.g. real backend service) if needed.
   * 
   * @type {TodoService}
   */
  static todoService = new MockTodoService();
}
