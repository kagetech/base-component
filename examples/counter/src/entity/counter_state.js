/**
 * Base class representing the state of the counter.
 * 
 * @abstract
 */
export class CounterState {
  /** @type {number} */
  #value;

  /**
   * @param {number} value - The current value of the counter.
   */
  constructor(value) {
    this.#value = value;
  }

  /**
   * The current value of the counter.
   * 
   * @returns {number}
   */
  get value() {
    return this.#value;
  }
}

/**
 * Represents the initial state of the counter (value is 0).
 * 
 * @extends {CounterState}
 */
export class CounterInitialized extends CounterState {
  constructor() {
    super(0);
  }
}

/**
 * Represents an updated counter state after an increment or decrement.
 * 
 * @extends {CounterState}
 */
export class CounterUpdated extends CounterState { }
