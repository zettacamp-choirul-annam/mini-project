import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class TransactionService {
      constructor(private apollo: Apollo) { }

      getAll(filters?: any) {
            const query = `
                  query ($filters: TransactionInput) {
                        getAllTransactions(filter: $filters) {
                              total
                              listTransaction {
                                    _id
                                    decline_recipe {
                                          isStock
                                          recipe_id
                                          recipe_name
                                    }
                                    is_balance
                                    is_stock
                                    order_date
                                    order_status
                                    rating_status
                                    total_price
                                    user_id {
                                          _id
                                          first_name
                                          last_name
                                    }
                                    menu {
                                          amount
                                          discount
                                          discount_status
                                          name
                                          picture
                                          price
                                          price_after_discount
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
                  variables: { filters },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllTransactions)
            );
      }

      getOne(id: string) {
            const query = `
                  query ($id: ID!) {
                        getOneTransaction(id: $id) {
                              _id
                              decline_recipe {
                                    isStock
                                    recipe_id
                                    recipe_name
                              }
                              is_balance
                              is_stock
                              order_date
                              order_status
                              rating_status
                              total_price
                              user_id {
                                    _id
                                    first_name
                                    last_name
                              }
                              menu {
                                    amount
                                    discount
                                    discount_status
                                    name
                                    picture
                                    price
                                    price_after_discount
                              }
                        }
                  }
            `;

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { id },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getOneTransaction)
            );
      }

      create(data: any) {
            const keys = [
                  "discount", "amount", "discount_status",
                  "name", "picture", "note", "price",
                  "price_after_discount", "recipe_id"
            ];

            let { total, menus } = data;

            menus = menus.map((item: any) => {
                  const menu: any = {};

                  for (let [key, value] of Object.entries(item)) {
                        if (keys.includes(key)) menu[key] = value;
                  }

                  return menu;
            });

            const query = `
                  mutation ($total: Float!, $menus: [MenuInput]) {
                        createTransaction(totalPrice: $total, menu_input: $menus) {
                              _id
                              decline_recipe {
                                    recipe_id
                                    isStock
                                    recipe_name
                              }
                              is_balance
                              is_stock
                        }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { total, menus }
            });

            return response.pipe(
                  map((result: any) => result.data.createTransaction)
            );
      }

      update() { }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteTransaction(id: $id) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteTransaction)
            );
      }
}