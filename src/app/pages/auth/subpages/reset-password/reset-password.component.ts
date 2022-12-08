import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
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
            password: ['', Validators.required]
      });

      constructor(
            private formBuilder: FormBuilder,
            private userService: UserService,
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
            if (this.form.invalid) return;

            this.inProgress = true;
            const payload = this.form.value;

            const sub = this.userService.resetPassword(payload).subscribe({
                  next: (result) => {
                        this.inProgress = false;

                        Swal.fire({
                              icon: 'success',
                              title: 'Your password has been changed!',
                              text: 'Please login with your new password to continue.'
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
