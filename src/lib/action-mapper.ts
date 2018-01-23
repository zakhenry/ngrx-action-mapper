import { Action, ActionReducer } from '@ngrx/store';

export class ActionMapper<S, A extends Action = Action> {

  public add(action: Action, reducerFn: ActionReducer<S, A>): this {
    return this;
  }

  public buildReducer(): ActionReducer<S, A> {
    return (state: S, a: A) => state;
  }

}
