import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  resetPasswordForm = new FormGroup({
    resetPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', Validators.required),
    resetToken: new FormControl('',),
  });
  loader = false;
  constructor(private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private user: UserService) { 
      this.route.queryParams.subscribe(params => {
        this.resetPasswordForm.controls.resetToken.patchValue(params.token);
    });
    }
    
  ngOnInit(): void {

  }

  themeChange(value) {
    const bg_color = document.getElementsByClassName('bg-color-reset')[0] as HTMLElement;
    if (value === 'light') {
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

  submit() {
    this.loader = true;
    this.auth.changePassword(this.resetPasswordForm.value).subscribe((response: any) => {
      if (response.error === false) {
        this.router.navigate(['/authentication']);
        this.loader = false;
        this._snackBar.open(response.message, '', {
          duration: 5000,
        });
      }
    },(error) => {
      this.loader = false;
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

}
