import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuGuard } from './guards/menu.guard';
import { MenuManagementComponent } from './menu-management.component';

const routes: Routes = [
      { path: '', component: MenuManagementComponent, canActivate: [MenuGuard] }
];

@NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
})
export class MenuManagementRoutingModule { }
