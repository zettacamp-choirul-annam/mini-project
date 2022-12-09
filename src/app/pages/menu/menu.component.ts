import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/shared/services/menu.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogComponent } from './components/dialog/dialog.component';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-menu',
      templateUrl: './menu.component.html',
      styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
      @ViewChild('search') $search!: ElementRef;

      subs: Subscription[] = [];
      inProgress: boolean = true;
      menus: any = [];

      currentTab: string = 'discover';
      searchTimeout: any = null;

      constructor(
            private menuService: MenuService,
            private favoriteService: FavoriteService,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.getMenus();
      }
      
      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getMenus(filter?: any) {
            const sub = this.menuService.getAll(filter).subscribe({
                  next: (result) => {
                        this.menus = result.listRecipe;
                  },
                  error: (error) => {
                        console.log(error);
                  }
            });

            this.subs.push(sub);
      }

      getFavorites() {
            this.getMenus({ is_favorite_page: true })
      }

      openDialog(menu: any) {
            this.dialog.open(DialogComponent, { data: menu });
      }

      switchTab(name: string) {
            this.$search.nativeElement.value = '';
            this.currentTab = name;

            switch (name) {
                  case 'discover':
                        this.getMenus();
                  break;
                  case 'favorite':
                        this.getFavorites();
                  break;
            }
      }

      onSearch(value: string) {
            if (this.searchTimeout) {
                  clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                  this.getMenus({ recipe_name: value, is_favorite_page: this.currentTab == 'favorite' });
            }, 250);
      }
}
