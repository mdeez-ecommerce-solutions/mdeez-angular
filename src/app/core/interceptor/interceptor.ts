import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, Subject } from 'rxjs';
import { tap, map, filter, retry, catchError } from 'rxjs/operators';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { UserService } from "../services/user.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private util: UtilService,
    private router: Router,
    private userService: UserService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.userService.isLoadingVisitorList.next(true);
    let headers = new HttpHeaders({
      // 'access-token': this.util.getLocalStorage('accessToken'),
        // 'Content-Type': 'application/json',
        // 'Accept': '*/*'
        'Accept': 'application/json'
    });

    if (this.util.getLocalStorage('SignInUserData')) {
      const auth_token = this.util.getLocalStorage('SignInUserData', 'token')
      headers = headers.append('Authorization', `Bearer ${auth_token}`);
    }

      request = request.clone({headers});
      return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.userService.isLoadingVisitorList.next(false);
        }
      }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 402 || err.status === 403) {
              // Redirect to login page
              this.router.navigate(['/authentication']);
            }
          }
      }
      ));
      
  }

}

