import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartLocalService } from 'src/app/services/cart-local.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/transaction.service';
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
      user: any;
      carts: any = [];
      cartPrice: number = 0;
      declineStocks: any = [];

      // state
      isLoad: boolean = true;
      isError: boolean = false;
      isEmpty: boolean = false;

      isLogedIn: boolean = false;
      
      constructor(
            private cartService: CartService,
            private cartLocalService: CartLocalService,
            private transactionService: TransactionService,
            private userService: UserService,
            private authService: AuthService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.user = this.authService.getUser();
            this.getCarts();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getCarts() {
            if (!this.user) {
                  const result = this.cartLocalService.getCart();

                  this.carts = result.listCart;
                  this.cartPrice = result.totalPrice;
                  this.isLoad = false; return;
            }
            
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

      async checkout() {
            if (!this.user) {
                  Swal.fire({
                        icon: 'info',
                        title: 'Login',
                        text: 'Please login to continue your order',
                        confirmButtonText: 'Login',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        preConfirm: () => { this.router.navigate(['/auth/login']) }
                  }); return;
            }

            const confirm = await Swal.fire({
                  icon: 'question',
                  title: 'Do you want to checkout',
                  confirmButtonText: 'Checkout',
                  showCancelButton: true,
                  cancelButtonText: 'Cancel'
            });

            if (confirm.isDismissed) return;

            const carts = this.carts.map((cart: any) => {
                  return {
                        recipe_id: cart.recipe_id._id,
                        note: cart.note,
                        amount: cart.amount,
                        name: cart.recipe_id.name,
                        picture: cart.recipe_id.picture,
                        price: cart.recipe_id.price,
                        discount_status: cart.recipe_id.discount_status,
                        discount: cart.recipe_id.discount,
                        price_after_discount: cart.recipe_id.price_after_discount,
                  }
            });
            
            const payload = {
                  menus: carts,
                  total: this.cartPrice
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
                        this.cartService.refrestTotal();
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