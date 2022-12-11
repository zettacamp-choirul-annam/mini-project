import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { RatingService } from 'src/app/shared/services/rating.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';

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

      // pagination
      pagination = { page: 0, limit: 10, total: 0 };

      // state
      isLoad: boolean = true;
      isError: boolean = false;
      isEmpty: boolean = false;

      constructor(
            private transactionService: TransactionService,
            private authService: AuthService,
            private ratingService: RatingService,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.role = this.authService.getUser()?.role;
            this.getTransactions();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      onPaginatorChange(event: any) {
            this.pagination.page = event.pageIndex;
            this.getTransactions();
      }

      onRate(data: any) {
            const dialog = this.dialog.open(DialogComponent, {
                  data: data,
                  width: '600px'
            });

            dialog.afterClosed().subscribe(result => {
                  if (!result) return;
                  this.getTransactions();
            })
      }

      getTransactions(filters?: any) {
            this.isLoad = true;

            const { page, limit } = this.pagination;
            
            filters = filters || {};
            filters = { page, limit, ...filters };

            const sub = this.transactionService.getAll(filters).subscribe({
                  next: (result => {
                        this.isLoad = false;
                        this.pagination.total = result.total;
                        this.transactions = result.listTransaction;
                  }),
                  error: (error => {
                        this.isLoad = false;
                        console.dir(error);
                  })
            });

            this.subs.push(sub);
      }

      getRatings() {
            this.isLoad = true;

            const sub = this.ratingService.getAll().subscribe({
                  next: (result => {
                        this.isLoad = false;
                        this.ratings = result.listRating;
                  }),
                  error: (error => {
                        this.isLoad = false;
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
