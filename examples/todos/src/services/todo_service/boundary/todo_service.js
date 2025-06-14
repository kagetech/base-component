/**
 * A service interface for managing to-do items.
 * 
 * Implementations should provide asynchronous CRUD operations for managing to-do items.
 */
export class TodoService {
  /**
   * Adds a new to-do item.
   * 
   * @param {{ contents: string }} item - The to-do to add (without ID).
   * 
   * @returns {Promise<{ id: number, contents: string }>} The added to-do with an assigned ID.
   */
  async addTodo(item) {
    return { id: 0, contents: '' };
  }

  /**
   * Updates an existing to-do item.
   * 
   * @param {{ id?: number, contents: string }} item - The to-do to update.
   * 
   * @returns {Promise<{ id?: number, contents: string } | null>} The updated to-do, or null if not found.
   */
  async updateTodo(item) {
    return null;
  }

  /**
   * Removes a to-do item.
   * 
   * @param {{ id: number, contents: string }} item - The to-do to remove.
   * 
   * @returns {Promise<{ id: number, contents: string }>} The removed to-do.
   */
  async removeTodo(item) {
    return item;
  }

  /**
   * Retrieves all to-do items.
   * 
   * @returns {Promise<Array<{ id: number, contents: string }>>} A list of all todos.
   */
  async searchTodos() {
    return [];
  }
}
