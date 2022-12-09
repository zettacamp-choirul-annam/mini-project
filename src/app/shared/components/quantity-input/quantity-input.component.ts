import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
      selector: 'app-quantity-input',
      templateUrl: './quantity-input.component.html',
      styleUrls: ['./quantity-input.component.css']
})
export class QuantityInputComponent implements OnInit {
      @Input() value: number = 0;
      @Input() min: number = -Infinity;
      @Input() max: number = Infinity;
      @Output() _change = new EventEmitter<number>();

      isReachMin: boolean = false;
      isReachMax: boolean = false;
      
      constructor() { }

      ngOnInit(): void { }

      ngOnChanges() {
            if (this.value > this.max) this.value = this.max;
            if (this.value < this.min) this.value = this.min;

            this.reachMinMaxCheck();
      }

      increment() {
            this.value += 1;
            this.reachMinMaxCheck();
            this._change.emit(this.value);
      }

      decrement() {
            this.value -= 1;
            this.reachMinMaxCheck();
            this._change.emit(this.value);
      }

      reachMinMaxCheck() {
            this.isReachMax = this.value >= this.max;
            this.isReachMin = this.value <= this.min;
      }
}