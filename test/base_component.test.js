import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseComponent, Bloc, html } from '../index.js';

/**
 * A stateless test component extending BaseComponent.
 * Renders props passed via `setProps` without internal state management.
 */
class StatelessTestComponent extends BaseComponent {
  styles() {
    return html`<style>p { color: blue; }</style>`;
  }

  render({ name }) {
    return html`<p>Hello, ${name}!</p>`;
  }
}

customElements.define('stateless-test', StatelessTestComponent);

describe('BaseComponent (stateless)', () => {
  /** @type {StatelessTestComponent} */
  let component;

  beforeEach(() => {
    component = new StatelessTestComponent();

    document.body.appendChild(component);
  });

  it('renders with initial props', async () => {
    // When
    component.setProps({ name: 'Alice' });

    // Then
    await Promise.resolve(); // allow microtasks to run

    expect(component.shadowRoot?.innerHTML).toContain('Hello, Alice!');
  });

  it('includes styles in the shadow DOM', async () => {
    // When
    component.setProps({ name: 'Bob' });

    // Then
    await Promise.resolve();

    expect(component.shadowRoot?.querySelector('style')).not.toBeNull();
    expect(component.shadowRoot?.innerHTML).toContain('<style>p { color: blue; }</style>');
  });

  it('updates rendered output when props change', async () => {
    // Given
    component.setProps({ name: 'Charlie' });
    await Promise.resolve();

    // When
    component.setProps({ name: 'Dana' });

    // Then
    await Promise.resolve();

    expect(component.shadowRoot?.innerHTML).toContain('Hello, Dana!');
  });

  it('returns merged props after multiple setProps calls', () => {
    // Given
    component.setProps({ name: 'Alice' });

    // When
    component.setProps({ age: 30 });

    // Then
    expect(component.props).toEqual({ name: 'Alice', age: 30 });
  });

  it('returns default render and styles templates', () => {
    // Given
    customElements.define('base-component', BaseComponent);

    const component = new BaseComponent();

    // When
    const styles = component.styles();
    const template = component.render({});

    // Then
    expect(styles).toBeDefined();
    expect(template).toBeDefined();
  });
});

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
