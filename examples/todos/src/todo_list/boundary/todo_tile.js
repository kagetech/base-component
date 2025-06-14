import { BaseComponent, html } from '@kagetech/base-component';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

/**
 * A presentational component that displays a single to-do item.
 */
export class TodoTile extends BaseComponent {
  set index(index) {
    this.setProps({ index });
  }

  set todo(todo) {
    this.setProps({ todo });
  }

  styles() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .row span {
          flex: 1;
        }

        sl-button {
          flex: 0 0 80px; /* Fixed width, but allows shrink if needed */
          text-align: center;
        }
      </style>
    `;
  }

  render({ index, todo }) {
    return html`
      <sl-card>
        <div class="row">
          <span>${index + 1}. ${todo.contents}</span>
          <sl-button @click="${() => this._edit(todo)}">Edit</sl-button>
          <sl-button variant="danger" @click="${() => this._remove(todo)}">Remove</sl-button>
        </div>
      </sl-card>
    `;
  }

  _edit(todo) {
    this.dispatchEvent(
      new CustomEvent('todo-edited', {
        detail: { todo },
        bubbles: true,
        composed: true,
      }),
    );

  }

  _remove(todo) {
    this.dispatchEvent(
      new CustomEvent('todo-removed', {
        detail: { todo },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('todo-tile', TodoTile);
