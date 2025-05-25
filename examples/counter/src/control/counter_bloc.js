import { Bloc } from '@kagetech/base-component';

import { CounterDecrement, CounterEvent, CounterIncrement } from '../entity/counter_event.js';
import { CounterInitialized, CounterState, CounterUpdated } from '../entity/counter_state.js';

/**
 * Business logic component managing the state of a counter.
 * 
 * @extends {Bloc<CounterEvent, CounterState>}
 */
export class CounterBloc extends Bloc {
  constructor() {
    super(new CounterInitialized());
  }

  /**
   * @param {CounterEvent} event
   * 
   * @returns {AsyncGenerator<CounterState, void, unknown>}
   */
  async *mapEventToState(event) {
    switch (event.constructor) {
      case CounterIncrement:
        yield new CounterUpdated(this.state.value + 1);

        break;
      case CounterDecrement:
        if (this.state.value > 0) {
          yield new CounterUpdated(this.state.value - 1);
        }

        break;
    }
  }
}
