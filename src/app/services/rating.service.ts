import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class RatingService {
      constructor(private apollo: Apollo) { }

      getAll(filters?: any) {
            const query = `
                  query ($page: Int!, $limit: Int!, $menu_id: ID) {
                        getAllRatings(page: $page, limit: $limit, menu_id: $recipeId) {
                              total
                              listRating {
                                    _id
                                    rating_date
                                    rating_value
                                    review
                                    user_id {
                                          first_name
                                          last_name
                                          _id
                                    }
                                    recipe_id {
                                          name
                                          picture
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
                  map((result: any) => result.data.getAllRatings)
            );
      }

      getOne() { }

      create(data: any) {
            const query = `
                  mutation ($data: [InputRating]) {
                        createRating(input: $data) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.createRating)
            );
      }

      update() { }

      delete() { }
}
