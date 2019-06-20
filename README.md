# Ngrx Action Mapper

Simple utility for building Ngrx reducer with less boilerplate

[![npm version](https://badge.fury.io/js/ngrx-action-mapper.svg)](https://www.npmjs.com/package/ngrx-action-mapper)
[![Build Status](https://travis-ci.org/zakhenry/ngrx-action-mapper.svg?branch=master)](https://travis-ci.org/zakhenry/ngrx-action-mapper)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)

## Install

Install the [npm package](https://www.npmjs.com/package/ngrx-action-mapper): `ngrx-action-mapper`

```sh
# with npm
npm install ngrx-action-mapper
# or with yarn
yarn add ngrx-action-mapper
```

## Usage

```ts
// src/app/store/users.reducer.ts

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
```
