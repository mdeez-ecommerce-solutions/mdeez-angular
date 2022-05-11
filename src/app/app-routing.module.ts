import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/auth/auth.guard";

import { TotalVisitListComponent } from './application/dashboard/visitor-list/total-visit-list/total-visit-list.component';
import { LoginComponent } from "./application/authentication/login/login.component";
const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "add-visitor",
  //   pathMatch: "full",
  // },
  // {
  //   path: '**',
  //   redirectTo : 'app-home'
  // },
  // {
  //   path: "authentication",
  //   loadChildren: () =>
  //     import("./application/authentication/auth.module").then(
  //       (m) => m.AuthModule
  //     ),
  //   canActivate: [AuthGuard]
  // },
  {
    path: "",
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./application/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "visitor-list",
    loadChildren: () =>
      import("./application/dashboard/visitor-list/visitor-list.module").then(
        (m) => m.VisitorListModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "add-visitor",
    loadChildren: () =>
      import("./application/dashboard/add-visitor/add-visitor.module").then(
        (m) => m.AddVisitorModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user",
    loadChildren: () =>
      import("./application/user/user.module").then(
        (m) => m.UserModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "total-visit-list",
    component: TotalVisitListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
