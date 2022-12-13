import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RatingService } from 'src/app/services/rating.service';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-transaction-dialog',
      templateUrl: './transaction-dialog.component.html',
      styleUrls: ['./transaction-dialog.component.css']
})
export class TransactionDialogComponent implements OnInit {
      ratings: any = {};
      menus: any;
      isLoad: boolean = false;

      get ratedLength() {
            return Object.keys(this.ratings).length;
      }

      constructor(
            private ratingService: RatingService,
            public dialogRef: MatDialogRef<TransactionDialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
      ) { }

      ngOnInit(): void {
            this.menus = this.data.menus;    
      }

      onRate(data: any) {
            this.ratings[data.recipe_id] = data;
      }

      onSubmit() {
            const data = Object.entries(this.ratings).map(([key, value]: any) => {         
                  return {
                        rating_value: value.star,
                        review: value.review,
                        transaction_id: this.data.transaction_id,
                        recipe_id: value.recipe_id
                  };
            });

            this.isLoad = true;

            this.ratingService.create(data).subscribe({
                  next: () => {
                        this.dialogRef.close(true);
                        this.isLoad = false;

                        Swal.fire({
                              icon: 'success',
                              title: 'Thank You',
                              text: 'Thank you for giving us ratings and reviews'
                        });
                  },
                  error: (error) => {
                        this.dialogRef.close(false);
                        this.isLoad = false;

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to rate order!'
                        });

                        console.error(error.message);
                  }
            });
      }
}
