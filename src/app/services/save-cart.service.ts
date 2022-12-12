import { Injectable } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
      providedIn: 'root'
})
export class SaveCartService {
      private readonly LS_KEY = 'beef-cart';

      constructor(private cartService: CartService) { }

      save(data: any) {
            localStorage.setItem(this.LS_KEY, JSON.stringify(data));
      }

      send() {
            let data = localStorage.getItem(this.LS_KEY);

            // stop execution when data doesn't exist
            if (!data) return;

            data = JSON.parse(data);

            const sub = this.cartService.create(data).subscribe({
                  next: () => {
                        console.log('Successfully sent saved cart server');
                        localStorage.removeItem(this.LS_KEY);
                        sub.unsubscribe();
                  },
                  error: () => {
                        console.error('Failed sent saved cart to server');
                        sub.unsubscribe();
                  }
            });
      }
}