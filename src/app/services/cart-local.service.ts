import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class CartLocalService {
      private readonly LS_KEY = 'beef-carts';

      constructor(private apollo: Apollo) { }

      private calculateTotalPrice(data: any) {
            const totalPrice = data.listCart.reduce((total: number, item: any) => {
                  const price = item.recipe_id.price_after_discount * item.amount;                  
                  return total + price;
            }, 0);

            return totalPrice;
      }

      private storeToStorage(data: any) {
            data.totalPrice = this.calculateTotalPrice(data);
            data.total = data.listCart.length;

            localStorage.setItem(this.LS_KEY, JSON.stringify(data));
      }

      setCart(item: any) {
            const data = this.getCart();

            let found = false;
            let index = 0;

            data.listCart.forEach((cart: any, i: number) => {
                  found = cart.recipe_id._id == item.recipe_id._id;
                  index = found ? i : 0;
            });

            if (found)  data.listCart[index].amount += item.amount;
            if (!found) data.listCart.push(item);

            this.storeToStorage(data);
      }

      getCart() {
            const data = localStorage.getItem(this.LS_KEY);
            return JSON.parse(data!) || { total: 0, totalPrice: 0, listCart: [] };
      }

      updateAmount(id: string, amount: any) {
            const data = this.getCart();

            data.listCart.forEach((cart: any, index: number) => {
                  const found = cart.recipe_id._id == id;
                  if (found) data.listCart[index].amount = amount;
            });

            this.storeToStorage(data);
      }

      removeCart(id: string) {
            const data = this.getCart();

            data.listCart.forEach((cart: any, index: number) => {
                  const found = cart.recipe_id._id == id;
                  if (found) data.listCart.splice(index, 1);
            });

            this.storeToStorage(data);
      }

      sendCart() {
            let data = this.getCart();

            data = data.listCart.map((item: any) => {
                  item.recipe_id = item.recipe_id._id; return item;
            });

            data.forEach((item: any) => {
                  this.kontol(item);
            });
      }

      kontol(data: any) {
            const query = `
                  mutation ($data: CartMenuInput) {
                        createCart(menu: $data) { status }
                  }
            `;

            const sub = this.apollo.mutate({ mutation: gql(query), variables: { data } })
                  .pipe(map((result: any) => result.data.createCart))
                  .subscribe({
                        next: () => {
                              console.log('successfully sent local cart data');
                              this.removeCart(data.recipe_id);
                              sub.unsubscribe();
                        },
                        error: () => {
                              console.log('failed sent local cart data');
                              this.removeCart(data.recipe_id);
                              sub.unsubscribe();
                        }
                  });
      }
}