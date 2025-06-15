# Base Component

A lightweight base class for building web components with reactive props and templated rendering.

## Features

- Reactive property system with shallow diffing and update triggers
- Templated rendering using [lit-html](https://github.com/lit/lit/tree/main/packages/lit-html)
- Built-in state management using the Bloc pattern, implemented via the [@felangel/bloc](https://github.com/felangel/bloc.js/tree/master/packages/bloc) library
- Routing support via [Vaadin Router](https://github.com/vaadin/router)
- Comprehensive test coverage
- Development-only grouped console logging (tree-shakable in production)
- Full JSDoc documentation for IDE support

## Usage

### Basic Component

```javascript
import { BaseComponent, html } from '@kagetech/base-component';

class MyComponent extends BaseComponent {
  styles() {
    return html`
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }
      </style>
    `;
  }

  render() {
    return html`
      <div>Hello World!</div>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

### Component with Properties

```javascript
import { BaseComponent, html } from '@kagetech/base-component';

class TodoTile extends BaseComponent {
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
      </style>
    `;
  }

  render({ index, todo }) {
    return html`
      <div class="row">
        <span>${index + 1}. ${todo.contents}</span>
        <button @click="${() => this._edit(todo)}">Edit</button>
      </div>
    `;
  }

  _edit(todo) {
    this.dispatchEvent(
      new CustomEvent('todo-edited', {
        detail: { todo },
        bubbles: true,
        composed: true,
      })
    );
  }
}
```

### State Management with BLoC

```javascript
import { BaseComponent, Bloc, html } from '@kagetech/base-component';

// Define your events
class CounterIncrement {}
class CounterDecrement {}

// Define your states
class CounterState {
  /** @type {number} */
  value;

  /**
   * @param {number} value - The current value of the counter.
   */
  constructor(value) {
    this.value = value;
  }
}

class CounterInitialized extends CounterState {
  constructor() {
    super(0);
  }
}

// Create your BLoC
class CounterBloc extends Bloc {
  constructor() {
    super(new CounterInitialized());
  }

  async *mapEventToState(event) {
    switch (event.constructor) {
      case CounterIncrement:
        yield new CounterState(this.state.value + 1);
        break;
      case CounterDecrement:
        if (this.state.value > 0) {
          yield new CounterState(this.state.value - 1);
        }
        break;
    }
  }
}

// Use in your component
class CounterApp extends BaseComponent {
  constructor() {
    super(new CounterBloc());
  }

  // Optional: React to state changes before rendering
  listen({ state }) {
    // Handle side effects based on state changes
    console.log('State changed:', state);
  }

  render({ state }) {
    return html`
      <h1>Counter: ${state.value}</h1>
      <button @click="${() => this.bloc?.add(new CounterIncrement())}">Increment</button>
      <button @click="${() => this.bloc?.add(new CounterDecrement())}">Decrement</button>
    `;
  }
}
```

### Routing

```javascript
import { BaseComponent, html, Router } from '@kagetech/base-component';

class App extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();

    const outlet = this.shadowRoot?.querySelector('main');
    const router = new Router(outlet);

    router.setRoutes([
      { path: '/', redirect: '/users' },
      { path: '/users', component: 'user-list-screen' },
      { path: '/users/:id', component: 'user-screen' },
      { path: '/about', component: 'about-screen' },
    ]);
  }

  render() {
    return html`
      <nav>
        <a href="/users">Users</a>
        <a href="/about">About</a>
      </nav>
      <main></main>
    `;
  }
}

// Navigation with parameters
class UserListScreen extends BaseComponent {
  // ...
  _navigateToUser(user) {
    this.navigate(`/users/${user.id}?status=active`, {
      params: {
        user,
        status: { active: true, passwordChangeDays: 10 }
      }
    });
  }
}

class UserScreen extends BaseComponent {
  set user(user) {
    this.setProps({ user });
  }

  set status(status) {
    this.setProps({ status });
  }

  render({ user, status }) {
    return html`
      <div>
        <h1>User Details</h1>
        <p>ID: ${user.id}</p>
        <p>Name: ${user.name}</p>
        ${status?.active ? html`
          <p>Password change required in ${status.passwordChangeDays} days</p>
        ` : ''}
        <button @click="${() => this.navigate('/users')}">Back to List</button>
      </div>
    `;
  }
}
```

## Development

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Examples

The project includes two example applications that demonstrate how to use Base Component:

1. [Counter Example](examples/counter) - A simple counter application that demonstrates basic state management and event handling
2. [Todo Example](examples/todos) - A more complex todo application that shows how to build a full-featured application with multiple components and state management

Each example includes its own README with detailed instructions on how to run and understand the code.

## License

This project is released under the [BSD 2-Clause License](LICENSE).
