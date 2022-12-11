import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class CartService {
      private total = new BehaviorSubject<number>(0);
      total$ = this.total.asObservable();

      constructor(private apollo: Apollo) {
            this.updateTotal();
      }

      getAll(filter?: any) {
            const query = `#graphql
                  query ($page: Int!, $limit: Int!) {
                        getAllCarts(page: $page, limit: $limit) {
                              total
                              totalPrice
                              listCart { 
                                    _id,
                                    amount
                                    note
                                    cart_status
                                    user_id,
                                    recipe_id { 
                                          _id
                                          name
                                          picture
                                          price,
                                          price_after_discount
                                          discount_status
                                    } 
                              }
                        }
                  }
            `;

            filter = filter || { limit: 100, page: 0 };

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { ...filter },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllCarts)
            );
      }

      updateTotal() {
            const query = `#graphql
                  query ($page: Int!, $limit: Int!) {
                        getAllCarts(page: $page, limit: $limit) { total }
                  }
            `;

            const sub: any = this.apollo.query({
                  query: gql(query),
                  variables: { page: 0, limit: 999999999 },
                  fetchPolicy: 'network-only'
            }) 
            .pipe(map((result: any) => result.data.getAllCarts.total))
            .subscribe({
                  next: (total) => {
                        this.total.next(total);
                        sub.unsubscribe();
                  },
                  error: (error) => {
                        const code = error.graphQLErrors[0].extensions.code;
                        if (code == 'cart/cart-not-found') this.total.next(0);
                        
                        sub.unsubscribe();
                  }
            })
      }

      getOne(id: string) {
            const query = `#graphql
                  mutation ($id: ID!) {
                        getOneCart(_id: $id) {
                              _id, amount, note, recipe_id, cart_status, user_id
                        }
                  }
            `;

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
            const query = `#graphql
                  mutation ($data: MenuInput) {
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
            const query = `#graphql
                  mutation ($data: MenuInput) {
                        updateCart(menu: $data) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateCart)
            );
      }

      delete(id: string) {
            const query = `#graphql
                  mutation ($id: ID!) {
                        deleteCart(_id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteCart)
            );
      }
}
