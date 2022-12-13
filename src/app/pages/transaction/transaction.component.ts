import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { RatingService } from 'src/app/services/rating.service';
import { Subscription } from 'rxjs';

@Component({
      selector: 'app-transaction',
      templateUrl: './transaction.component.html',
      styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
      subs: Subscription[] = [];
      transactions: any = [];
      ratings: any = [];
      tabLabels = ['History', 'Ratings'];
      currentTab: string = 'History';
      
      isLoad : boolean = true;
      isEmpty: boolean = false;
      isError: boolean = false;

      // pagination
      pagination = { page: 0, limit: 10, total: 0 };

      constructor(
            private transactionService: TransactionService,
            private ratingService: RatingService
      ) { }

      ngOnInit(): void {
            this.getTransactions();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getTransactions(filters?: any) {
            this.isEmpty = false;
            this.isLoad  = true;
            this.isEmpty = false;

            const { page, limit } = this.pagination;
            
            filters = filters || {};
            filters = { page, limit, ...filters };

            const sub = this.transactionService.getAll(filters).subscribe({
                  next: (result) => {
                        this.isLoad = false;
                        this.pagination.total = result.total;
                        this.transactions = result.listTransaction;
                  },
                  error: (error) => {
                        this.isEmpty = false;
                        this.isLoad  = false;
                        this.isError = true;

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }

      getRatings() {
            this.isEmpty = false;
            this.isLoad  = true;
            this.isEmpty = false;

            const sub = this.ratingService.getAll().subscribe({
                  next: (result) => {
                        this.isLoad = false;
                        this.ratings = result.listRating;
                  },
                  error: (error) => {
                        this.isEmpty = false;
                        this.isLoad  = false;
                        this.isError = true;

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }

      onPaginatorChange(event: any) {
            this.pagination.page = event.pageIndex;
            this.getTransactions();
      }

      onTabChange(value: string) {
            this.currentTab = value;

            if (value == 'History') this.getTransactions();
            if (value == 'Ratings') this.getRatings();
      }
}
