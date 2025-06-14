import { BaseComponent, html } from '@kagetech/base-component';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

import { TodosServices } from '../../services/todos_services.js';
import { TodoBloc } from '../control/todo_bloc.js';
import { AddTodo, UpdateTodo } from '../entity/todo_event.js';
import { TodoSaved } from '../entity/todo_state.js';

/**
 * A screen for creating or editing a to-do item.
 */
export class TodoScreen extends BaseComponent {
  constructor() {
    super(new TodoBloc(TodosServices.todoService));
  }

  set todo(todo) {
    this.setProps({ todo });
  }

  listen({ state }) {
    if (state instanceof TodoSaved) {
      const alert = this.shadowRoot?.querySelector('sl-alert');

      alert?.toast();

      this.navigate('/');
    }
  }

  styles() {
    return html`
      <style>
        form {
          padding: 16px;
        }
      </style>
    `;
  }

  render({ todo }) {
    return html`
      <form>
        <sl-input
          id="todo"
          name="todo"
          label="Todo"
          placeholder="Enter todo..."
          value="${todo?.contents ?? ''}"
          clearable>
        </sl-input>
      </form>

      <sl-button variant="success" @click="${() => this._save(todo)}">Save</sl-button>
      <sl-button variant="text" @click=${() => this.navigate('/')}>Back</sl-button>

      <sl-alert variant="success" duration="3000" closable>
        <sl-icon slot="icon" name="check2-circle"></sl-icon>
        Todo saved successfully
      </sl-alert>
    `;
  }

  _save(updatedTodo) {
    const todoContents = this.shadowRoot?.getElementById('todo')?.['value'].trim();

    if (updatedTodo) {
      this.bloc?.add(new UpdateTodo({ ...updatedTodo, contents: todoContents }));
    } else {
      this.bloc?.add(new AddTodo({ contents: todoContents }));
    }
  }
}

customElements.define('todo-screen', TodoScreen);
