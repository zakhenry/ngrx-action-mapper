import { EntityAdapter } from '@ngrx/entity';
import { ActionMapper, PayloadAction, StaticPayloadAction } from './action-mapper';

type PayloadActionFunction<S, P> = (p: P, s: S) => S;
type PayloadlessActionFunction<S> = (s: S) => S;
export type EntityFunction<S, P> = PayloadActionFunction<S, P> | PayloadlessActionFunction<S>;

export class EntityActionMapper<Entity, State, Action extends PayloadAction = PayloadAction> extends ActionMapper<State, Action> {

  constructor(initialState: State, private adapter: EntityAdapter<Entity>) {
    super(initialState);
  }

  public mapEntityAction<Payload>(action: StaticPayloadAction<Payload, Action> | string,
                                  adapterFunctionGetter: (adapter: EntityAdapter<Entity>) => EntityFunction<State, Payload>): this {
    const adapterFunction = adapterFunctionGetter(this.adapter);

    return this.add(action, (state: State, payload: Payload) => {
      if (this.isPayloadFunction(adapterFunction)) {
        return adapterFunction(payload, state);
      }

      return adapterFunction(state);
    });
  }

  private isPayloadFunction<S, P>(fn: EntityFunction<S, P>): fn is PayloadActionFunction<S, P> {
    return fn.length === 2;
  }

}
