import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseComponent, Bloc, html } from '../index.js';

/**
 * A test Bloc implementation with simple string state transitions.
 * Used for testing BaseComponent with stateful behavior.
 */
class TestBloc extends Bloc {
  constructor() {
    super('initial');
  }

  async *mapEventToState(event) {
    yield this.state + event;
  }
}

/**
 * A stateful test component using TestBloc for managing state.
 * Renders the current Bloc state inside a <p> tag.
 */
class StatefulTestComponent extends BaseComponent {
  constructor() {
    super(new TestBloc());
  }

  listen({ state }) {
    // Stub for spy
  }

  render({ state }) {
    return html`<p>State: ${state}</p>`;
  }
}

customElements.define('stateful-test', StatefulTestComponent);

describe('BaseComponent (stateful with Bloc)', () => {
  /** @type {StatefulTestComponent} */
  let component;

  beforeEach(() => {
    component = new StatefulTestComponent();

    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('renders initial state from Bloc', async () => {
    // Then
    await Promise.resolve();

    expect(component.shadowRoot?.innerHTML).toContain('State: initial');
  });

  it('reacts to state changes from Bloc', async () => {
    // When
    component.bloc?.add('next');

    // Then
    await waitForBlocUpdate(component.bloc);

    expect(component.shadowRoot?.innerHTML).toContain('State: initialnext');
  });

  it('notifies of state change', async () => {
    // Given
    component.setProps({ foo: 'bar' });

    const spyListen = vi.spyOn(component, 'listen');

    // When
    component.bloc?.add('next');

    // Then
    await waitForBlocUpdate(component.bloc);

    expect(spyListen).toHaveBeenCalledWith({
      foo: 'bar',
      state: 'initialnext',
    });
  });

  it('closes Bloc on disconnect', () => {
    // Given
    if (!component.bloc) {
      throw new Error('Bloc is undefined');
    }

    const spyClose = vi.spyOn(component.bloc, 'close');

    // When
    component.remove();

    // Then
    expect(spyClose).toHaveBeenCalled();
  });
});

/**
 * Waits for the next state emission from a Bloc and resolves with that state.
 * 
 * @template T
 * 
 * @param {Bloc<any, T> | undefined} bloc
 * 
 * @returns {Promise<T>}
 */
function waitForBlocUpdate(bloc) {
  return new Promise(resolve => {
    const subscription = bloc?.listen(state => {
      subscription?.unsubscribe();

      resolve(state);
    });
  });
}
