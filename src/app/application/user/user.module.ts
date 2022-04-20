import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { AddUserComponent } from '../user/add-user/add-user.component';
import { EditUserComponent } from '../user/edit-user/edit-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2GoogleChartsModule, GoogleChartsSettings } from 'ng2-google-charts';

const route: Routes = [
  {
    path: 'list',
    component: UserComponent,
  }, 
  {
    path: "add-user",
    component: AddUserComponent,
  },
  {
    path: "edit/:id",
    component: AddUserComponent,
  }
];

@NgModule({
  declarations: [UserComponent,AddUserComponent,EditUserComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2GoogleChartsModule,
    RouterModule.forChild(route)
  ]
})
export class UserModule { }
