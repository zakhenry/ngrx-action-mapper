import { Action } from '@ngrx/store';
import { ActionMapper } from './action-mapper';

class ChangeFooAction implements Action {
  type: 'ChangeFooAction';

  constructor(public payload: string) {}
}

interface FooState {
  foo: string;
}

function reducerFunction(state: FooState, foo: number): FooState {
  return state;
}

const mapper = new ActionMapper();

// tslint:disable:max-line-length
/**
 * Expect:
 * TS2345: Argument of type '(state: FooState, foo: number) => FooState' is not assignable to parameter of type 'PayloadActionReducer<{}, string, PayloadAction<any>>'.
 *   Types of parameters 'foo' and 'payload' are incompatible.
 *     Type 'string' is not assignable to type 'number'.
 */
mapper.add(ChangeFooAction, reducerFunction);
