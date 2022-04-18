import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "src/app/shared/shared.module";
import { SignupComponent } from "./signup/signup.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

import { AgmCoreModule } from "@agm/core";

const route: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDyjsSgp3HFDUgpGab1V5Jh8TuAI9ZCWLw",
    }),
  ],
})
export class AuthModule {}
