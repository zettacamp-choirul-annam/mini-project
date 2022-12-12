import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';
import { SaveCartService } from 'src/app/services/save-cart.service';
import { RatingService } from 'src/app/services/rating.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-menu-dialog',
      templateUrl: './menu-dialog.component.html',
      styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialogComponent implements OnInit {
      subs: Subscription[] = [];
      ratings: any = [];
      menu: any;
      isLogedIn: boolean = false;
      ingredients: any = [];

      isAvailable: boolean = true;
      isFavorite : boolean = true;
      isDiscount : boolean = false;
      favoriteId : string = '';

      isRatingError: boolean = false;
      isRatingEmpty: boolean = false;
      
      constructor(
            private cartService: CartService,
            private saveCartService: SaveCartService,
            private ratingService: RatingService,
            private router: Router,
            private dialogRef: MatDialogRef<MenuDialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
      ) { }

      ngOnInit(): void {
            this.menu = this.data.menu;
            this.isLogedIn = this.data.isLogedIn;
            
            this.ingredients = this.menu.ingredients.map((item: any) => {
                  return item.ingredient_id;
            });

            this.isAvailable = this.menu.availableStock > 0;
            this.isFavorite  = this.menu.is_favorite;
            this.isDiscount  = this.menu.discount_status == 'ACTIVE';
            this.favoriteId  = this.menu.favorite_id;

            this.getRatings(); // get rating data
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getRatings() {
            const payload = {
                  menu_id: this.menu._id    
            };

            const sub = this.ratingService.getAll(payload).subscribe({
                  next: (result) => {
                        this.ratings = result.listRating;
                  },
                  error: (error) => {
                        this.isRatingError = true;
                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }

      addToCart(amount: number) {
            const payload = {
                  amount,
                  recipe_id: this.menu._id
            };

            if (!this.isLogedIn) {
                  this.dialogRef.close();

                  // save cart to local storage 
                  // and redirect to login page
                  this.saveCartService.save(payload);
                  this.router.navigate(['/auth/login']); return;
            }

            const sub = this.cartService.create(payload).subscribe({
                  next: () => {
                        this.dialogRef.close();
                        this.cartService.refrestTotal();

                        Swal.fire({
                              icon: 'success',
                              title: 'Item successfully added to your cart'
                        });
                  },
                  error: (error) => {
                        this.dialogRef.close();

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to add item to your cart'
                        });

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }
}
