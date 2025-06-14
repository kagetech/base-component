import { Bloc } from '@kagetech/base-component';

import { TodoService } from '../../services/todo_service/boundary/todo_service.js';
import { AddTodo, TodoEvent, UpdateTodo } from '../entity/todo_event.js';
import { TodoEdited, TodoNotSaved, TodoSaved, TodoSaving, TodoState } from '../entity/todo_state.js';

/**
 * Business logic component managing the state of a to-do item.
 * 
 * @extends {Bloc<TodoEvent, TodoState>}
 */
export class TodoBloc extends Bloc {
  /** @type {TodoService} */
  #todoService;

  /**
   * @param {TodoService} todoService - The service used for data access.
   */
  constructor(todoService) {
    super(new TodoEdited({ contents: '' }));

    this.#todoService = todoService;
  }

  /**
   * @param {TodoEvent} event
   * 
   * @returns {AsyncGenerator<TodoState, void, unknown>}
   */
  async *mapEventToState(event) {
    switch (event.constructor) {
      case AddTodo:
        yield* this.#mapAddTodoToState(event);

        break;
      case UpdateTodo:
        yield* this.#mapUpdateTodoToState(event);

        break;
    }
  }

  /**
   * Handles the AddTodo event.
   * 
   * @param {AddTodo} event - Event containing the to-do to add.
   */
  async *#mapAddTodoToState(event) {
    const todo = event.todo;

    yield new TodoSaving(todo);

    const savedTodo = await this.#todoService.addTodo(todo);

    yield new TodoSaved(savedTodo);
  }

  /**
   * Handles the UpdateTodo event.
   * 
   * @param {UpdateTodo} event - Event containing the to-do to update.
   */
  async *#mapUpdateTodoToState(event) {
    const todo = event.todo;

    yield new TodoSaving(todo);

    const savedTodo = await this.#todoService.updateTodo(todo);

    if (savedTodo) {
      yield new TodoSaved(savedTodo);
    } else {
      yield new TodoNotSaved(event.todo);
    }
  }
}
