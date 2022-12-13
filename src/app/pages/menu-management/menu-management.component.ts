import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuService } from 'src/app/services/menu.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-menu-management',
      templateUrl: './menu-management.component.html',
      styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
      subs: Subscription[] = [];

      // state
      inProgress: boolean = true;
      isError: boolean = false;
      errorMessage: string = '';

      // pagination
      pagination = { page: 0, limit: 10, total: 0 };

      // table
      source  = new MatTableDataSource([]);
      columns = ['picture', 'name', 'price', 'discount', 'offer', 'published', 'actions'];
      filterColumns = [
            'picture-filter', 'name-filter', 
            'price-filter', 'discount-filter', 
            'offer-filter', 'published-filter', 
            'actions-filter'
      ];

      filters = this.formBuilder.group({
            recipe_name: [''],
            recipe_status: ['']
      });

      constructor(
            private formBuilder: FormBuilder,
            private menuService: MenuService,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.getMenus();
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      applyFilters() {
            const filters: any = { };
            
            for (let [key, value] of Object.entries(this.filters.value)) {
                  if (value) filters[key] = value;
            }

            this.pagination.page = 0;
            this.getMenus(filters);
      }

      clearFilters() {
            this.filters.reset();
            this.getMenus();
      }

      openDialog(menu: any, edit: boolean) {
            const dialog = this.dialog.open(DialogComponent, {
                  data: { menu, edit }
            });

            dialog.afterClosed().subscribe(result => {
                  if (!result) return;
                  this.createMenu(result);
            });
      }

      onPaginatorChange(event: any) {
            this.pagination.page = event.pageIndex;
            this.getMenus();
      }

      getMenus(filters?: any) {
            this.inProgress = true;
            this.isError = false;

            const { page, limit } = this.pagination;
            
            filters = filters || {};
            filters = { page, limit, ...filters };

            const sub = this.menuService.getAll(filters).subscribe({
                  next: (result) => {
                        this.inProgress = false;
                        this.pagination.total = result.total;

                        this.source.data = result.listRecipe.map((item: any) => {
                              return {
                                    published: item.recipe_status == 'ACTIVE',
                                    isOffer: item.offer_status == 'ACTIVE', ...item
                              }
                        });
                  },
                  error: (error) => {
                        console.dir(error);
                        this.inProgress = false;

                        const errors = error.graphQLErrors;
                        const code   = errors?.[0]?.extensions?.code || '';

                        this.errorMessage = 'Failed to load data';

                        // fix pagination error after delete item
                        if (this.pagination.page > 0 && code == 'recipe/recipe-not-found') {
                              this.pagination.page -= 1;
                              return this.getMenus();
                        }

                        if (code == 'recipe/recipe-not-found') {
                              this.pagination.page = 0;
                              this.errorMessage = 'No items found'
                        }

                        this.source.data = [];
                        this.isError = true;
                  }
            });

            this.subs.push(sub);
      }

      createMenu(data: any) {
            const sub = this.menuService.create(data).subscribe({
                  next: (result) => {
                        this.getMenus();

                        Swal.fire({
                              icon: 'success',
                              title: 'Menu has been created',
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to create menu',
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }

      async updateMenu(menu: any) {
            if (menu.published) {
                  Swal.fire({
                        icon: 'warning',
                        title: 'Menu is still published',
                        text: 'Please unpublish first before updating it!',
                        confirmButtonText: 'Ok, i understand',
                  });

                  return; // stop execution
            }

            const dialog = this.dialog.open(DialogComponent, {
                  data: { menu, edit: true }
            });

            dialog.afterClosed().subscribe(result => {
                  if (!result) return;

                  const sub = this.menuService.update(result.id, result.data).subscribe({
                        next: () => {
                              this.getMenus();

                              Swal.fire({
                                    icon: 'success',
                                    title: 'Menu has been updated',
                                    confirmButtonText: 'Close'
                              });
                        },
                        error: (error) => {
                              Swal.fire({
                                    icon: 'error',
                                    title: 'Failed to update menu',
                                    confirmButtonText: 'Close'
                              });
                        }
                  });

                  this.subs.push(sub);
            });
      }

      async updatePublishedStatus(event: any, menu: any) {
            event.preventDefault();
            
            const label = menu.published ? 'Unpublish' : 'Publish';

            const confirm = await Swal.fire({
                  icon: 'question',
                  title: `${label} menu?`,
                  showCancelButton: true,
                  confirmButtonText: label,
                  cancelButtonText: 'Cancel'
            });

            if (confirm.isDismissed) return;

            const id = menu._id;
            const status = menu.published ? 'UNPUBLISH' : 'ACTIVE';

            const sub = this.menuService.updatePublishedStatus(id, status).subscribe({
                  next: (result) => {
                        this.getMenus();

                        Swal.fire({
                              icon: 'success',
                              title: `Menu has been ${label.toLowerCase()}`,
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: `Failed to ${label.toLowerCase()} menu`,
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }

      async updateOfferStatus(event: any, menu: any) {
            event.preventDefault();
            
            const label = menu.isOffer ? 'Unoffered' : 'Offered';

            const confirm = await Swal.fire({
                  icon: 'question',
                  title: `${label} menu?`,
                  showCancelButton: true,
                  confirmButtonText: label,
                  cancelButtonText: 'Cancel'
            });

            if (confirm.isDismissed) return;

            const id = menu._id;
            const status = menu.isOffer ? 'INACTIVE' : 'ACTIVE';

            const sub = this.menuService.updateOfferStatus(id, status).subscribe({
                  next: (result) => {
                        this.getMenus();

                        Swal.fire({
                              icon: 'success',
                              title: `Menu has been ${label.toLowerCase()}`,
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: `Failed to ${label.toLowerCase()} menu`,
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }

      async deleteMenu(menu: any) {
            if (menu.published) {
                  Swal.fire({
                        icon: 'warning',
                        title: 'Menu is still published',
                        text: 'Please unpublish first before deleting it!',
                        confirmButtonText: 'Ok, i understand',
                  });

                  return; // stop execution
            }

            const confirm = await Swal.fire({
                  icon: 'question',
                  title: 'Delete menu?',
                  showCancelButton: true,
                  confirmButtonText: 'Delete',
                  cancelButtonText: 'Cancel'
            });

            if (confirm.isDismissed) return;

            const sub = this.menuService.delete(menu._id).subscribe({
                  next: (result) => {
                        this.getMenus();

                        Swal.fire({
                              icon: 'success',
                              title: 'Menu has been deleted',
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to delete menu',
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }
}
