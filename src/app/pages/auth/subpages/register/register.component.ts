import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-register',
      templateUrl: './register.component.html',
      styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
      subs: Subscription[] = [];
      hidePassword: boolean = true;
      inProgress: boolean = false;

      form = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            security_answer: ['', Validators.required],
            password: ['', Validators.required],
            role: ['USER'] // this is hidden field hehe
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

      get firstNameControl() {
            return this.form.get('first_name');
      }

      get lastNameControl() {
            return this.form.get('last_name');
      }

      get answerControl() {
            return this.form.get('security_answer');
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

            const sub = this.userService.create(payload).subscribe({
                  next: (result) => {
                        this.inProgress = false;

                        Swal.fire({
                              icon: 'success',
                              title: 'Welcome to BEEF!',
                              text: 'Please login with your new account to continue.'
                        });
                  },
                  error: (error) => {
                        this.inProgress = false;

                        Swal.fire({
                              icon: 'error',
                              title: 'Failed to register',
                              text: error.message
                        });
                  } 
            });

            this.subs.push(sub);
      }
}
