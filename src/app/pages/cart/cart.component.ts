import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
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
      carts: any = [];
      totalPrice: number = 0;
      outStocks : any = [];

      // state
      isLoad : boolean = true;
      isError: boolean = false;
      isEmpty: boolean = false;

      isLogedIn: boolean = false;
      
      constructor(
            private cartService: CartService,
            private transactionService: TransactionService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.getCarts();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getCarts() {
            // this.isLoad  = true;
            this.isError = false;
            this.isEmpty = false;

            const sub = this.cartService.getAll().subscribe({
                  next: (result) => {
                        this.carts = result.listCart;
                        this.totalPrice = result.totalPrice;
                        this.isLoad = false;
                  },
                  error: (error) => {
                        const code = error.graphQLErrors[0].extensions.code;
                  
                        if (code == 'cart/cart-not-found') {
                              this.carts = [];
                              this.totalPrice = 0;
                              this.isEmpty = true;
                              this.outStocks = [];
                        }

                        this.isError = code == undefined;
                        this.isLoad  = false;

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }

      async checkout() {
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
                  total: this.totalPrice
            };

            const sub = this.transactionService.create(payload).subscribe({
                  next: (result) => {
                        const { order_status, decline_recipe, is_stock, is_balance } = result;
                        const isSuccess = order_status == 'SUCCESS';
                        
                        if (!isSuccess) {
                              this.outStocks = decline_recipe
                                    .filter((item: any) => !item.isStock)
                                    .map((item: any) => item.recipe_id);

                              let message = '';

                              if (!is_stock) message = 'Out of stock';
                              if (!is_balance) message = 'The balance is not enough or it has been used up'
                                    
                              Swal.fire({ icon: 'error', title: 'Failed to chekout', text: message });
                        }

                        if (isSuccess) {
                              Swal.fire({
                                    icon: 'success',
                                    title: 'Our kitchen is on fire',
                                    text: 'Please wait and enjoy',
                                    didClose: () => this.router.navigate(['/menu'])
                              });
                        }

                        this.getCarts();
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to checkout ',
                        });

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }
}