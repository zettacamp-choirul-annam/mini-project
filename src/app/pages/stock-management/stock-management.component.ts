import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StockService } from 'src/app/services/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-stock-management',
      templateUrl: './stock-management.component.html',
      styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit {
      subs: Subscription[] = [];
      units = ['g', 'mg', 'kg', 'ml', 'ltr'];

      // state
      inProgress: boolean = true;
      isError: boolean = false;
      errorMessage: string = '';

      // pagination
      pagination = { page: 0, limit: 10, total: 0 };

      // table
      source  = new MatTableDataSource([]);
      columns = ['name', 'used', 'stock', 'unit', 'actions'];
      filterColumns = ['name-filter', 'used-filter', 'stock-filter', 'unit-filter', 'actions-filter'];

      filters = this.formBuilder.group({
            name : [],
            stock: []
      });

      constructor(
            private formBuilder: FormBuilder,
            private stockService: StockService,
            private dialog: MatDialog
      ) { }

      ngOnInit(): void {
            this.getStocks();
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
            this.getStocks(filters);
      }

      clearFilters() {
            this.filters.reset();
            this.getStocks();
      }

      openDialog(stock: any, edit: boolean) {
            const dialog = this.dialog.open(DialogComponent, {
                  data: { stock, edit },
                  width: '400px'
            });

            dialog.afterClosed().subscribe(result => {
                  if (!result) return;
                  edit ? this.updateStock(result.id, result.data) : this.createStock(result);
            });
      }

      onPaginatorChange(event: any) {
            this.pagination.page = event.pageIndex;
            this.getStocks();
      }

      getStocks(filters?: any) {
            this.inProgress = true;
            this.isError = false;

            const { page, limit } = this.pagination;
            
            filters = filters || {};
            filters = { page, limit, ...filters };

            const sub = this.stockService.getAll(filters).subscribe({
                  next: (result) => {
                        this.inProgress = false;
                        this.pagination.total = result.total;

                        this.source.data = result.listIngredient.map((item: any) => {
                              return { 
                                    menus: item.list_recipe,
                                    isUsed : item.list_recipe.length > 0 ,
                                    inStock: item.stock > 0, ...item, 
                              }
                        });
                  },
                  error: (error) => {
                        this.inProgress = false;

                        const errors = error.graphQLErrors;
                        const code   = errors?.[0]?.extensions?.code || '';

                        this.errorMessage = 'Failed to load data';

                        // fix pagination error after delete item
                        if (this.pagination.page > 0 && code == 'ingredient/ingredient-not-found') {
                              this.pagination.page -= 1;
                              return this.getStocks();
                        }

                        if (code == 'ingredient/ingredient-not-found') {
                              this.pagination.page = 0;
                              this.errorMessage = 'No items found'
                        }

                        this.source.data = [];
                        this.isError = true;
                  }
            });

            this.subs.push(sub);
      }

      createStock(data: any) {
            const sub = this.stockService.create(data).subscribe({
                  next: (result) => {
                        this.getStocks();

                        Swal.fire({
                              icon: 'success',
                              title: 'Stock has been created',
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to create stock',
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }

      updateStock(id: string, data: any) {
            const sub = this.stockService.update(id, data).subscribe({
                  next: (result) => {
                        this.getStocks();

                        Swal.fire({
                              icon: 'success',
                              title: 'Stock has been updated',
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to update stock',
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }

      async deleteStock(stock: any) {
            if (stock.isUsed) {
                  Swal.fire({
                        icon: 'warning',
                        title: 'Stock is still used',
                        html: `
                              <div style="text-align: left">
                                    Menus that use this ingredient:
                                    <br>
                                    <br>
                                    <ul style="padding-left: 1rem">
                                          ${stock.menus.map((menu: any) => `<li>${menu}</li>`).join('')}
                                    </ul>
                                    <br>
                                    You have to remove it first from \n the menu before deleting it.
                              </div>
                        `,
                        confirmButtonText: 'Ok, i understand'
                  }); 
                  
                  return; // stop execution
            }

            const confirm = await Swal.fire({
                  icon: 'question',
                  title: 'Delete stock?',
                  showCancelButton: true,
                  confirmButtonText: 'Delete',
                  cancelButtonText: 'Cancel'
            });

            if (confirm.isDismissed) return;

            const sub = this.stockService.delete(stock._id).subscribe({
                  next: (result) => {
                        this.getStocks();

                        Swal.fire({
                              icon: 'success',
                              title: 'Stock has been deleted',
                              confirmButtonText: 'Close'
                        });
                  },
                  error: (error) => {
                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to delete stock',
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }
}
