/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */

export class User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export abstract class IQuery {
  abstract users():
    | Nullable<Nullable<User>[]>
    | Promise<Nullable<Nullable<User>[]>>;

  abstract findUserById(id: string): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
