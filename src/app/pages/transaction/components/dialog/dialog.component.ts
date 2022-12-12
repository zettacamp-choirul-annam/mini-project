import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RatingService } from 'src/app/shared/services/rating.service';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-dialog',
      templateUrl: './dialog.component.html',
      styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
      ratings: any = {};
      menus: any;
      transId: any;
      isLoad: boolean = false;

      get ratedLength() {
            return Object.keys(this.ratings).length;
      }

      constructor(
            private ratingService: RatingService,
            public dialogRef: MatDialogRef<DialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
      ) { }

      ngOnInit(): void {
            this.menus = this.data.menus;
            this.transId = this.data.transId;            
      }

      onRate(data: any) {
            this.ratings[data.recipe_id] = data;
      }

      onSubmit() {
            const data = Object.entries(this.ratings).map(([key, value]: any) => {         
                  return {
                        rating_value: value.star,
                        review: value.review,
                        transaction_id: this.transId,
                        recipe_id: value.recipe_id
                  };
            });

            this.isLoad = true;

            this.ratingService.create(data).subscribe({
                  next: (result) => {
                        this.isLoad = false;
                        this.dialogRef.close(true);

                        Swal.fire({
                              icon: 'success',
                              title: 'Hello world',
                              text: 'Lorem ipsum dolor sit jamet'
                        });
                  },
                  error: (error) => {
                        this.isLoad = false;
                        this.dialogRef.close(false);

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to rate order!',
                              text: error.message
                        });
                  }
            });
      }
}
