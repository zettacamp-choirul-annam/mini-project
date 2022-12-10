import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class MenuService {
      constructor(private apollo: Apollo) { }

      getAll(filters?: any) {
            const query = `
                  query ($filter: filterRecipe) {
                        getAllRecipes(filter: $filter) {
                              total,
                              listRecipe {
                                    _id
                                    availableStock
                                    avg_rating
                                    description
                                    discount
                                    discount_status
                                    recipe_status
                                    favorite_id
                                    ingredients {
                                          ingredient_id {
                                                _id
                                                name
                                          }
                                          stock_used
                                    }
                                    is_favorite
                                    name
                                    offer_status
                                    picture
                                    price
                                    price_after_discount
                              }
                        }
                  }
            `;
            
            // default filters.
            const defaults = { page: 0, limit: 100 };

            // merge filters and default filters
            filters = Object.assign(defaults, filters || {});
            
            const response = this.apollo.query({
                  query: gql(query),
                  variables: { filter: filters },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllRecipes)
            );
      }

      getOne(id: string) {
            const query = `
                  query ($id: ID!) {
                        getOneRecipe(_id: $id) {
                              _id
                              availableStock
                              avg_rating
                              description
                              discount
                              discount_status
                              recipe_status
                              favorite_id
                              ingredients {
                                    ingredient_id {
                                          _id
                                          name
                                    }
                                    stock_used
                              }
                              is_favorite
                              name
                              offer_status
                              picture
                              price
                              price_after_discount
                        }
                  }
            `;
            
            const response = this.apollo.query({
                  query: gql(query),
                  variables: { id },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getOneRecipe)
            );
      }

      create(data: any) {
            const query = `
                  mutation (
                        $name: String!, 
                        $picture: String!, 
                        $price: Float!, 
                        $description: String!, 
                        $ingredients: [IngredientInput]!, 
                        $discount_status: discountStatus!, 
                        $discount: Float
                  ) {
                        createRecipe(
                              name: $name, 
                              picture: $picture, 
                              price: $price, 
                              description: $description, 
                              ingredients: $ingredients, 
                              discount_status: $discount_status, 
                              discount: $discount
                        ) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.createRecipe)
            );
      }

      update(id: string, data: any) {
            const query = `
                  mutation (
                        $id: ID!,
                        $name: String, 
                        $picture: String, 
                        $price: Float!, 
                        $description: String, 
                        $ingredients: [IngredientInput]!, 
                        $discount_status: discountStatus!, 
                        $discount: Float
                  ) {
                        updateRecipe(
                              _id: $id,
                              name: $name, 
                              picture: $picture, 
                              price: $price, 
                              description: $description, 
                              ingredients: $ingredients, 
                              discount_status: $discount_status, 
                              discount: $discount
                        ) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateRecipe)
            );
      }

      updatePublishedStatus(id: string, status: string) {
            const query = `
                  mutation ($id: ID!, $status: recipeStatusInput!) {
                        updateRecipeStatus(_id: $id, recipe_status: $status) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, status }
            });

            return response.pipe(
                  map((result: any) => result.data.updateRecipeStatus)
            );
      }

      updateOfferStatus(id: string, status: string) {
            const query = `
                  mutation ($id: ID!, $status: offerStatus!) {
                        updateOfferStatus(_id: $id, offer_status: $status) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, status }
            });

            return response.pipe(
                  map((result: any) => result.data.updateOfferStatus)
            );
      }

      updateDiscountStatus(id: string, status: string) {
            const query = `
                  mutation ($id: ID!, $status: discountStatus!) {
                        updateDiscountStatus(_id: $id, discount_status: $status) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, status }
            });

            return response.pipe(
                  map((result: any) => result.data.updateDiscountStatus)
            );
      }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteRecipe(_id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteRecipe)
            );
      }
}