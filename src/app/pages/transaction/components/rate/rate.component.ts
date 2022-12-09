import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-rate',
      templateUrl: './rate.component.html',
      styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {
      @Input() value: number = 0;
      @Output() _change = new EventEmitter();

      constructor() { }

      ngOnInit(): void { }

      updateValue(value: number) {
            this.value = value;
            this._change.emit(value);
      }
}
