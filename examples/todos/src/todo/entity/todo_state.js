/**
 * Base class for to-do related states.
 * 
 * @abstract
 */
export class TodoState {
  /** @type {{ id?: number, contents: string }} */
  #todo;

  /**
   * @param {{ id?: number, contents: string }} item - The to-do item associated with this state.
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
 * State indicating the to-do item is being edited.
 * 
 * @extends TodoState
 */
export class TodoEdited extends TodoState { }

/**
 * State indicating the to-do item is currently being saved.
 * 
 * @extends TodoState
 */
export class TodoSaving extends TodoState { }

/**
 * State indicating the to-do item was successfully saved.
 * 
 * @extends TodoState
 */
export class TodoSaved extends TodoState { }

/**
 * State representing a failure to save the to-do item.
 * 
 * @extends TodoState
 */
export class TodoNotSaved extends TodoState { }
