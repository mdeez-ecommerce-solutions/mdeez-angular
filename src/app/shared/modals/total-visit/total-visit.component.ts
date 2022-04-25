import { Component, Inject, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-total-visit',
  templateUrl: './total-visit.component.html',
  styleUrls: ['./total-visit.component.css']
})
export class TotalVisitComponent implements OnInit {
status:any;
remark:any;
loading:boolean=false;
  constructor(private userService: UserService,public dialogRef: MatDialogRef<TotalVisitComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  private _snackBar: MatSnackBar) {

   }

  ngOnInit(): void {
    console.log(this.data)
    this.status = this.data.status;
    this.remark = this.data.meetingRemark;
  }
  onNoClick(): void {
   
    this.dialogRef.close();
  }
  confirm(){
    console.log(this.data)

    if(this.remark &&this.status){
      var userdata={
        "visitId": this.data._id,
        "uniqueVisitorId": this.data.uniqueVisitorId,
        "date": this.data.createdAt,
        "visitPurposeCategory": this.data.visitPurposeCategory,
        "meetingLocation": this.data.meetingLocation,
        "meetingRemark": this.remark,
        "whomToMeet": this.data.whomToMeet,
        "query": this.status,
      };
    
      this.userService.visitorRevisit(userdata).subscribe(
        (response: any) => {
          if (response.error === false) {
            this.loading = false;
         this.dialogRef.close();
            this._snackBar.open(response.message, "", {
              duration: 5000,
            });
          
          }
        },
        (error) => {
          this._snackBar.open(error.message, "", {
            duration: 5000,
          });
     
        }
      );
       
 
    }
  
  }
}
