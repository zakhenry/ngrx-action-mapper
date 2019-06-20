import { createFeatureSelector, createSelector } from '@ngrx/store';
import { usersAdapter, UsersRootState, UsersState } from './users.reducer';

export const getUsersState = createFeatureSelector<UsersState>('users');

export const {
  // select the array of user ids
  selectIds: selectUserIds,

  // select the dictionary of user entities
  selectEntities: selectUserEntities,

  // select the array of users
  selectAll: selectAllUsers,

  // select the total user count
  selectTotal: selectUserTotal,
} = usersAdapter.getSelectors<UsersRootState>(getUsersState);

export const getSelectedUserId = createSelector(
  getUsersState,
  state => state.selectedUserId,
);

export const getSelectedUser = createSelector(
  selectUserEntities,
  getSelectedUserId,
  (users, selected) => {
    if (!selected) {
      return null;
    }

    return users[selected];
  },
);
