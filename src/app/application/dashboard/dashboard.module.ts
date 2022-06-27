import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PpiGraphComponent } from './graphs/ppi-graph/ppi-graph.component';
import { WhomVisitorGraphComponent } from './graphs/whom-visitor-graph/whom-visitor-graph.component';
import { MeetingStatusGraphComponent } from './graphs/meeting-status-graph/meeting-status-graph.component';
import { AgeGroupGraphComponent } from './graphs/age-group-graph/age-group-graph.component';
import { MeetingLocationGraphComponent } from './graphs/meeting-location-graph/meeting-location-graph.component';
import { PerceivedPoliticalInclinationComponent } from './graphs/perceived-political-inclination/perceived-political-inclination.component';
import { VisitorCategoryGraphComponent } from './graphs/visitor-category-graph/visitor-category-graph.component';
import { VisitorOccupationGraphComponent } from './graphs/visitor-occupation-graph/visitor-occupation-graph.component';
import { VisitorAreaGraphComponent } from './graphs/visitor-area-graph/visitor-area-graph.component';
import { SamajwadiPartyGraphComponent } from './graphs/samajwadi-party-graph/samajwadi-party-graph.component';
import { AreaMapComponent } from './graphs/area-map/area-map.component';


const route: Routes = [
  {
    path: '',
    component: DashboardComponent,
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    PpiGraphComponent,
    WhomVisitorGraphComponent,
    MeetingStatusGraphComponent,
    AgeGroupGraphComponent,
    MeetingLocationGraphComponent,
    PerceivedPoliticalInclinationComponent,
    VisitorCategoryGraphComponent,
    VisitorOccupationGraphComponent,
    VisitorAreaGraphComponent,
    SamajwadiPartyGraphComponent,
    AreaMapComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class DashboardModule { }
