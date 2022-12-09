import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
      selector: 'app-card',
      templateUrl: './card.component.html',
      styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
      @Input() transaction: any;
      @Input() role: any;
      @Input() transId: string = '';
      
      status: string = '';
      isSuccess: boolean = false;
      isRated: boolean = false;
      user: any;
      menus: any;

      constructor(
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.status = this.transaction.order_status.toLowerCase();
            this.isSuccess = this.status == 'success';
            this.isRated = this.transaction.rating_status;
            this.user = this.transaction.user_id;
            
            this.menus = this.transaction.menu.map((item: any) => {
                  return {
                        amount: item.amount,
                        ...item.recipe_id
                  }
            });
      }

      openDialog() {
            this.dialog.open(DialogComponent, {
                  data: { menus: this.menus, transId: this.transId },
                  width: '600px'
            });
      }
}
