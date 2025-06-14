import { BaseComponent, html, Router } from '@kagetech/base-component';

import './todo/boundary/todo_screen.js';
import './todo_list/boundary/todo_list_screen.js';

/**
 * Root component of the Todos application.
 * 
 * Sets up application-level routing and layout.
 */
class TodosApp extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();

    const outlet = this.shadowRoot?.querySelector('main');
    const router = new Router(outlet);

    router.setRoutes([
      { path: '/', redirect: '/todos' },
      { path: '/todos', component: 'todo-list-screen' },
      { path: '/todos/new', component: 'todo-screen' },
      { path: '/todos/:todo', component: 'todo-screen' },
    ]);
  }

  styles() {
    return html`
      <style>
        :host {
          font-family: sans-serif;
        }
      </style>
    `;
  }

  render() {
    return html`
      <h2>Todos</h2>
      <main id="main"></main>
    `;
  }
}

customElements.define('todos-app', TodosApp);
