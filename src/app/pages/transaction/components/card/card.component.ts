import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
      @Output() _rate = new EventEmitter();
      
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
                  const newItem = { ...item };
                  newItem.recipe_id = item.recipe_id._id;
                  
                  return newItem;
            });
      }

      onRate() { this._rate.emit({ menus: this.menus, transId: this.transId }) }
}
