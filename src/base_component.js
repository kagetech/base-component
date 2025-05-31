import { Bloc } from '@felangel/bloc';
import { Router } from '@vaadin/router';
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
   * Called before the component is rendered via the router.
   * 
   * Populates component properties using route parameters or search parameters.
   * If complex objects were passed using `navigate()`, they are retrieved from
   * a temporary store on the `window` object using a unique key based on
   * the target path and query string.
   * 
   * @param {import('@vaadin/router').RouterLocation} location - Current route location object.
   */
  onBeforeEnter(location) {
    this.#logGroup('onBeforeEnter');

    const passedParamsLocation = location.pathname + location.search;
    const passedParams = window[passedParamsLocation];

    // cleanup
    delete window[passedParamsLocation];

    const combinedParams = {
      ...location.params,
      ...Object.fromEntries(location.searchParams)
    };

    for (const [key, value] of Object.entries(combinedParams)) {
      this[key] = passedParams?.[key] ?? value;
    }

    this.#logGroupEnd();
  }

  /**
   * Lifecycle callback called when the component is added to the DOM.
   * Starts listening to Bloc state changes and triggers an initial render.
   */
  connectedCallback() {
    this.#logGroup('connectedCallback');

    this.#subscription = this.#bloc?.listen(state => {
      this.listen({ ...this.#props, state });

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
   * Called whenever the Bloc state changes.
   * 
   * Override this method to perform side effects in response to state changes,
   * such as triggering animations, logging, or dispatching additional events.
   * 
   * This method receives the same data object as `render()`, which includes the latest
   * merged props and the current Bloc state.
   * 
   * @param {{ [key: string]: any, state?: any }} data - Merged props and current Bloc state.
   */
  listen(data) {
    // This is intentional
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
   * @param {{ [key: string]: any, state?: any }} data - Merged props and current Bloc state.
   * 
   * @returns {TemplateResult} A lit-html template representing the component UI.
   */
  render(data) {
    return html``;
  }

  /**
   * Navigates to a given path using the Vaadin Router.
   * 
   * Optionally stores temporary parameters in the global `window` object,
   * allowing the next screen to access complex data not easily passed via URL.
   * 
   * Note: The parameters are keyed by the full path, so be cautious of potential collisions
   * if navigating to the same path with different parameters rapidly.
   * 
   * Example usage:
   * 
   * ```js
   * // Navigate to '/users/:user' and pass an object via window
   * this.navigate('/users/123', {
   *   params: { user: { id: 123, name: 'Alice' } }
   * });
   * ```
   * 
   * @param {string} path - The target route path (should match a route defined in the router).
   * @param {Object} [options] - Navigation options.
   * @param {Object} [options.params] - Parameters to pass temporarily via the `window` object.
   */
  navigate(path, { params = {} } = {}) {
    if (Object.keys(params).length > 0) {
      window[path] = params;
    }

    Router.go(path);
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
