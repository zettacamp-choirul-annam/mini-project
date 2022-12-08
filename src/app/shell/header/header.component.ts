import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
      selector: 'app-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
      user: any;

      constructor(
            private authService: AuthService,
            private router: Router
      ) { }

      ngOnInit(): void {
            this.user = this.authService.getUser();
      }

      async onLogout() {
            const swal = await Swal.fire({
                  icon: 'question',
                  title: 'Logout',
                  text: 'Are you sure?',
                  showCancelButton: true,
                  cancelButtonText: 'Stay here',
                  confirmButtonText: 'logout'
            });

            if (swal.isDismissed) return;

            this.authService.releaseUser();
            this.router.navigate(['/home']).then(() => window.location.reload());
      }
}
