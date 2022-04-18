import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { sharedModals } from './modals';
import { SpinerComponent } from './spiner/spiner.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { sharedDirectives } from './directives';
import { TotalVisitComponent } from './modals/total-visit/total-visit.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CameraComponent } from '../application/dashboard/add-visitor/camera/camera.component';
import { CameraModalComponent } from './modals/camera-modal/camera-modal.component';
import { WebcamModule } from 'ngx-webcam';
import {MatTabsModule} from '@angular/material/tabs';
import { CustomdatePipe } from './pipe/customdate.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatStepperModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    WebcamModule
  ],
  declarations: [
    SpinerComponent,
    ...sharedModals,
    ...sharedDirectives,
    TotalVisitComponent,
    CameraComponent, CameraModalComponent,
    CustomdatePipe, 
  ],
  entryComponents: [
    ...sharedModals,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatStepperModule,
    MatInputModule,
    MatRadioModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SpinerComponent,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    WebcamModule,
    CustomdatePipe,
    ...sharedModals,
    ...sharedDirectives
  ],
  providers: [ MatDatepickerModule, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class SharedModule {}
