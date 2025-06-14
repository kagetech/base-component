/**
 * Base class for all states related to the to-do list.
 * 
 * @abstract
 */
export class TodoListState { } // NOSONAR

/**
 * State indicating that the to-do list is currently being loaded.
 * 
 * @extends TodoListState
 */
export class TodoListLoading extends TodoListState { }

/**
 * State indicating that the to-do list has been successfully loaded.
 * 
 * @extends TodoListState
 */
export class TodoListLoaded extends TodoListState {
  #todos;

  /**
   * @param {Array<{ id: number, contents: string }>} [todos=[]] - The loaded list of to-do items.
   */
  constructor(todos = []) {
    super();

    this.#todos = todos;
  }

  /**
   * @returns {Array<{ id: number, contents: string }>} The list of loaded to-do items.
   */
  get todos() {
    return this.#todos;
  }
}

/**
 * State indicating that loading the to-do list has failed.
 * 
 * @extends TodoListState
 */
export class TodoListNotLoaded extends TodoListState { }
