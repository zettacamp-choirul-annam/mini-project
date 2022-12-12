import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../menu-management/services/menu.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
      menus: any = [];
      id: string | null = '';
      isLogedIn: any;

      // state
      isLoad : boolean = true;
      isError: boolean = false;

      currentTab: string = 'discover';
      searchTimeout: any = null;

      constructor(
            private menuService: MenuService,
            private authService: AuthService,
            private route: ActivatedRoute,
            private router: Router,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.isLogedIn = this.authService.getUser() != null;
            this.id = this.route.snapshot.queryParamMap.get('id');
            this.getMenus();
      }
      
      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getMenus(filter?: any) {
            this.isLoad = true;

            const sub = this.menuService[this.isLogedIn ? 'getAll' : 'getAllPublic'](filter).subscribe({
                  next: (result) => {
                        this.menus = result.listRecipe;

                        if (this.id) {
                              const menu = this.menus.filter((item: any) => item._id == this.id)[0];
                              this.openDialog(menu);

                              // remove query param after dialog opened
                              this.router.navigate([], { relativeTo: this.route, queryParams: { id: null }, queryParamsHandling: 'merge' });
                              this.id = null;
                        }

                        this.isLoad = false;
                  },
                  error: (error) => {
                        console.log(error);

                        this.isLoad = false;
                        this.isError = true;
                  }
            });

            this.subs.push(sub);
      }

      getFavorites() {
            this.getMenus({ is_favorite_page: true })
      }

      openDialog(menu: any) {
            this.dialog.open(DialogComponent, { data: { menu, isLogedIn: this.isLogedIn }, });
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
                  this.getMenus({ 
                        recipe_name: value, 
                        is_favorite_page: this.currentTab == 'favorite' 
                  });
            }, 250);
      }
}
