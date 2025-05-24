import { beforeEach, describe, expect, it } from 'vitest';

import { BaseComponent, html } from '../index.js';

/**
 * A test subclass to verify render and styles behavior.
 */
class TestComponent extends BaseComponent {
  styles() {
    return html`<style>p { color: blue; }</style>`;
  }

  render({ name }) {
    return html`<p>Hello, ${name}!</p>`;
  }
}

customElements.define('test-component', TestComponent);

describe('TestComponent (subclass of BaseComponent)', () => {
  /** @type {TestComponent} */
  let component;

  beforeEach(() => {
    component = new TestComponent();

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
