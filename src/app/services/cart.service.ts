import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CartLocalService } from './cart-local.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class CartService {
      private total = new BehaviorSubject<number>(0);
      total$ = this.total.asObservable();

      isLogedIn: boolean = false;

      constructor(
            private apollo: Apollo,
            private cartLocalService: CartLocalService,
            private authService: AuthService
      ) {
            this.isLogedIn = this.authService.getUser() != null;
            this.refrestTotal();
      }

      refrestTotal() {
            // if the user is not logged in fetch data from local
            if (!this.isLogedIn) {
                  const result = this.cartLocalService.getCart();
                  this.total.next(result.total); return;
            }

            // otherwise it will fetch from backend
            const sub: any = this.getAll({ page: 0, limit: 999999999 }).subscribe({
                  next: (result) => {
                        this.total.next(result.total);
                        sub.unsubscribe();
                  },
                  error: (error) => {
                        const code = error.graphQLErrors[0].extensions.code;
                        if (code == 'cart/cart-not-found') this.total.next(0);
                        sub.unsubscribe();
                  }
            });
      }

      getAll(filters?: any) {
            const query = `
                  query ($page: Int!, $limit: Int!) {
                        getAllCarts(page: $page, limit: $limit) {
                              total
                              totalPrice
                              listCart {
                                    _id
                                    amount
                                    cart_status
                                    recipe_id {
                                          _id
                                          availableStock
                                          discount
                                          discount_status
                                          name
                                          picture
                                          price_after_discount
                                          price
                                    }
                              }
                        }
                  }`;

            // default filters.
            const defaults = { page: 0, limit: 100 };

            // merge filters with default filters
            filters = Object.assign(defaults, filters || {});
            
            const response = this.apollo.query({
                  query: gql(query),
                  variables: { ...filters },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllCarts)
            );
      }

      getOne(id: string) {
            const query = `
                  query ($id: ID!) {
                        getOneCart(id: $id) {
                              _id
                              amount
                              cart_status
                              recipe_id {
                                    _id
                                    availableStock
                                    discount
                                    discount_status
                                    name
                                    picture
                                    price
                                    price_after_discount
                              }
                        }
                  }`;

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { id },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getOneCart)
            );
      }

      create(data: any) {
            const query = `
                  mutation ($data: CartMenuInput) {
                        createCart(menu: $data) { status }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.createCart)
            );
      }

      update(data: any) {
            const query = `
                  mutation ($data: MenuInput) {
                        updateCart(menu: $data) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateCart)
            );
      }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteCart(_id: $id) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteCart)
            );
      }
}
