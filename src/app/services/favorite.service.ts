import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { MenuService } from './menu.service';
import { map } from 'rxjs'

@Injectable({
      providedIn: 'root'
})
export class FavoriteService {
      constructor(
            private apollo: Apollo,
            private menuService: MenuService
      ) { }

      getAll(filters?: any) {
            // default filters.
            const defaults = { page: 0, limit: 100, is_favorite_page: true };

            // merge filters with default filters
            filters = Object.assign(defaults, filters || {});

            return this.menuService.getAll(filters);
      }

      getOne() { }

      create(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        createFavorite(recipe_id: $id) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.createFavorite)
            );
      }

      update() { }

      delete(id: string) {
            const query = `
                  mutation ($id: ID!) {
                        deleteFavorite(_id: $id) { _id }
                  }`;

            const response = this.apollo.mutate({
                  mutation: gql(query),
                  variables: { id }
            });

            return response.pipe(
                  map((result: any) => result.data.deleteFavorite)
            );
      }
}
