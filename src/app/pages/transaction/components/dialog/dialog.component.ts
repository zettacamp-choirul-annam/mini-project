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
            this.ratings[data._id] = data;
      }

      onSubmit() {
            this.dialogRef.close();

            const data = Object.entries(this.ratings).map((item: any) => {                  
                  return {
                        rating_value: item[1].star,
                        review: item[1].review,
                        transaction_id: this.transId,
                        recipe_id: item[1]._id
                  };
            });

            this.ratingService.create(data).subscribe({
                  next: (result) => {
                        Swal.fire({
                              icon: 'success',
                              title: 'Hello world',
                              text: 'Lorem ipsum dolor sit jamet'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to rate order!',
                              text: error.message
                        });
                  }
            });
      }
}
