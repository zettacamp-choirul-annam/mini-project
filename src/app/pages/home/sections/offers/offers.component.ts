import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/pages/menu-management/services/menu.service';
import { extractColor } from 'src/app/shared/utils/extract-color';

@Component({
      selector: 'app-offers',
      templateUrl: './offers.component.html',
      styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
      sub!: Subscription;
      offers: any = [];

      // state
      isLoad : boolean = true;
      isError: boolean = false;

      constructor(
            private menuService: MenuService
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
                              console.log(data);
                              
                              this.offers = data;
                              this.isLoad = false;
                        });
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
}
