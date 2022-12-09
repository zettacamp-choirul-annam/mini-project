import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class FavoriteService {
      constructor(private apollo: Apollo) { }

      getAll(filters?: any) {
            filters = filters || { page: 0, limit: 1000 };

            const query = gql`
                  query ($page: Int!, $limit: Int!) {
                        getAllFavorites(page: $page, limit: $limit) {
                              listFavorite {
                                    recipe_id {
                                          _id, name, picture, price, 
                                          recipe_status, 
                                          discount_status, is_favorite,
                                          price_after_discount, offer_status,
                                          favorite_id,
                                          ingredients { 
                                                ingredient_id { _id, ingredient_status, name, stock }, 
                                                stock_used 
                                          }
                                    }
                              }
                        }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: query,
                  variables: filters
            });

            return response.pipe(
                  map((result: any) => result.data.getAllFavorites.listFavorite)
            );
      }

      create(id: string) {
            const query = gql`
                  mutation ($id: ID!) {
                        createFavorite(recipe_id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: query,
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.createFavorite)
            );
      }

      delete(id: string) {
            const query = gql`
                  mutation ($id: ID!) {
                        deleteFavorite(_id: $id) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: query,
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteFavorite)
            );
      }
}
