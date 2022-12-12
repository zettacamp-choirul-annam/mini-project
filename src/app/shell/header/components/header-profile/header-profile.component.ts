import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
      selector: 'app-header-profile',
      templateUrl: './header-profile.component.html',
      styleUrls: ['./header-profile.component.css']
})
export class HeaderProfileComponent implements OnInit {
      @Input() user: any;
      @Output() _logout = new EventEmitter();

      sub!: Subscription;
      balance: number = 0;

      constructor(
            private userService: UserService
      ) { }

      ngOnInit(): void {
            this.sub = this.userService.balance$.subscribe(balance => {
                  this.balance = balance;
            });
      }

      ngOnDestroy() {
            this.sub.unsubscribe();
      }

      onLogout() { this._logout.emit() }
}
