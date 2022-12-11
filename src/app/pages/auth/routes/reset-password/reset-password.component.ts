import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forceValidate } from 'src/app/shared/utils/force-validate';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-reset-password',
      templateUrl: './reset-password.component.html',
      styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
      subs: Subscription[] = [];
      hidePassword: boolean = true;
      inProgress: boolean = false;

      form = this.formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            security_answer: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]]
      });

      constructor(
            private formBuilder: FormBuilder,
            private authService: AuthService,
            private router: Router
      ) { }

      ngOnInit(): void { }

      ngOnDestroy() {
            this.subs.forEach(sub => sub.unsubscribe());
      }

      get emailControl() {
            return this.form.get('email');
      }

      get answerControl() {
            return this.form.get('security_answer');
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

            const sub = this.authService.resetPassword(payload).subscribe({
                  next: () => {
                        this.inProgress = false;

                        Swal.fire({
                              icon: 'success',
                              title: 'Your password has been changed!',
                              text: 'Please login with your new password to continue.',
                              allowOutsideClick: false,
                              confirmButtonText: 'Login',
                              preConfirm: (a) => this.router.navigate(['/auth/login'])
                        });
                  },
                  error: (error) => {
                        this.inProgress = false;

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to reset your password',
                              text: error.message
                        });
                  } 
            });

            this.subs.push(sub);
      }
}
