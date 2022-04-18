import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SignupOtpComponent } from 'src/app/shared/modals/signup-otp/signup-otp.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, AfterViewInit {
  signUp = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', Validators.required),
    contactNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });
  loader = false;

  get f(){
    return this.signUp.controls;
  }

  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private user: UserService) { }

  ngOnInit(): void {
  }

  themeChange(value) {
    const bg_color = document.getElementsByClassName('bg-color-signUp')[0] as HTMLElement;
    if (value == 'light') {
      bg_color.style.background = '#ffffff';
    } else {
      bg_color.style.background = 'linear-gradient(to left, #1A1F2E 50%, #363a47 50%)';
    }
  }

  ngAfterViewInit(): void {
     this.user.themeValueBehavior.subscribe((value) => {
        this.themeChange(value);
      })
    
  }

  submit(){
    this.loader = true;
    // this.signUp.controls.contactNumber.patchValue( this.signUp.controls.contactNumber.value.toString());
    this.auth.signUp(this.signUp.value).subscribe((response: any) => {
      if (response.error === false) {
        this.loader = false;
        this._snackBar.open(response.message, '', {
          duration: 5000,
        });
        const dialogRef = this.dialog.open(SignupOtpComponent, {
          width: '300px',
          data: {
            email: this.signUp.controls.email.value,
            label: 'signUpOtp'
          }
        });
      } else {
        this.loader = false;
        this._snackBar.open(response.message, '', {
          duration: 5000,
        });
      }
    }, (error) => {
      this.loader = false;
      this._snackBar.open(error.message, '', {
        duration: 5000,
      });
    });
  }
}
