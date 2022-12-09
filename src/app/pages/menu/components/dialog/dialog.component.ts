import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/shared/services/cart.service';
import { Subscription } from 'rxjs';
import { RatingService } from 'src/app/shared/services/rating.service';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-dialog',
      templateUrl: './dialog.component.html',
      styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
      subs: Subscription[] = [];
      ratings: any = [];

      isAvailable: boolean = true;
      isFavorite : boolean = true;
      isDiscount : boolean = false;
      favoriteId : string = '';

      constructor(
            private ratingService: RatingService,
            private cartService: CartService,
            private dialogRef: MatDialogRef<DialogComponent>,
            @Inject(MAT_DIALOG_DATA) public menu: any,
      ) { }

      ngOnInit(): void {
            this.isAvailable = this.menu.availableStock > 0;
            this.isFavorite  = this.menu.is_favorite;
            this.isDiscount  = this.menu.discount_status == 'ACTIVE';
            this.favoriteId  = this.menu.favorite_id;

            this.getRatings();
      }

      getRatings() {
            const id = this.menu._id;

            const sub = this.ratingService.getAll({ recipe_id: id }).subscribe({
                  next: (result) => {
                        this.ratings = result.listRating;
                  },
                  error: (error) => {
                        console.log(error.message);
                  }
            });

            this.subs.push(sub);
      }      

      addToCart(amount: number, id: string) {
            const payload = { amount, recipe_id: id };

            const sub = this.cartService.create(payload).subscribe({
                  next: () => {
                        this.dialogRef.close();

                        Swal.fire({
                              icon: 'success',
                              title: 'Menu added to cart',
                              text: 'Horreyy'
                        });

                        this.cartService.updateTotal();
                  },
                  error: (error) => {
                        this.dialogRef.close();
                        
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed add to cart',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }
}
