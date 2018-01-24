import { Action } from '@ngrx/store';
import { ActionMapper } from './action-mapper';

describe('ActionMapper', () => {

  it('should be able to register an action against a payload reducer function, and return the mapper', () => {

    const mapper = new ActionMapper();

    const action = { type: 'dummy-action' };
    const reducerFunction = jasmine.createSpy('actionMapper');

    expect(mapper.add(action.type, reducerFunction)).toBe(mapper);
  });

  it('should create a reducer that passes the state through when null action is passed', () => {

    const reducer = new ActionMapper().buildReducer();

    const state = { foo: 'bar' };

    const update = reducer(state, null);

    expect(update).toBe(state);
  });

  it('should be able to register a reducer function which updates the state when an object action is received', () => {

    const action = { type: 'dummy-action' };
    const initialState = { foo: 'bar' };
    const expectedUpdate = { foo: 'baz' };

    function reducerFunction(state) {
      return expectedUpdate;
    }

    const reducer = new ActionMapper()
      .add(action.type, reducerFunction)
      .buildReducer();

    const update = reducer(initialState, action);

    expect(update).toBe(expectedUpdate);
  });

  it('should be able to register a reducer function which updates the state when a class action is received', () => {

    class ClassAction implements Action {
      type: 'ClassAction';

      constructor(public payload?: never) {
      }
    }

    const action = new ClassAction();
    const initialState = { foo: 'bar' };
    const expectedUpdate = { foo: 'baz' };

    function reducerFunction(state) {
      return expectedUpdate;
    }

    const reducer = new ActionMapper()
      .add(ClassAction, reducerFunction)
      .buildReducer();

    const update = reducer(initialState, action);

    expect(update).toBe(expectedUpdate);
  });

  it('should partially update the state when a sub-state action reducer is applied', () => {

    class ChangeFooAction implements Action {
      type: 'ChangeFooAction';

      constructor(public payload: string) {
      }
    }

    interface FooState {
      foo: string;
    }

    const action = new ChangeFooAction('baz');
    const initialState: FooState = { foo: 'bar' };
    const expectedUpdate: FooState = { foo: 'baz' };

    function reducerFunction(state: FooState, foo: string): FooState {
      return { ...state, ...{ foo } };
    }

    const reducer = new ActionMapper()
      .add(ChangeFooAction, reducerFunction)
      .buildReducer();

    const update = reducer(initialState, action);

    expect(update).not.toBe(expectedUpdate);
    expect(update).toEqual(expectedUpdate);
  });

  it('can map multiple functions (in order) to the same action', () => {

    const action = { type: 'do-maths' };
    const initialState = { foo: 1 };
    const expectedUpdate = { foo: -2 };

    function incrementFunction(state) {
      return {
        ...state,
        ...{ foo: state.foo + 1 },
      };
    }

    function negateFunction(state) {
      return {
        ...state,
        ...{ foo: state.foo *= -1 },
      };
    }

    const reducer = new ActionMapper()
      .add(action.type, incrementFunction)
      .add(action.type, negateFunction)
      .buildReducer();

    const update = reducer(initialState, action);

    expect(update).toEqual(expectedUpdate);

  });

});
