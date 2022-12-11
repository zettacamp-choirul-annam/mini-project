import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/pages/cart/services/cart.service';

@Component({
      selector: 'app-cart',
      templateUrl: './cart.component.html',
      styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
      sub!: Subscription;
      total: number = 0;

      constructor(
            private cartService: CartService
      ) { }

      ngOnInit(): void {
            this.sub = this.cartService.total$.subscribe(total => {
                  this.total = total;
            });
      }

      ngOnDestroy() {
            this.sub.unsubscribe();
      }
}
