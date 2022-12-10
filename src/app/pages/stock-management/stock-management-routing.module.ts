import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockManagementGuard } from './guards/stock-management.guard';
import { StockManagementComponent } from './stock-management.component';

const routes: Routes = [
      { path: '', component: StockManagementComponent, canActivate: [StockManagementGuard] }
];

@NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
})
export class StockManagementRoutingModule { }
