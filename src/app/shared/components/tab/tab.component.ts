import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-tab',
      templateUrl: './tab.component.html',
      styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
      @Input() labels: string [] = ['tab'];
      @Input() activeTab?: string;
      @Output() _change = new EventEmitter<string>();

      constructor() { }

      ngOnInit(): void {
            this.activeTab = this.activeTab || this.labels[0];
      }

      onChange(label: string) {
            this.activeTab = label;
            this._change.emit(this.activeTab);
      }
}
