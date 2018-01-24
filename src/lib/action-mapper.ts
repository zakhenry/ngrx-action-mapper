import { Action, ActionReducer } from '@ngrx/store';

export interface PayloadAction<P = any> extends Action {
  payload?: P;
  constructor: StaticPayloadAction<P, this> | Function;
}

export interface StaticPayloadAction<P, A extends PayloadAction<P>> {
  new(...args: any[]): A;
  prototype: {payload?: P};
}

export type PayloadActionReducer<S, P, A extends PayloadAction<P>> = (state: S | undefined, payload: P) => S;

export class ActionMapper<S, A extends PayloadAction = PayloadAction> {

  private actionSet: Map<StaticPayloadAction<A['payload'], A> | string, PayloadActionReducer<S, any, any>[]> = new Map();

  constructor(private initialState?: S) {
  }

  public add<Payload>(actionType: StaticPayloadAction<Payload, A> | string, reducerFunction: PayloadActionReducer<S, Payload, A>): this {

    if (!this.actionSet.has(actionType)) {
      this.actionSet.set(actionType, []);
    }
    this.actionSet.get(actionType).push(reducerFunction);

    return this;
  }

  public buildReducer(): ActionReducer<S, A> {

    return (state: S = this.initialState, action: A): S => {

      if (!action) {
        return state;
      }

      const reducerFunctions: PayloadActionReducer<S, A['payload'], A>[] = [];
      if (this.actionSet.has(action.constructor as StaticPayloadAction<A['payload'], A>)) {
        reducerFunctions.push(...this.actionSet.get(action.constructor as StaticPayloadAction<A['payload'], A>));
      }
      if (this.actionSet.has(action.type)) {
        reducerFunctions.push(...this.actionSet.get(action.type));
      }

      return reducerFunctions.reduce<S>((prevState: S, reducerFunction: PayloadActionReducer<S, A['payload'], A>): S => {
        return reducerFunction(prevState, action.payload);
      }, state);
    };
  }

}
