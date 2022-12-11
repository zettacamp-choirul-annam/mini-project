import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class AuthService {
      private readonly TOKEN_KEY = 'beef-token';
      private readonly USER_KEY  = 'beef-user';

      constructor(private apollo: Apollo) { }

      private setUser(data: any) {
            const { token, user } = data;

            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }

      getUser() {
            const user: any = localStorage.getItem(this.USER_KEY);
            return JSON.parse(user);
      }

      getToken() {
            const token = localStorage.getItem(this.TOKEN_KEY);
            return token;
      }

      login(data: any) {
            const query = `
                  mutation ($data: UserLoginInput) {
                        loginUser (user_input: $data) {
                              token, user { _id, balance, email, first_name, last_name, role }
                        }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => {
                        // save user data to local storage
                        this.setUser(result.data.loginUser);
                        return result.data.loginUser;
                  })
            );
      }

      logout() {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
      }

      resetPassword(data: any) {
            const query = `
                  mutation ($data: ForgotPasswordUsersInput) {
                        forgotPassword(user_input: $data) { }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.forgotPassword)
            );
      }
}
