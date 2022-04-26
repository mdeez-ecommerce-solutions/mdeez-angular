import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  user
  signUp :FormGroup
  userId
  loader = false;
  whomVisitorMeets=["ADMIN", "EDITORS"]


  constructor(
    private route: ActivatedRoute,private fb:FormBuilder,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService) {
      this.userId = this.route.snapshot.paramMap.get('id');

     }

  ngOnInit(): void {
    this.initUserForm()
    console.log( this.userId)
    if(this.userId){
      this.getUserById()
    }
  
  }
  initUserForm(){
  this.signUp = this.fb.group({
    name: ['', [Validators.required]],
    role: ['', Validators.required],
    email:['', [Validators.required, Validators.email]],
  })
  }
  get f(){
    return this.signUp.controls;
  }
  getUserById(){
    this.userService.getUserById(this.userId).subscribe((res:any)=>{
      this.user = res.data[0]
      this.setFormValue(this.user)
    })
  }
  setFormValue(user) {
    this.signUp.controls['name'].setValue(user.name);
    this.signUp.controls['role'].setValue(user.role);
    this.signUp.controls['email'].setValue(user.email);

  }
 

  ngAfterViewInit(): void {
  
    
  }

  submit(){
    this.loader = true;
    this.userService.updateUser(this.userId ,this.signUp.value).subscribe((response: any) => {
      console.log(response)
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
