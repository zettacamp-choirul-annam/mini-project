import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-search',
      templateUrl: './search.component.html',
      styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
      @Input() placeholder?: string = '';
      @Input() timeout?: number = 250;
      @Output() _change = new EventEmitter<string>();

      value: string = '';
      typingTimeout: any = null;

      constructor() { }

      ngOnInit(): void { }
      
      onInput(value: string) {
            this.value = value;
            
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => this._change.emit(this.value), this.timeout);
      }

      onReset() {
            this.value = '';

            clearTimeout(this.typingTimeout);
            this._change.emit(this.value);
      }

      onSubmit(event: Event) {
            event.preventDefault();
            
            clearTimeout(this.typingTimeout);
            this._change.emit(this.value);
      }
}
