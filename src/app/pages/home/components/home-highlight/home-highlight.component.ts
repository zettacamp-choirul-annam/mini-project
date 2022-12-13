import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/pages/menu-management/services/menu.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
      selector: 'app-home-highlight',
      templateUrl: './home-highlight.component.html',
      styleUrls: ['./home-highlight.component.css']
})
export class HomeHighlightComponent implements OnInit {
      sub!: Subscription;
      menus: any = [];

      // state
      isLoad : boolean = true;
      isError: boolean = false;
      isAdmin: boolean = false;

      constructor(
            private menuService: MenuService,
            private authService: AuthService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.isAdmin = this.authService.getUser()?.role == 'ADMIN';
            
            this.sub = this.menuService.getHighlight().subscribe({
                  next: (result) => {
                        this.isLoad = false;
                        this.menus = result;
                  },
                  error: (error) => {
                        console.log(error);
                        
                        this.isLoad = false;
                        this.isError = true;
                  }
            });
      }

      ngOnDestroy() {
            this.sub.unsubscribe();
      }

      goToMenu(id: string) {
            this.router.navigate(['/menu'], { queryParams: { id }});
      }
}
