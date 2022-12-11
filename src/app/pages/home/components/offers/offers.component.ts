import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { Router } from '@angular/router';
import { extractColor } from 'src/app/shared/utils/extract-color';

@Component({
      selector: 'app-offers',
      templateUrl: './offers.component.html',
      styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
      sub!: Subscription;
      offers: any = [];
      isLoad : boolean = true;

      constructor(
            private menuService: MenuService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.sub = this.menuService.getOffers().subscribe({
                  next: (result) => {
                        const proms: any = [];

                        result.forEach((item: any) => {
                              const prom = new Promise(resolve => {
                                    extractColor(item.picture).then((palette: any) => {
                                          const styles = {
                                                background: `rgb(${palette[2].join(",")})`,
                                                color: `rgb(${palette[0].join(",")})`
                                          }

                                          resolve({ ...item, styles });
                                    });
                              });

                              proms.push(prom);
                        });

                        Promise.all(proms).then(data => {
                              this.offers = data;
                              this.isLoad = false;
                        });
                  },
                  error: (error) => {
                        console.error(error.message);
                  }
            });
      }

      ngOnDestroy() {
            this.sub.unsubscribe();
      }

      goToMenu(id: string) {
            this.router.navigate(['/menu'], { queryParams: { id } });
      } 
}
