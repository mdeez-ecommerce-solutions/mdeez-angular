import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, AfterViewInit {
  signUp = new FormGroup({
    name: new FormControl('', [Validators.required]),
    role: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  userId
  loader = false;
  whomVisitorMeets=["ADMIN", "EDITORS"]
  get f(){
    return this.signUp.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private user: UserService) {
      this.userId = this.route.snapshot.paramMap.get('id');

     }

  ngOnInit(): void {
    console.log( this.userId)
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
