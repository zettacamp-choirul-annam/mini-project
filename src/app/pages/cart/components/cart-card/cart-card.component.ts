import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-cart-card',
      templateUrl: './cart-card.component.html',
      styleUrls: ['./cart-card.component.css']
})
export class CartCardComponent implements OnInit {
      @Input() cart: any;
      @Input() outStocks: any;
      @Output() _change = new EventEmitter();

      subs: Subscription[] = [];
      menu: any;
      isDiscount: boolean = false;
      isOutStock: boolean = false;

      constructor(private cartService: CartService) { }

      ngOnInit(): void {
            this.menu = this.cart.recipe_id;
            this.isDiscount = this.menu.discount_status == 'ACTIVE';
            this.isOutStock = this.outStocks.includes(this.menu._id);
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      updateCart(amount: number) {
            const payload = {
                  amount,
                  recipe_id: this.menu._id
            };

            const sub = this.cartService.update(payload).subscribe({
                  next: () => this._change.emit(),
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to update cart',
                              text: error.message
                        });

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }

      async deleteCart(event: Event) {
            event.preventDefault();

            const swal = await Swal.fire({
                  icon: 'question',
                  title: 'Delete cart?',
                  confirmButtonText: 'Delete',
                  showCancelButton: true
            });

            if (swal.isDismissed) return;

            const id = this.cart._id;

            const sub = this.cartService.delete(id).subscribe({
                  next: () => this._change.emit(),
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to delete cart'
                        });

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }
}
