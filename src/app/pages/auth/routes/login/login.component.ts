import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forceValidate } from 'src/app/shared/utils/force-validate';
import { AuthService } from 'src/app/services/auth.service';
import { SaveCartService } from 'src/app/services/save-cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
      subs: Subscription[] = [];
      hidePassword: boolean = true;
      inProgress: boolean = false;

      form = this.formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', Validators.required]
      });

      constructor(
            private formBuilder: FormBuilder,
            private authService: AuthService,
            private saveCartService: SaveCartService,
            private router: Router
      ) { }

      ngOnInit(): void { }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      get emailControl() {
            return this.form.get('email');
      }

      get passwordControl() {
            return this.form.get('password');
      }

      onSubmit() {
            if (this.form.invalid) {
                  return forceValidate(this.form);
            };

            this.inProgress = true;
            const payload = this.form.value;

            const sub = this.authService.login(payload).subscribe({
                  next: () => {
                        this.inProgress = false;
                        this.router.navigate(['/home']).then(() => {
                              // send saved cart to server
                              this.saveCartService.send();
                        });
                  },    
                  error: (error) => {
                        this.inProgress = false;

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to login',
                              text: error.message
                        });
                  }
            });

            this.subs.push(sub);
      }
}
