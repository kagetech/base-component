/**
 * Base class for all events related to the to-do list.
 * 
 * @abstract
 */
export class TodoListEvent { } // NOSONAR

/**
 * Event to trigger loading the to-do list.
 * 
 * @extends TodoListEvent
 */
export class LoadTodoList extends TodoListEvent { }

/**
 * Event to trigger removal of a specific to-do item from the list.
 * 
 * @extends TodoListEvent
 */
export class RemoveTodo extends TodoListEvent {
  #todo;

  /**
   * @param {{ id: number, contents: string }} item - The to-do item to remove.
   */
  constructor(item) {
    super();

    this.#todo = item;
  }

  /**
   * @returns {{ id: number, contents: string }} The to-do item to be removed.
   */
  get todo() {
    return this.#todo;
  }
}
