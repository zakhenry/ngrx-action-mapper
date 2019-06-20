import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EntityActionMapper } from 'ngrx-action-mapper';

export interface User {
  id: string;
  name: string;
}

export abstract class BaseAction<Payload = never> {
  public type: string = this.constructor.name;

  constructor(public payload?: Payload) {}
}

export class AddOneUserAction extends BaseAction<User> {}
export class RemoveOneUserAction extends BaseAction<string> {}
export class SelectUserAction extends BaseAction<User> {}

export interface UsersState extends EntityState<User> {
  // additional entity state properties
  selectedUserId: string | null;
}

export interface UsersRootState extends EntityState<User> {
  users: UsersState;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  selectedUserId: null,
});

export const actionReducer = new EntityActionMapper(initialUsersState, usersAdapter)
  .mapEntityAction(AddOneUserAction, adapter => adapter.addOne)
  .mapEntityAction(RemoveOneUserAction, adapter => adapter.removeOne)
  .add(
    SelectUserAction,
    (state: UsersState, user: User): UsersState => {
      return { ...state, selectedUserId: user.id };
    },
  )
  .buildReducer();

export function usersReducer(state: UsersState, action: Action): UsersState {
  return actionReducer(state, action);
}
