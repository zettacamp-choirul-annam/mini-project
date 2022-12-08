import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-profile',
      templateUrl: './profile.component.html',
      styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
      @Input() user: any;
      @Output() _logout = new EventEmitter();

      constructor() { }

      ngOnInit(): void { }

      onLogout() { this._logout.emit() }
}
