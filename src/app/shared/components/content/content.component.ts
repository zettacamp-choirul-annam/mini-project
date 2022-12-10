import { Component, OnInit, Input } from '@angular/core';

@Component({
      selector: 'app-content',
      templateUrl: './content.component.html',
      styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
      @Input() isError: boolean = false;
      @Input() errorMessage: string = 'Something went wrong';
      @Input() inProgress: boolean = true;
      @Input() showState: boolean = false;

      constructor() { }

      ngOnInit(): void { }
}
