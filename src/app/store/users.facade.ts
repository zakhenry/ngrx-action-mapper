import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, UsersRootState } from './users.reducer';
import { getSelectedUser, selectAllUsers } from './users.selectors';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  public users$: Observable<User[]> = this.store.pipe(select(selectAllUsers));
  public selectedUser$: Observable<User> = this.store.pipe(select(getSelectedUser));

  constructor(private store: Store<UsersRootState>) {}
}
