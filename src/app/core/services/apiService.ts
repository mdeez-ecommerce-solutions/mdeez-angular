import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
// 3rd party libraries
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { forEach } from 'lodash';
// environment
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
  headers: HttpHeaders;
  options: any;
  host = '';
  baseApiUrl = '';

  constructor(
    private httpClient: HttpClient
  ) {
    this.baseApiUrl = environment.api_base_url;

    // this.headers = new HttpHeaders().set('Accept', ['application/json']);

    this.options = {
      // headers: this.headers,
      observe: 'body',
      withCredentials: false
    };
  }

  public post<T>(endPoint: string, data: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .post<T>(endPointUrl, data, this.options)
      .pipe(
        catchError(
          ({error}): (Observable<any>) =>
            throwError(error || 'server error: api call failed')
        )
      );
  }
  public download(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob'
    })
  }

  public get<T>(endPoint: string, params: HttpParams = null): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .get<T>(endPointUrl, {...this.options, params})
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public getById<T>(endPoint: string, id: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint + '/' + id;
    return this.httpClient
      .get<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public getByQueryParams<T>(endPoint: string, params: any): Observable<T> {
    let endPointUrl = this.baseApiUrl + endPoint;
    let paramsString = '';
    forEach(params, (value, key) => {
      paramsString = paramsString + key + '=' + value + '&';
    });

    endPointUrl = endPointUrl + '?' + paramsString;
    endPointUrl = endPointUrl.substring(0, endPointUrl.length - 1); // remove ending extra '&'
    return this.httpClient
      .get<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public put<T>(endPoint: string, data: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .put(endPointUrl, data, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public patch<T>(endPoint: string, data?: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .patch(endPointUrl, data, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public delete<T>(endPoint: string, id?: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint + (id ? '/' + id : '');
    return this.httpClient
      .delete<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public search<T>(endPoint: string, searchTerm: string) {
    const endPointUrl = this.baseApiUrl + endPoint + '?search=' + searchTerm;
    return this.httpClient
      .get<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }
}
