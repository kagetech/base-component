import { BaseComponent, html } from '@kagetech/base-component';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

import { TodosServices } from '../../services/todos_services.js';
import { TodoListBloc } from '../control/todo_list_bloc.js';
import { LoadTodoList, RemoveTodo } from '../entity/todo_list_event.js';
import { TodoListLoaded, TodoListLoading } from '../entity/todo_list_state.js';

import './todo_list.js';

/**
 * A screen for displaying and managing a list of to-do items.
 */
export class TodoListScreen extends BaseComponent {
  constructor() {
    super(new TodoListBloc(TodosServices.todoService));
  }

  connectedCallback() {
    super.connectedCallback();

    this.bloc?.add(new LoadTodoList());
  }

  render({ state: { constructor, todos } }) {
    switch (constructor) {
      case TodoListLoading:
        return html`<sl-spinner></sl-spinner>`;
      case TodoListLoaded:
        return html`
          <todo-list .todos="${todos}"
                     @todo-edited="${e => this._editTodo(e)}"
                     @todo-removed="${e => this._removeTodo(e)}">
          </todo-list>

          <sl-button variant="primary" @click="${() => this._newTodo()}">Add Todo</sl-button>

          <sl-dialog label="Remove the todo?">
            You will not be able to recover it.
            <sl-button slot="footer" @click="${() => this._closeDialog()}">Cancel</sl-button>
            <sl-button slot="footer" variant="danger" @click="${() => this._doRemove()}">Yes, remove it!</sl-button>
          </sl-dialog>
        `;
      default:
        return html``;
    }
  }

  _editTodo({ detail: { todo } }) {
    this.navigate(`/todos/${todo.id}`, { params: { todo } });
  }

  _removeTodo({ detail: { todo } }) {
    const dialog = this.shadowRoot?.querySelector('sl-dialog');

    if (dialog) {
      dialog['todo'] = todo;

      dialog.show();
    }
  }

  _newTodo() {
    this.navigate('/todos/new');
  }

  _doRemove() {
    const dialog = this.shadowRoot?.querySelector('sl-dialog');
    const todo = dialog?.['todo'];

    this.bloc?.add(new RemoveTodo(todo));

    this._closeDialog();
  }

  _closeDialog() {
    const dialog = this.shadowRoot?.querySelector('sl-dialog');

    dialog?.hide();
  }
}

customElements.define('todo-list-screen', TodoListScreen);
