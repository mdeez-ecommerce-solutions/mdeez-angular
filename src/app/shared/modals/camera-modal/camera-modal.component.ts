import { Component, OnInit, OnDestroy } from '@angular/core';
import {WebcamImage} from 'ngx-webcam';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.css']
})
export class CameraModalComponent implements OnInit, OnDestroy {
  cameraLoadErrorSubscription = new Subscription;
  constructor( public dialogRef: MatDialogRef < CameraModalComponent >,
    private user: UserService,
    private _snackBar: MatSnackBar, ) { }
  public webcamImage: WebcamImage = null;
  handleImage(webcamImage: WebcamImage) {
  this.webcamImage = webcamImage;

  if (this.webcamImage) {
    this.dialogRef.close(webcamImage);
  }
  }
 

  ngOnInit(): void {
    this.cameraLoadErrorSubscription = this.user.cameraLoadError.subscribe((err) => {
      if (err) {
        // this.dialogRef.close();
        this._snackBar.open(err.message, '', {
          duration: 3000,
        });
      }
    })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cameraLoadErrorSubscription.unsubscribe();
  }

}
