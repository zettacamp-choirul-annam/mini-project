import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rate-input',
  templateUrl: './rate-input.component.html',
  styleUrls: ['./rate-input.component.css']
})
export class RateInputComponent implements OnInit {
      @Input() value: number = 0;
      @Output() _change = new EventEmitter();

      constructor() { }

      ngOnInit(): void { }

      updateValue(value: number) {
            this.value = value;
            this._change.emit(value);
      }
}
