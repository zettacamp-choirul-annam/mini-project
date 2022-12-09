import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { RatingService } from 'src/app/shared/services/rating.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-transaction',
      templateUrl: './transaction.component.html',
      styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
      transactions: any = [];
      ratings: any;
      subs: Subscription[] = [];
      role: any;
      currentTab: string = 'history';

      constructor(
            private transactionService: TransactionService,
            private authService: AuthService,
            private ratingService: RatingService
      ) { }

      ngOnInit(): void {
            this.role = this.authService.getUser()?.role;
            this.getTransactions();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getTransactions() {
            const sub = this.transactionService.getAll().subscribe({
                  next: (result => {
                        this.transactions = result.listTransaction;
                  }),
                  error: (error => {
                        console.log(error);
                  })
            });

            this.subs.push(sub);
      }

      getRatings() {
            const sub = this.ratingService.getAll().subscribe({
                  next: (result => {
                        this.ratings = result.listRating;
                        console.log(this.ratings);
                        
                  }),
                  error: (error => {
                        console.log(error);
                  })
            });

            this.subs.push(sub);
      }

      switchTab(name: string) {
            this.currentTab = name;

            switch (name) {
                  case 'history':
                        this.getTransactions();
                  break;
                  case 'ratings':
                        this.getRatings();
                  break;
            }
      }
}
