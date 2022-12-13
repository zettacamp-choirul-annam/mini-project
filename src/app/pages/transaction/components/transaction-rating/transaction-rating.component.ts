import { Component, OnInit, Input } from '@angular/core';

@Component({
      selector: 'app-transaction-rating',
      templateUrl: './transaction-rating.component.html',
      styleUrls: ['./transaction-rating.component.css']
})
export class TransactionRatingComponent implements OnInit {
      @Input() rating: any;
      
      constructor() { }

      ngOnInit(): void { }
}
