import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVisitorComponent } from './add-visitor.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { UploderService } from 'src/app/core/services/uploder.service';
import { AgmCoreModule } from '@agm/core';
import { UserService } from 'src/app/core/services/user.service';

import { Ng2SearchPipeModule } from 'ng2-search-filter';


const route: Routes = [
  {
    path: '',
    component: AddVisitorComponent,
  },
  {
    path: ':visitorId',
    component: AddVisitorComponent,
  }
];


@NgModule({
  declarations: [AddVisitorComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(route),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDyjsSgp3HFDUgpGab1V5Jh8TuAI9ZCWLw'
    }), 
  ],
  providers:[UploderService, UserService]
})
export class AddVisitorModule { }
