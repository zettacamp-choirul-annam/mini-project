import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
      selector: 'app-transaction-history',
      templateUrl: './transaction-history.component.html',
      styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
      @Input() transaction: any;
      menus: any = [];
      user: any;
      isAdmin: boolean = false;
      isSuccess: boolean = false;
      isRated: boolean = false;

      constructor(
            private authService: AuthService,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.menus = this.transaction.menu.map((item: any) => {
                  const menu: any = { ...item };
                  menu.recipe_id = menu.recipe_id._id;
                  return menu;
            });

            this.user = this.transaction.user_id;
            this.isAdmin = this.authService.getUser()?.role == 'ADMIN';
            this.isSuccess = this.transaction.order_status == 'SUCCESS';
            this.isRated = this.transaction.rating_status;
      }

      rateOrder() {
            const dialog = this.dialog.open(TransactionDialogComponent, {
                  data: { 
                        menus: this.menus, 
                        transaction_id: this.transaction._id
                  }
            });

            dialog.afterClosed().subscribe(result => {
                  if (!result) return;
                  this.isRated = result;
            });
      }
}
