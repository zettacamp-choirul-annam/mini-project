import { Component, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-cart',
      templateUrl: './cart.component.html',
      styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
      subs: Subscription[] = [];
      carts: any = [];
      cartPrice: number = 0;
      declineStocks: any = [];

      // state
      isLoad: boolean = true;
      isError: boolean = false;
      isEmpty: boolean = false;
      
      constructor(
            private cartService: CartService,
            private transactionService: TransactionService,
            private userService: UserService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.getCarts();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getCarts() {
            const sub = this.cartService.getAll().subscribe({
                  next: (result) => {
                        this.carts = result.listCart;
                        this.cartPrice = result.totalPrice;
                        this.isLoad = false;
                  },
                  error: (error) => {
                        this.isLoad = false;
                        const code = error.graphQLErrors[0].extensions.code;
                  
                        if (code == 'cart/cart-not-found') {
                              this.carts = [];
                              this.cartPrice = 0;
                              this.isEmpty = true;
                              this.declineStocks = [];

                              return;
                        }
                        
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to get carts',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }

      checkout() {
            const carts = this.carts.map((cart: any) => {
                  return {
                        amount: cart.amount,
                        recipe_id: cart.recipe_id._id,
                        note: cart.note
                  }
            });

            const payload = {
                  menus: carts,
                  price: this.cartPrice
            };

            const sub = this.transactionService.create(payload).subscribe({
                  next: (result) => {
                        const { order_status, DeclineRecipe } = result;
                        const isSuccess = order_status == 'SUCCESS';
                        
                        if (!isSuccess) {
                              this.declineStocks = DeclineRecipe
                                    .filter((item: any) => !item.isStock)
                                    .map((item: any) => item.recipe_id);
                                    
                              Swal.fire({
                                    icon: 'error',
                                    title: 'Out of stock'
                              });
                        }

                        if (isSuccess) {
                              Swal.fire({
                                    icon: 'success',
                                    title: 'Horeyy',
                                    didClose: () => this.router.navigate(['/menu'])
                              });

                              this.userService.refreshBalance();
                        }

                        this.getCarts();
                        this.cartService.updateTotal();
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Checkout Failed',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }
}