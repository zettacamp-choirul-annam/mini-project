import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from './auth.service';
import { map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class MenuService {
      constructor(
            private apollo: Apollo,
            private authService: AuthService
      ) { }

      getAll(filters?: any) {
            const user = this.authService.getUser();
            const mode = user ? 'getAllRecipes' : 'getAllRecipesPublic';

            const query = `
                  query ($filters: filterRecipe) {
                        ${mode} (filter: $filters) {
                              total, 
                              listRecipe {
                                    _id
                                    availableStock
                                    avg_rating
                                    description
                                    discount
                                    discount_status
                                    favorite_id
                                    ingredients {
                                          stock_used
                                          ingredient_id {
                                                _id
                                                list_recipe
                                                name
                                                stock
                                                unit
                                          }
                                    }
                                    is_favorite
                                    name
                                    offer_status
                                    picture
                                    price
                                    price_after_discount
                                    recipe_status
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
                  map((result: any) => result.data[mode])
            );
      }

      getOne(id: string) {
            const query = `
                  query ($id: ID!) {
                        getOneRecipe (_id: $id) {
                              _id
                              availableStock
                              avg_rating
                              description
                              discount
                              discount_status
                              favorite_id
                              ingredients {
                                    stock_used
                                    ingredient_id {
                                          _id
                                          list_recipe
                                          name
                                          stock
                                          unit
                                    }
                              }
                              is_favorite
                              name
                              offer_status
                              picture
                              price
                              price_after_discount
                              recipe_status
                        }
                  }`;
            
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
                        $discount: Float, 
                        $ingredients: [IngredientInput]!, 
                        $discount_status: discountStatus!
                  ) {
                        createRecipe(
                              name: $name, 
                              picture: $picture, 
                              price: $price, 
                              description: $description,
                              discount: $discount, 
                              ingredients: $ingredients, 
                              discount_status: $discount_status
                        ) { _id }
                  }`;

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
                        $discount: Float,
                        $ingredients: [IngredientInput]!, 
                        $discount_status: discountStatus!,
                  ) {
                        updateRecipe(
                              _id: $id,
                              name: $name, 
                              picture: $picture, 
                              price: $price, 
                              description: $description, 
                              discount: $discount,
                              ingredients: $ingredients, 
                              discount_status: $discount_status
                        ) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateRecipe)
            );
      }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteIngredient(_id: $id) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteIngredient)
            );
      }
}
