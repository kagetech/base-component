import { Bloc } from '@kagetech/base-component';

import { TodoService } from '../../services/todo_service/boundary/todo_service.js';
import { LoadTodoList, RemoveTodo, TodoListEvent } from '../entity/todo_list_event.js';
import { TodoListLoaded, TodoListLoading, TodoListState } from '../entity/todo_list_state.js';

/**
 * Business logic component managing the state of a to-do list.
 * 
 * @extends {Bloc<TodoListEvent, TodoListState>}
 */
export class TodoListBloc extends Bloc {
  /** @type {TodoService} */
  #todoService;

  /**
   * @param {TodoService} todoService - The service used for data access.
   */
  constructor(todoService) {
    super(new TodoListLoading());

    this.#todoService = todoService;
  }

  /**
   * @param {TodoListEvent} event
   * 
   * @returns {AsyncGenerator<TodoListState, void, unknown>}
   */
  async *mapEventToState(event) {
    switch (event.constructor) {
      case LoadTodoList:
        yield* this._mapLoadTodoListToState();

        break;
      case RemoveTodo:
        this._mapRemoveTodoToState(/**@type {RemoveTodo} */(event));

        break;
    }
  }

  /**
   * Handles the LoadTodoList event.
   */
  async *_mapLoadTodoListToState() {
    const todos = await this.#todoService.searchTodos();

    yield new TodoListLoaded(todos);
  }

  /**
   * Handles the RemoveTodo event.
   * 
   * @param {RemoveTodo} event - The event containing the to-do item to remove.
   */
  async _mapRemoveTodoToState(event) {
    await this.#todoService.removeTodo(event.todo);

    this.add(new LoadTodoList());
  }
}
