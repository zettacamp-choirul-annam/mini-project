import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
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
            private userService: UserService,
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

      get passwordControl() {
            return this.form.get('password');
      }

      onSubmit() {
            if (this.form.invalid) return;

            this.inProgress = true;
            const payload = this.form.value;

            const sub = this.userService.login(payload).subscribe({
                  next: (result) => {
                        this.inProgress = false;
                        this.authService.setUser(result);
                        this.router.navigate(['/home']);
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
