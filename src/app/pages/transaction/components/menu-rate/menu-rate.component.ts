import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-menu-rate',
      templateUrl: './menu-rate.component.html',
      styleUrls: ['./menu-rate.component.css']
})
export class MenuRateComponent implements OnInit {
      @Input() menu: any;
      @Output() _rate = new EventEmitter();

      isRated: boolean = false;
      rateStar: number = 0;
      rateReview: string = '';
      
      constructor() { }

      ngOnInit(): void { }

      onrRateStarChange(value: number) {
            if (!this.isRated) this.isRated = true;
            this.rateStar = value;
            this.emitData();
      }

      onRateReviewChange(value: string) {
            this.rateReview = value;
            this.emitData();
      }

      emitData() {
            this._rate.emit({
                  star: this.rateStar,
                  review: this.rateReview,
                  ...this.menu
            })
      }
}
