import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class RatingService {
      constructor(private apollo: Apollo) { }

      getAll(filters?: any) {
            const query = `#graphql
                  query ($page: Int!, $limit: Int!, $recipe_id: ID) {
                        getAllRatings(page: $page, limit: $limit, recipe_id: $recipe_id) {
                              total
                              listRating {
                                    _id
                                    rating_date
                                    rating_value
                                    review
                                    recipe_id {
                                          picture
                                          name
                                    }
                                    user_id {
                                          _id
                                          email
                                          first_name
                                          last_name
                                    }
                              }
                        }
                  }
            `;

            filters = Object.assign({
                  page: 0,
                  limit: 1000,
                  recipe_id: ''
            }, filters)

            const response = this.apollo.query({
                  query: gql(query),
                  variables: { ...filters },
                  fetchPolicy: 'network-only'
            });

            return response.pipe(
                  map((result: any) => result.data.getAllRatings)
            );
      }

      create(data: any) {
            const query = `#graphql
                  mutation ($data: [InputRating]) {
                        createRating(input: $data) { _id }
                  }
            `;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { data }
            });

            return response.pipe(
                  map((result: any) => result.data.createRating)
            );
      }
}
