/**
 * Base class for all counter events.
 * 
 * @abstract
 */
export class CounterEvent { } // NOSONAR

/**
 * Event to indicate that the counter should be incremented.
 * 
 * @extends {CounterEvent}
 */
export class CounterIncrement extends CounterEvent { }

/**
 * Event to indicate that the counter should be decremented.
 * 
 * @extends {CounterEvent}
 */
export class CounterDecrement extends CounterEvent { }
