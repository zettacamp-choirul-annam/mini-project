import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class TransactionService {
      constructor(private apollo: Apollo) { }

      getAll(filter?: any) {
            const query = `#graphql
                  query ($filter: TransactionInput) {
                        getAllTransactions(filter: $filter) {
                              total
                              listTransaction {
                                    _id 
                                    order_date
                                    total_price
                                    user_id {
                                          _id
                                          first_name
                                          last_name
                                    }
                                    order_status
                                    rating_status
                                    menu { 
                                          amount 
                                          recipe_id { 
                                                _id
                                                picture
                                                name 
                                                price 
                                          }
                                    }
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
                  map((result: any) => result.data.getAllTransactions)
            );
      }

      getOne(id: string) {
            const query = `#graphql
                  query ($id: ID!) {
                        getOneTransaction(id: $id) {
                              _id, 
                              order_date,
                              total_price,
                              user_id,
                              order_status,
                              menu { 
                                    amount, 
                                    recipe_id { 
                                          _id,
                                          picture,
                                          name, 
                                          price 
                                    }
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
            const query = `#graphql
                  mutation ($menus: [MenuInput], $price: Float!) {
                        createTransaction(menu_input: $menus, totalPrice: $price) { 
                              _id, order_status,
                              decline_recipe {
                                    isStock,
                                    recipe_id,
                                    recipe_name
                              }
                        }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.createTransaction)
            );
      }

      update() {
            
      }

      delete(id: string) {
            const query = `#graphql
                  mutation ($id: ID!) {
                        deleteTransaction(id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteTransaction)
            );
      }
}
