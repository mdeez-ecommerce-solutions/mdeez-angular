import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, AfterViewInit {
  signUp = new FormGroup({
    name: new FormControl('', [Validators.required]),
    role: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  loader = false;
  whomVisitorMeets=["ADMIN", "EDITORS"]
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


  ngAfterViewInit(): void {
   
    
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
        this.router.navigate(['/user/list'])
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
