import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-menu-card',
      templateUrl: './menu-card.component.html',
      styleUrls: ['./menu-card.component.css']
})
export class MenuCardComponent implements OnInit {
      subs: Subscription[] = [];

      @Input() menu: any;
      @Input() showFavorite: boolean = true;
      @Input() showOrder: boolean = true;
      @Output() _order  = new EventEmitter();

      isAvailable: boolean = true;
      isFavorite : boolean = true;
      isDiscount : boolean = false;
      favoriteId : string = '';
      
      constructor(
            private favoriteService: FavoriteService
      ) { }

      ngOnInit(): void {
            this.isAvailable = this.menu.availableStock > 0;
            this.isFavorite  = this.menu.is_favorite;
            this.isDiscount  = this.menu.discount_status == 'ACTIVE';
            this.favoriteId  = this.menu.favorite_id;
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      onOrder() {
            this._order.emit();
      }

      toggleFavorite() {
            const payload = this.isFavorite ? this.favoriteId : this.menu._id;
            const method  = this.isFavorite ? 'delete' : 'create';

            const sub = this.favoriteService[method](payload).subscribe({
                  next: (result) => {
                        this.favoriteId = result._id;
                        this.isFavorite = !this.isFavorite
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: `Failed to ${this.isFavorite ? 'add' : 'remove'} menu from favorite`,
                              text: error.message
                        });
                  } 
            });

            this.subs.push(sub);
      }
}
