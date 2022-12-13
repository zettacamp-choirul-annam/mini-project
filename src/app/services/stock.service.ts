import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class StockService {
      constructor(private apollo: Apollo) { }

      getAll(filters?: any) {
            const query = `
                  query ($filters: IngredientFilter) {
                        getAllIngredients(filter: $filters) {
                              total,
                              listIngredient { _id, name, stock, unit, list_recipe }
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
                  map((result: any) => result.data.getAllIngredients)
            );
      }

      getOne(id: string) {
            const query = `
                  query ($id: ID!) {
                        getOneIngredient(_id: $id) {
                              _id, name, stock, unit, list_recipe
                        }
                  }
            `;
            
            const response = this.apollo.query({
                  query: gql(query),
                  variables: { id },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getOneIngredient)
            );
      }

      create(data: any) {
            const query = `
                  mutation ($name: String!, $stock: Float!, $unit: String!) {
                        createIngredient(name: $name, stock: $stock, unit: $unit) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.createIngredient)
            );
      }

      update(id: string, data: any) {
            const query = `
                  mutation ($id: ID!, $stock: Int!, $unit: String!) {
                        updateIngredient(_id: $id, stock: $stock, unit: $unit) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateIngredient)
            );
      }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteIngredient(_id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteIngredient)
            );
      }
}
