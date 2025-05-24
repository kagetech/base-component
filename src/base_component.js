import { html, render, TemplateResult } from 'lit-html';

/**
 * A lightweight base class for creating web components with reactive props and templated rendering.
 * 
 * Designed to be extended. Subclasses can override `render()` and `styles()` to define the component's UI.
 * Automatically handles shallow prop updates and re-renders when props change.
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

  constructor() {
    super();

    this.#logGroup('constructor');

    this.attachShadow({ mode: 'open' });

    this.#logGroupEnd();
  }

  /**
   * Returns the current props of the component.
   * 
   * @returns {Object}
   */
  get props() {
    return this.#props;
  }

  /**
   * Merges and sets new props. Triggers re-render if props changed.
   * 
   * @param {Object} partialProps - Partial or full set of new props.
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
   */
  connectedCallback() {
    this.#logGroup('connectedCallback');

    this.requestUpdate();

    this.#logGroupEnd();
  }

  /**
   * Triggers rendering of the component.
   */
  requestUpdate() {
    this.#logGroup('requestUpdate');

    const template = html`
      ${this.styles()}
      ${this.render(this.#props)}
    `;

    if (this.shadowRoot) {
      render(template, this.shadowRoot);
    }

    this.#logGroupEnd();
  }

  /**
   * Override to define component styles.
   * 
   * @returns {TemplateResult}
   */
  styles() {
    return html``;
  }

  /**
   * Override to define the component template.
   * 
   * @param {Object} data - Props used to render the template.
   * 
   * @returns {TemplateResult}
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
