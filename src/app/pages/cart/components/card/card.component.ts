import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-card',
      templateUrl: './card.component.html',
      styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
      @Input() cart: any;
      @Input() oos: any;
      @Output() _deleted = new EventEmitter();
      @Output() _updated = new EventEmitter();

      subs: Subscription[] = [];
      menu: any;
      isDiscount: boolean = false;

      constructor(
            private cartService: CartService
      ) { }

      ngOnInit(): void {
            this.menu = this.cart.recipe_id;
            this.isDiscount = this.menu.discount_status == 'ACTIVE';
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      updateCart(amount: number) {
            const payload = {
                  recipe_id: this.menu._id,
                  amount
            };

            const sub = this.cartService.update(payload).subscribe({
                  next: () => this._updated.emit(),
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to update cart',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }

      async deleteCart(event: Event) {
            event.preventDefault();

            const swal = await Swal.fire({
                  icon: 'question',
                  title: 'Delete cart?',
                  showCancelButton: true
            });

            if (swal.isDismissed) return;

            const id = this.cart._id;
            const sub = this.cartService.delete(id).subscribe({
                  next: () => {
                        this._deleted.emit();
                        this.cartService.updateTotal();
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to delete cart',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }
}
