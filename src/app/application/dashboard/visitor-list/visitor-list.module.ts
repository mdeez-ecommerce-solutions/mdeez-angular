import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorListComponent } from './visitor-list.component';
import { Routes, RouterModule } from '@angular/router';
import { TotalVisitListComponent } from './total-visit-list/total-visit-list.component';

const route: Routes = [
  {
    path: ':id',
    component: VisitorListComponent,
  }, 
   {
    path: "total-visit-list",
    component: TotalVisitListComponent,
  },
  
];

@NgModule({
  declarations: [VisitorListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class VisitorListModule { }
