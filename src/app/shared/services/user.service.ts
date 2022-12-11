import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class UserService {
      private balance = new BehaviorSubject<number>(0);
      balance$ = this.balance.asObservable();

      constructor(private apollo: Apollo) {
            this.refreshBalance();
      }

      resetPassword(data: any) {
            const query = `#graphql
                  mutation ($data: ForgotPasswordUsersInput) {
                        forgotPassword(user_input: $data) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.forgotPassword)
            );
      }

      login(data?: any) {
            const query = `#graphql
                  mutation ($data: UserLoginInput) {
                        loginUser(user_input: $data) {
                              token
                              user { 
                                    _id 
                                    email 
                                    first_name 
                                    last_name
                                    balance
                                    role
                              }
                        }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.loginUser)
            );
      }

      getAll(filter?: any) {
            const query = `#graphql
                  query ($filter: UsersFilter) {
                        getAllUsers(user_input: $filter) {
                              total
                              users { 
                                    _id 
                                    email 
                                    first_name 
                                    last_name
                                    balance
                                    user_question
                                    user_answer
                                    role
                              }
                        }
                  }
            `;

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { filter: filter || { limit: 100, page: 0 } },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllUsers)
            );
      }

      getOne(data: any) {
            const query = `#graphql
                  query ($id: ID, $email: String) {
                        getOneUser(_id: $id, email: $email) {
                              _id 
                              email 
                              first_name 
                              last_name
                              balance
                              user_question
                              user_answer
                              role
                        }
                  }
            `;

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { ...data },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getOneUser)
            );
      }

      refreshBalance() {
            const query = `#graphql
                  query { getOneUser { role, balance } }
            `;

            const response = this.apollo.query({
                  query: gql(query),
                  fetchPolicy: 'network-only'
            });

            const sub = response.pipe(map((result: any) => result.data.getOneUser)).subscribe({
                  next: (result) => {
                        sub.unsubscribe();
                        if (result.role == 'ADMIN') return;
                        this.balance.next(result.balance);
                  },
                  error: (error) => {
                        sub.unsubscribe();
                  }
            });
      }

      create(data: any) {
            const query = `#graphql
                  mutation ($data: UsersInput) {
                        createUser(user_input: $data) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.createUser)
            );
      }

      update(id: string, data: any) {
            const query = `#graphql
                  mutation ($id: ID!, $data: UpdateUserInput) {
                        updateUser(_id: $id, user_input: $data) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateUser)
            );
      }

      delete(id: string) {
            const query = `#graphql
                  mutation ($id: ID!) {
                        deleteUser(_id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteUser)
            );
      }
}