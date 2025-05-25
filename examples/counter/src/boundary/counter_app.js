import { BaseComponent, html } from '@kagetech/base-component';

import { CounterBloc } from '../control/counter_bloc.js';
import { CounterDecrement, CounterIncrement } from '../entity/counter_event.js';

class CounterApp extends BaseComponent {
  constructor() {
    super(new CounterBloc());
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

  render({ state }) {
    return html`
      <h1>counter: ${state.value}</h1>
      <button @click="${_ => this.#incrementCounter()}">increment</button>
      <button @click="${_ => this.#decrementCounter()}">decrement</button>
    `;
  }

  #incrementCounter() {
    this.bloc?.add(new CounterIncrement());
  }

  #decrementCounter() {
    this.bloc?.add(new CounterDecrement());
  }
}

customElements.define('counter-app', CounterApp);
