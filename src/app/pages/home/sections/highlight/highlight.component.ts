import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Router } from '@angular/router';

@Component({
      selector: 'app-highlight',
      templateUrl: './highlight.component.html',
      styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
      sub!: Subscription;
      menus: any = [];

      // state
      isLoad : boolean = true;
      isError: boolean = false;

      constructor(
            private menuService: MenuService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.sub = this.menuService.getHighlightMenu().subscribe({
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
