import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UsersFacade } from './store/users.facade';
import { AddOneUserAction, RemoveOneUserAction, SelectUserAction, User, UsersRootState } from './store/users.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';

  public users$: Observable<User[]> = this.usersFacade.users$;
  public selectedUser$: Observable<User> = this.usersFacade.selectedUser$;

  constructor(private store: Store<UsersRootState>, private usersFacade: UsersFacade) {}

  public addUser(name: string): void {
    this.store.dispatch(new AddOneUserAction({ id: new Date().valueOf().toString(), name }));
  }

  public deleteUser(id: string) {
    this.store.dispatch(new RemoveOneUserAction(id));
  }

  public selectUser(user: User) {
    this.store.dispatch(new SelectUserAction(user));
  }
}
