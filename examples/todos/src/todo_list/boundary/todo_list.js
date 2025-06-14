import { BaseComponent, html } from '@kagetech/base-component';

import './todo_tile.js';

/**
 * A presentational component that displays a given list of to-do items.
 */
export class TodoList extends BaseComponent {
  set todos(todos) {
    this.setProps({ todos });
  }

  styles() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          padding: 16px;
        }

        todo-tile:not(:last-child)  {
          padding-bottom: 16px;
        }
      </style>
    `;
  }

  render({ todos }) {
    if (todos.length > 0) {
      return html`
        ${todos.map((todo, index) => html`
          <todo-tile .index=${index} .todo=${todo}></todo-tile>
        `)}
      `;
    } else {
      return html`<div>No todos found</div>`;
    }
  }
}

customElements.define('todo-list', TodoList);
