import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
      selector: 'app-profile',
      templateUrl: './profile.component.html',
      styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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
