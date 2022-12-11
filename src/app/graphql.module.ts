import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const uri = environment.api; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
      const http = httpLink.create({ uri });

      const middleware = new ApolloLink((operation, forward) => {
            const token = localStorage.getItem('beef-token') || null;

            operation.setContext({
                  headers: new HttpHeaders().set('Authorization', `${token}`)
            });

            return forward(operation);
      });

      return {
            link: middleware.concat(http),
            cache: new InMemoryCache()
      }
}

@NgModule({
      exports: [ApolloModule],
      providers: [
            {
                  provide: APOLLO_OPTIONS,
                  useFactory: createApollo,
                  deps: [HttpLink],
            },
      ],
})
export class GraphQLModule { }