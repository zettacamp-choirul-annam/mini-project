import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class UserService {
      private balance = new BehaviorSubject<number>(0);
      balance$ = this.balance.asObservable();
      
      constructor(private apollo: Apollo) { }

      refreshBalance() {
            const sub: any = this.getOne().subscribe({
                  next: (result) => {
                        this.balance.next(result.balance);
                        sub.unsubscribe();
                  },
                  error: (error) => {
                        console.log('Failed to fetch balance: ', error.message);
                        sub.unsubscribe();
                  }
            });
      }

      getAll(filters?: any) {
            const query = `
                  query (filters: UsersFilter) {
                        getAllUsers (user_input: $filters) {
                              total, 
                              users { _id, balance, email, first_name, last_name, role }
                        }
                  }`;

            // default filters.
            const defaults = { page: 0, limit: 100 };

            // merge filters with default filters
            filters = Object.assign(defaults, filters || {});
            
            const response = this.apollo.query({
                  query: gql(query),
                  variables: { filters },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllUsers)
            );
      }

      getOne() {
            const query = `
                  query {
                        getOneUser {
                              _id, balance, email, first_name, last_name, role
                        }
                  }`;
                  
            const response = this.apollo.query({
                  query: gql(query),
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getOneUser)
            );
      }

      create(data: any) {
            const query = `
                  mutation ($data: UsersInput) {
                        createUser(user_input: $data) { _id }
                  }`;
            
            data = data || {};

            // set default user role
            data.role = data.role || 'USER';

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.createUser)
            );
      }

      update(id: string, data: any) {
            const query = `
                  mutation ($id: ID!, $data: UpdateUserInput) {
                        updateUser(_id: $id, user_input: $data) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateUser)
            );
      }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteUser(_id: $id) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteUser)
            );
      }
}
