import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/shared/services/cart.service';
import { Router } from '@angular/router';
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
      menu: any;
      isLogedIn: boolean = false;

      isAvailable: boolean = true;
      isFavorite : boolean = true;
      isDiscount : boolean = false;
      favoriteId : string = '';

      constructor(
            private ratingService: RatingService,
            private cartService: CartService,
            private router: Router,
            private dialogRef: MatDialogRef<DialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
      ) { }

      ngOnInit(): void {
            this.menu = this.data.menu;
            this.isLogedIn = this.data.isLogedIn;

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

      async addToCart(amount: number, id: string) {
            if (!this.isLogedIn) {
                  const swal = await Swal.fire({
                        icon: 'info',
                        title: 'Login to continue',
                        text: 'Please login or register to continue the order',
                        showCancelButton: true,
                        confirmButtonText: 'Login',
                        cancelButtonText: 'Cancel'
                  });
      
                  if (swal.isDismissed) return;

                  this.dialogRef.close();
                  this.router.navigate(['/auth/login']); return;
            }

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
