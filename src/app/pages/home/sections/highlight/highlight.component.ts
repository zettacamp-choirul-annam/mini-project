import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/shared/services/menu.service';

@Component({
      selector: 'app-highlight',
      templateUrl: './highlight.component.html',
      styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
      sub!: Subscription;
      menus: any = [];

      constructor(
            private menuService: MenuService
      ) { }

      ngOnInit(): void {
            this.sub = this.menuService.getHighlightMenu().subscribe({
                  next: (result) => this.menus = result,
                  error: (error) => {
                        console.log(error);
                  }
            });
      }

      ngOnDestroy() {
            this.sub.unsubscribe();
      }
}
