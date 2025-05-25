import { Bloc } from '@felangel/bloc';
import { html, render, TemplateResult } from 'lit-html';
import { Subscription } from 'rxjs';

/**
 * A lightweight base class for creating web components with reactive props and templated rendering.
 * 
 * Designed to be extended. Subclasses can override `render()` and `styles()` to define the component's UI.
 * Automatically handles shallow prop updates and re-renders when props change.
 * Optionally integrates with a Bloc for reactive state management.
 * 
 * Example usage:
 * 
 * ```js
 * class MyComponent extends BaseComponent {
 *   set name(name) {
 *     this.setProps({ name });
 *   }
 *
 *   styles() {
 *     return html`<style>p { color: red; }</style>`;
 *   }
 *
 *   render({ name }) {
 *     return html`<p>Hello, ${name}!</p>`;
 *   }
 * }
 * ```
 * 
 * @extends HTMLElement
 */
export class BaseComponent extends HTMLElement {
  /**
   * Properties of the component.
   * 
   * @type {{ [key: string]: any }}
   */
  #props = {};

  /**
   * Optional Bloc instance managing external state.
   * 
   * @type {Bloc<any, any> | undefined}
   */
  #bloc;

  /**
   * Internal subscription to Bloc state changes.
   * 
   * @type {Subscription | undefined}
   */
  #subscription;

  /**
   * @param {Bloc<any, any>} [bloc] - Optional Bloc instance to bind external state management.
   */
  constructor(bloc) {
    super();

    this.#logGroup('constructor');

    this.#bloc = bloc;

    this.attachShadow({ mode: 'open' });

    this.#logGroupEnd();
  }

  /**
   * Returns the current props of the component.
   * 
   * @returns {{ [key: string]: any }}
   */
  get props() {
    return this.#props;
  }

  /** 
   * Returns the component's Bloc instance, if available.
   * 
   * @returns {Bloc<any, any> | undefined}
   */
  get bloc() {
    return this.#bloc;
  }

  /**
   * Merges and sets new props. Triggers re-render if props changed.
   * 
   * @param {{ [key: string]: any }} partialProps - Partial or full set of new props.
   */
  setProps(partialProps) {
    const newProps = { ...this.#props, ...partialProps };

    if (!this.#shallowEquals(this.#props, newProps)) {
      this.#props = newProps;

      if (this.isConnected) {
        this.requestUpdate();
      }
    }
  }

  /**
   * Lifecycle callback called when the component is added to the DOM.
   * Starts listening to Bloc state changes and triggers an initial render.
   */
  connectedCallback() {
    this.#logGroup('connectedCallback');

    this.#subscription = this.#bloc?.listen(state => {
      this.requestUpdate();
    });

    this.requestUpdate();

    this.#logGroupEnd();
  }

  /**
   * Lifecycle method called when the component is disconnected from the DOM.
   * Cleans up Bloc subscription and closes the Bloc if it was provided.
   */
  disconnectedCallback() {
    this.#logGroup('disconnectedCallback');

    this.#subscription?.unsubscribe();

    this.#bloc?.close();

    this.#logGroupEnd();
  }

  /**
   * Triggers a render of the component by applying its template and styles to the shadow DOM.
   * The render input includes the latest props and Bloc state (if present).
   */
  requestUpdate() {
    this.#logGroup('requestUpdate');

    const template = html`
      ${this.styles()}
      ${this.render({ ...this.#props, state: this.#bloc?.state })}
    `;

    if (this.shadowRoot) {
      render(template, this.shadowRoot);
    }

    this.#logGroupEnd();
  }

  /**
   * Override this method to define the component’s styles.
   * 
   * @returns {TemplateResult} A lit-html template containing styles.
   */
  styles() {
    return html``;
  }

  /**
   * Override this method to define the component’s UI template.
   * 
   * @param {Object} data - Data used to render the template (merged props + optional Bloc state).
   * 
   * @returns {TemplateResult} A lit-html template representing the component UI.
   */
  render(data) {
    return html``;
  }

  /**
   * Shallowly compares two objects for equality.
   * 
   * @param {Object} obj1 - First object to compare.
   * @param {Object} obj2 - Second object to compare.
   * 
   * @returns {boolean} True if both objects have the same keys and values; otherwise, false.
   */
  #shallowEquals(obj1, obj2) {
    return Object.keys(obj1).length === Object.keys(obj2).length
      && Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
  }

  /**
   * Logs the start of a grouped console message for the given method name.
   * 
   * This is only active in development mode (Vite's `import.meta.env.DEV`).
   *
   * @param {string} methodName - The name of the method being logged.
   */
  #logGroup(methodName) {
    if (import.meta.env.DEV) {
      console.group(`${this.constructor.name}.${methodName}`);
    }
  }

  /**
   * Ends the current grouped console message, if in development mode.
   */
  #logGroupEnd() {
    if (import.meta.env.DEV) {
      console.groupEnd();
    }
  }
}
