import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class MenuService {
      constructor(
            private apollo: Apollo,
            private authService: AuthService
      ) { }

      getAll(filters?: any) {
            let query = `#graphql
                  query ($filters: filterRecipe) {
                        getAllRecipes(filter: $filters) {
                              total
                              listRecipe {
                                    _id
                                    name
                                    picture
                                    price
                                    recipe_status
                                    availableStock
                                    discount_status
                                    is_favorite
                                    avg_rating
                                    price_after_discount
                                    offer_status
                                    favorite_id
                                    offer_status
                                    discount
                                    ingredients { 
                                          ingredient_id { 
                                                _id
                                                name
                                          }
                                    }
                              }
                        }
                  }
            `;

            const user = this.authService.getUser();
            if (!user) query = query.replace('getAllRecipes', 'getAllRecipesPublic');
            
            filters = Object.assign({
                  limit: 1000, page: 0,
                  is_favorite_page: false
            }, filters);

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { filters },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data[user ? 'getAllRecipes' : 'getAllRecipesPublic'])
            );
      }

      getOne(id: string) {
            const query = `#graphql
                  query ($id: ID!) {
                        getOneRecipe(_id: $id) {
                              _id
                              name
                              picture
                              price
                              recipe_status
                              availableStock
                              discount_status
                              is_favorite
                              avg_rating
                              price_after_discount
                              offer_status
                              favorite_id
                              offer_status
                              discount
                              ingredients { 
                                    ingredient_id { 
                                          _id
                                          name
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
                  map((result: any) => result.data.getOneRecipe)
            );
      }

      create(data: any) {
            const query = `#graphql
                  mutation (
                        $name: String!, 
                        $picture: String!, 
                        $price: Float!, 
                        $ingredients: [IngredientInput]!, 
                        $discount_status: discountStatus!
                  ) {
                        createRecipe(
                              name: $name, 
                              picture: $picture, 
                              price: $price, 
                              ingredients: $ingredients, 
                              discount_status: $discount_status
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

      getHighlightMenu() {
            const query = gql`
                  query GetTop3Recipes {
                        getTop3Recipes {
                              _id
                              picture
                              name
                              avg_rating
                              price
                              discount
                              discount_status
                              price_after_discount
                              availableStock
                        }
                  }
            `;

            const response = this.apollo.query({
                  query: query,
                  variables: { }
            });

            return response.pipe(
                  map((result: any) => result.data.getTop3Recipes)
            );
      }

      update(data: any) {
            const query = `#graphql
                  mutation (
                        $_id: ID!, 
                        $name: String, 
                        $picture: String, 
                        $price: Float!, 
                        $ingredients: [IngredientInput]!, 
                        $discount: Float, 
                        $discount_status: discountStatus!
                  ) {
                        updateRecipe(
                              _id: $_id, 
                              name: $name, 
                              picture: $picture, 
                              price: $price, 
                              ingredients: $ingredients, 
                              discount: $discount, 
                              discount_status: $discount_status
                        ) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { ...data }
            });

            return response.pipe(
                  map((result: any) => result.data.updateRecipe)
            );
      }

      updateStatus(id: string, status: string) {
            const query = `#graphql
                  mutation ($id: ID!, $status: recipeStatusInput!) {
                        updateRecipeStatus(_id: $id, recipe_status: $status) {
                              _id, recipe_status 
                        }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id, status }
            });

            return response.pipe(
                  map((result: any) => result.data.updateRecipe)
            );
      }

      updateOfferStatus(id: string, status: string) {
            const query = `#graphql
                  mutation ($id: ID!, $status: offerStatus!) {
                        updateOfferStatus(_id: $id, offer_status: $status) {
                              _id, offer_status 
                        }
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

      delete(id: string) {
            const query = `#graphql
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
