import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EntityActionMapper } from './entity-action-mapper';

describe('EntityActionMapper', () => {

  it('should inherit from the ActionMapper and exhibit the same behavior', () => {

    const action = { type: 'dummy-action' };
    const initialState = { foo: 'bar' };
    const expectedUpdate = { foo: 'baz' };

    function reducerFunction(state) {
      return expectedUpdate;
    }

    const entityAdapter: EntityAdapter<{}> = createEntityAdapter<{}>();

    const reducer = new EntityActionMapper({}, entityAdapter)
      .add(action.type, reducerFunction)
      .buildReducer();

    const update = reducer(initialState, action);

    expect(update).toBe(expectedUpdate);
  });

  it('can map actions from an entity adapter', () => {

    const action = { type: 'addOne', payload: { name: 'Joe Bloggs', id: 1 } };

    interface Person {
      name: string;
    }

    interface PersonState extends EntityState<Person> {
    }

    const peopleAdapter: EntityAdapter<Person> = createEntityAdapter<Person>();

    const initialPeopleState: PersonState = peopleAdapter.getInitialState();

    const reducer = new EntityActionMapper(initialPeopleState, peopleAdapter)
      .mapEntityAction(action.type, a => a.addOne)
      .buildReducer();

    const update = reducer(initialPeopleState, action);

    expect(update).toEqual({
      ids: [1],
      entities: {
        1: action.payload,
      },
    });

  });

});
