import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-transaction-rate-input',
      templateUrl: './transaction-rate-input.component.html',
      styleUrls: ['./transaction-rate-input.component.css']
})
export class TransactionRateInputComponent implements OnInit {
      @Input() menu: any;
      @Output() _rate = new EventEmitter();

      isRated: boolean = false;
      rateStar: number = 0;
      rateReview: string = '';

      constructor() { }

      ngOnInit(): void { }

      onRateStarChange(value: number) {
            if (!this.isRated) this.isRated = true;
            this.rateStar = value;
            this.emitData();
      }

      onRateReviewChange(value: string) {
            this.rateReview = value;
            this.emitData();
      }

      emitData() {
            const data = {
                  star: this.rateStar,
                  review: this.rateReview,
                  ...this.menu
            };

            this._rate.emit(data);
      }
}
