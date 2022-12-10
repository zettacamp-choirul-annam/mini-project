import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
      selector: 'app-dialog',
      templateUrl: './dialog.component.html',
      styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
      units = ['g', 'mg', 'kg', 'ml', 'ltr'];

      form = this.formBuilder.group({
            _id: [''],
            name: ['', Validators.required],
            stock: [1, [Validators.required, Validators.min(1)]],
            unit: [this.units[0]],
      });

      constructor(
            private dialog: MatDialogRef<DialogComponent>,
            private formBuilder: FormBuilder,
            @Inject(MAT_DIALOG_DATA) public data: any,
      ) { }

      ngOnInit(): void {
            const { stock, edit } = this.data;

            if (edit) {
                  this.form.patchValue(stock)
                  this.form.get('name')?.disable()
            }

            if (!edit) {
                  this.form.get('_id')?.disable()
            }
      }

      onSubmit() {
            let result: any = this.form.value;
            
            if (this.data.edit) {
                  result = { id: result._id, data: result }
                  delete result.data._id;
            }
            
            this.dialog.close(result);
      }
}
