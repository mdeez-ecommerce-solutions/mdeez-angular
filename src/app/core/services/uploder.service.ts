import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap, last } from 'rxjs/operators';
import { ApiService } from './apiService';
import { APIConstant } from '../constant/apiConstant';

@Injectable({
  providedIn: 'root'
})
export class UploderService {

  public progressSource = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private apiService: ApiService) {}

  upload(file: File, VisitorId) {
    let formData = new FormData();
    formData.append("visitor_image", file);
    // const req = new HttpRequest(
    //   "POST",
    //   "http://65.1.81.27:9000/api/v1/visitor/avatar?id=6031d913c7b4facec45ea9f7",
    //   formData,
    //   {
    //     reportProgress: true
    //   }
    // );

    return this.apiService.post(APIConstant.ADDD_VISITOR_IMAGE_UPLOAD + '?id=' + VisitorId, formData);
  }

  processProgress(envelope: any): void {
    if (typeof envelope === "number") {
      this.progressSource.next(envelope);
    }
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;
      case HttpEventType.UploadProgress:
        return Math.round((100 * event.loaded) / event.total);
      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;
      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }
}
