import { Injectable } from '@angular/core';

@Injectable({
      providedIn: 'root'
})
export class AuthService {
      constructor() { }

      setUser(data: any) {
            const { token, user } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
      }

      getUser() {
            const user: any = localStorage.getItem('user');
            return JSON.parse(user);
      }

      getToken() {
            const token = localStorage.getItem('token');
            return token;
      }

      releaseUser() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
      }
}