/**
 * Base class for to-do related events.
 * 
 * @abstract
 */
export class TodoEvent {
  /** @type {{ id?: number, contents: string }} */
  #todo;

  /**
   * @param {{ id?: number, contents: string }} item - The to-do item related to the event.
   */
  constructor(item) {
    this.#todo = item;
  }

  /**
   * Returns the associated to-do item.
   * 
   * @returns {{ id?: number, contents: string }}
   */
  get todo() {
    return this.#todo;
  }
}

/**
 * Event representing a request to add a new to-do item.
 * 
 * @extends TodoEvent
 */
export class AddTodo extends TodoEvent { }

/**
 * Event representing a request to update an existing to-do item.
 * 
 * @extends TodoEvent
 */
export class UpdateTodo extends TodoEvent { }
