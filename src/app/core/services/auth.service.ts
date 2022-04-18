import { Injectable } from "@angular/core";
import { HttpParams, HttpClient } from "@angular/common/http";
import { ApiService } from "./apiService";
import { APIConstant } from "../constant/apiConstant";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  signUp(formData): Observable<any> {
    return this.apiService.post(APIConstant.SIGN_UP, formData);
  }

  verifySignUpOtp(otpObject): Observable<any> {
    return this.apiService.post(APIConstant.VERIFY_SIGNUP_OTP, otpObject);
  }

  loginUp(formData): Observable<any> {
    return this.apiService.post(APIConstant.LOGIN, formData);
  }

  forgetPassword(emailObj): Observable<any> {
    return this.apiService.post(APIConstant.FORGET_PASSWORD, emailObj);
  }

  changePassword(passwordObj): Observable<any> {
    return this.apiService.post(APIConstant.CHANGE_PASSWORD, passwordObj);
  }
}
