import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';
import { CartLocalService } from 'src/app/services/cart-local.service';
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
            private cartLocalService: CartLocalService,
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

      async addToCart(amount: number, menu: any) {
            const payload = { amount, recipe_id: menu._id };

            if (!this.isLogedIn) {
                  Swal.fire({
                        icon: 'success',
                        title: 'Menu added to cart',
                        text: 'Horreyy'
                  });

                  this.dialogRef.close();
                  
                  // save cart to local storage
                  this.cartLocalService.setCart({ ...payload, recipe_id: menu });
                  this.cartService.refrestTotal(); return;
            }

            const sub = this.cartService.create(payload).subscribe({
                  next: () => {
                        this.dialogRef.close();

                        Swal.fire({
                              icon: 'success',
                              title: 'Menu added to cart',
                              text: 'Horreyy'
                        });

                        this.cartService.refrestTotal();
                  },
                  error: (error) => {
                        this.dialogRef.close();
                        
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed add menu to cart',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }
}
