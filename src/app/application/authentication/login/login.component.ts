import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { MatDialog } from '@angular/material/dialog';
import { SignupOtpComponent } from 'src/app/shared/modals/signup-otp/signup-otp.component';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  login = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });
  loader = false;
  loading = false;
  rememberMe: boolean;
  get f() {
    return this.login.controls;
  }
  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private util: UtilService,
    private dialog: MatDialog,
    private user: UserService) {
     
     }
  
  ngOnInit() {
    if (localStorage.getItem('credential')) {
      const getCred = JSON.parse(localStorage.getItem('credential'));
      this.login.controls.email.patchValue(getCred.username);
      this.login.controls.password.patchValue(getCred.password);
      this.rememberMe = getCred.rememberMe;
    }
  }

  themeChange(value) {
    const bg_color = document.getElementsByClassName('bg-color-login')[0] as HTMLElement;
    if (value == 'light') {
      bg_color.style.background = 'linear-gradient(to left, #ffffff 50%, #f6f6f6 50%)';
    } else {
      bg_color.style.background = 'linear-gradient(to left, #1A1F2E 50%, #363a47 50%)';
    }
  }

  ngAfterViewInit(): void {
     this.user.themeValueBehavior.subscribe((value) => {
        this.themeChange(value);
      })
    
  }


  forgetPassword() {

    const dialogRef = this.dialog.open(SignupOtpComponent, {
      width: "500px",
      data: {
        label: "forgetPassword",
      },
    });
    // this.dialogRef.close();
    dialogRef.afterClosed().subscribe((email) => {

      if (this.util.validateEmail(email)) {
        this.loading = true;
        const emailObj = {
          email: email,
        };
        this.auth.forgetPassword(emailObj).subscribe(
          (response: any) => {
            if (response.error === false) {
              this._snackBar.open(response.message, "", {
                duration: 5000,
              });
              this.loading = false;
            }
          },
          (error) => {
            this.loading = false;
          }
        );
      } else {
        this.loading = false;
          this._snackBar.open('Please enter valid email', "", {
              duration: 5000,
            });
      }
    });
  }

  submit() {
    // this.loader = true;
    this.loading = true;
    this.auth.loginUp(this.login.value).subscribe(
      (response: any) => {
        console.log(response)
        this.auth.login(response.data.role)
        // if (response.error === false) {
          // this.router.navigate(["/add-visitor"]);
          this.util.setLocalStorage("SignInUserData", response.data);
          this.loader = false;
         if (response.data.role === environment.ADMIN_ROLE) {
              this.router.navigateByUrl('/add-visitor').then(() => {
                window.location.reload();
             });
            }else if(response.data.role === environment.EDITOR_ROLE){
              this.router.navigateByUrl('/add-visitor').then(() => {
                window.location.reload();  
            })
          }
          if (this.rememberMe === true) {
            const cred = {
              username: this.login.controls.email.value,
              password: this.login.controls.password.value,
              rememberMe: true
            };
            localStorage.setItem('credential', JSON.stringify(cred));
          } else {
            localStorage.removeItem('credential');
          }
      
        // }
      },
      (error) => {
        this.loading = false;
        // this.loader = false;
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
}
