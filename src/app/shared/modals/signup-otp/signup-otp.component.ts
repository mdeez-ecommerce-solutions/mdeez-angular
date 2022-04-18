import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "src/app/core/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup-otp",
  templateUrl: "./signup-otp.component.html",
  styleUrls: ["./signup-otp.component.css"],
})
export class SignupOtpComponent implements OnInit {
  otpValue: any;
  loader = false;
  constructor(
    public dialogRef: MatDialogRef<SignupOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  sendOtp() {
    if (this.otpValue !== undefined) {
      const verifyOtp = {
        email: this.data.email,
        otp: this.otpValue,
      };
      this.auth.verifySignUpOtp(verifyOtp).subscribe(
        (verifyUserResponse: any) => {
          if (verifyUserResponse.error === false) {
            this._snackBar.open(verifyUserResponse.message, "", {
              duration: 5000,
            });
            this.dialogRef.close();
            this.router.navigate(["/authentication"]);
          }
        },
        (error) => {
          this.otpValue = "";
          this._snackBar.open(error.message, "", {
            duration: 5000,
          });
        }
      );
    }
  }

  onNoClick(): void {
    // this.loader = false;
    this.dialogRef.close();
  }
}
