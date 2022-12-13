import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from './components/menu-dialog/menu-dialog.component';
import { Subscription } from 'rxjs';

@Component({
      selector: 'app-menu',
      templateUrl: './menu.component.html',
      styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
      @ViewChild('search') $search!: ElementRef;

      subs: Subscription[] = [];
      menus: any = [];
      tabLabels = ['Discover', 'Favorite'];
      currentTab: string = '';
      searchTimeout: any = null;
      searchValue: string = '';
      isLogedIn: boolean = false;
      
      isError: boolean = false;
      isLoad : boolean = false;
      isEmpty: boolean = false;

      constructor(
            private menuService: MenuService,
            private authService: AuthService,
            private router: Router,
            private route: ActivatedRoute,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.isLogedIn = this.authService.getUser() != null;
            this.getMenus();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      getMenus() {
            this.isError = false;
            this.isLoad  = true;
            this.isEmpty = false;

            const filters = {
                  is_favorite_page: this.currentTab == 'Favorite',
                  recipe_name: this.searchValue
            };

            const sub = this.menuService.getAll(filters).subscribe({
                  next: (result) => {
                        this.menus = result.listRecipe;
                        this.isLoad = false;

                        this.linkHandler(); // auto open dialog

                        if (this.menus.length == 0) this.isEmpty = true;
                  },
                  error: (error) => {
                        // const code = error.graphQLErrors[0]?.extensions?.code;

                        // this.isEmpty = code == 'recipe/recipe-not-found';
                        // this.isError = code == undefined;
                        this.isEmpty = error.message == 'Cart not found';
                        this.isError = error.message != 'Cart not found';
                        
                        this.isLoad  = false;

                        console.error(error.message);
                  }
            });

            this.subs.push(sub);
      }

      linkHandler() {
            // get menu id from query params
            const id = this.route.snapshot.queryParamMap.get('id');

            if (!id) return; // stop execution

            // get one menu based on id from the link
            const menu = this.menus.filter((item: any) => item._id == id)[0];            

            this.dialog.open(MenuDialogComponent, { 
                  data: { menu, isLogedIn: this.isLogedIn }
            });

            // remove query param after dialog opened
            this.router.navigate([], { relativeTo: this.route, queryParams: { id: null }, queryParamsHandling: 'merge' });
      }

      onTabChange(value: string) {
            this.currentTab = value;

            this.$search.nativeElement.value = '';
            this.searchValue = '';

            this.getMenus();
      }

      onSearch(value: string) {
            clearTimeout(this.searchTimeout);

            this.searchValue   = value;
            this.searchTimeout = setTimeout(() => this.getMenus(), 250);
      }

      onOrder(menu: any) {
            this.dialog.open(MenuDialogComponent, { 
                  data: { menu, isLogedIn: this.isLogedIn }
            });
      }
}