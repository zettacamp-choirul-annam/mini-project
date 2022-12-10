import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/pages/stock-management/services/stock.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-dialog',
      templateUrl: './dialog.component.html',
      styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
      subs: Subscription[] = [];
      stocks: any = [];

      form = this.formBuilder.group({
            _id: [''], // hidden field
            name: ['', Validators.required],
            picture: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            description: ['', Validators.required],
            discount: [{ value: 0, disabled: true }],
            discount_status: ['INACTIVE'], // hidden field
            ingredients: this.formBuilder.array([])
      });

      constructor(
            private dialog: MatDialogRef<DialogComponent>,
            private formBuilder: FormBuilder,
            private stockService: StockService,
            @Inject(MAT_DIALOG_DATA) public data: any,
      ) { }

      ngOnInit(): void {
            const sub = this.stockService.getAll().subscribe({
                  next: (result) => {
                        this.stocks = result.listIngredient;
                        this.initForm(); // init form
                  },
                  error: (error) => {
                        this.dialog.close();

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to load data',
                              confirmButtonText: 'Close'
                        });
                  }
            });

            this.subs.push(sub);
      }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      get idForm() {
            return this.form.get('_id');
      }

      get discountForm() {
            return this.form.get('discount');
      }

      get discountStatusForm() {
            return this.form.get('discount_status');
      }

      get ingredientsForm() {
            return this.form.get('ingredients') as FormArray;
      }

      initForm() {
            // listen for a changes
            this.discountStatusForm?.valueChanges.subscribe(value => {
                  const isActive = value == 'ACTIVE';
                  this.discountForm?.[isActive ? 'enable' : 'disable']();
            });

            if (this.data.edit) {
                  // fuck typescript
                  const menu: any = this.data.menu;

                  // remapping data menu
                  menu.ingredients = menu.ingredients.map((item: any) => {
                        // push ingredient form while looping :)
                        this.addIngredient();
                        
                        return { 
                              ingredient_id: item.ingredient_id._id, 
                              stock_used: item.stock_used
                        }
                  });

                  this.form.patchValue(menu);
            }

            if (!this.data.edit) {
                  this.idForm?.disable();
                  this.addIngredient();
            };
      }

      toggleDiscount(checked: boolean) {
            const value = checked ? 'ACTIVE' : 'INACTIVE';
            this.discountStatusForm?.setValue(value);
      }

      addIngredient() {
            const group = this.formBuilder.group({
                  ingredient_id: ['', Validators.required],
                  stock_used: [0, [Validators.required, Validators.min(1)]]
            });

            this.ingredientsForm.push(group);
      }

      removeIngredient(index: number) {
            this.ingredientsForm.removeAt(index);
      }

      onSubmit() {
            const value: any = this.form.getRawValue();
            
            if (!this.data.edit) {
                  return this.dialog.close(value);
            }
            
            const id = value._id;
            delete value._id;

            this.dialog.close({ id, data: value });
      }
}
