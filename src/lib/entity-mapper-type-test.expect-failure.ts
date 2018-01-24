import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EntityActionMapper } from './entity-action-mapper';

interface Person {
  name: string;
  id: number;
}

class CreatePersonAction implements Action {
  type: 'CreatePersonAction';

  constructor(public payload: Person) {
  }
}

interface PersonState extends EntityState<Person> {
}

const peopleAdapter: EntityAdapter<Person> = createEntityAdapter<Person>();

const initialPeopleState: PersonState = peopleAdapter.getInitialState();

const mapper = new EntityActionMapper(initialPeopleState, peopleAdapter);

/**
 * Expect:
 * TS2345: Argument of type '(a: EntityAdapter<Person>) => <S extends EntityState<Person>>(update: Update<Person>, state: S) =...' is not assignable to parameter of type '(adapter: EntityAdapter<Person>) => EntityFunction<PersonState, Person>'.
 *   Type '<S extends EntityState<Person>>(update: Update<Person>, state: S) => S' is not assignable to type 'EntityFunction<PersonState, Person>'.
 *     Type '<S extends EntityState<Person>>(update: Update<Person>, state: S) => S' is not assignable to type 'PayloadActionFunction<PersonState, Person>'.
 *       Types of parameters 'update' and 'p' are incompatible.
 *         Type 'Person' is not assignable to type 'Update<Person>'.
 *           Type 'Person' is not assignable to type 'UpdateNum<Person>'.
 *             Property 'changes' is missing in type 'Person'.
 */
mapper.mapEntityAction(CreatePersonAction, a => a.updateOne);
