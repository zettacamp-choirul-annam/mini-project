import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
      selector: 'app-header-cart',
      templateUrl: './header-cart.component.html',
      styleUrls: ['./header-cart.component.css']
})
export class HeaderCartComponent implements OnInit {
      sub!: Subscription;
      total: number = 0;

      constructor(private cartService: CartService) { }

      ngOnInit(): void {
            this.sub = this.cartService.total$.subscribe(total => {
                  this.total = total;
            });
      }

      ngOnDestroy() {
            this.sub.unsubscribe();
      }
}
