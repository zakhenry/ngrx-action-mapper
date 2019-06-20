import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { usersReducer } from './store/users.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StoreModule.forRoot({}), StoreModule.forFeature('users', usersReducer), CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
