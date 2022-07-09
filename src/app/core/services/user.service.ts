import {
  Injectable
} from '@angular/core';
import {
  Observable, BehaviorSubject, Subscription, Subject
} from 'rxjs';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  ApiService
} from './apiService';
import {
  APIConstant
} from '../constant/apiConstant';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  themeValueBehavior = new BehaviorSubject<any>('');
  cameraLoadError: Subject<any> = new Subject();
  graphDataLoader: Subject<any> = new Subject();//Meet status
  graphDataLoader1: Subject<any> = new Subject();//age group
  graphDataLoader2: Subject<any> = new Subject();//Meet location
  graphDataLoader3: Subject<any> = new Subject();//ppi
  graphDataLoader4: Subject<any> = new Subject();//samajwadi
  graphDataLoader5: Subject<any> = new Subject();//visitor area
  graphDataLoader6: Subject<any> = new Subject();//category
  graphDataLoader7: Subject<any> = new Subject();//occupation
  graphDataLoader8: Subject<any> = new Subject();//whom to meet

  isLoadingVisitorList = new Subject<boolean>();

  constructor(private http: HttpClient, private apiService: ApiService) {}

  visitorInformationFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.VISITOR_INFORMATION_FORM, formData);
  }

  uploadVisitorImage(file: File, VisitorId): Observable < any > {
    let formData = new FormData();
    formData.append("visitor_image", file);
    return this.apiService.post(APIConstant.ADDD_VISITOR_IMAGE_UPLOAD + '?id=' + VisitorId, formData);
  }

 
//Visitor_Revisit
visitorRevisit(userdata): Observable < any > {
 
  return this.apiService.post(APIConstant.Visitor_Revisit ,userdata);
}
  visitorAddressFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.VISITOR_ADDRESS, formData);
  }
  

  objectiveInformationFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.OBJECTIVE_INFORMATION, formData);
  }

  politicalInformationFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.POLITICAL_INFORMATION, formData);
  }

  getVisitorList(index?:any): Observable < any > {
    const url = APIConstant.VISITOR_LIST;
    let params = new HttpParams();
    params = params.append('limit', '8');
    if(index) params = params.append('skip', index);
    return this.apiService.get(url, params);
  }
  
  getTotalVisitorList(visitorId): Observable < any > {
    return this.apiService.get(APIConstant.Total_Visit_List+ '?uniqueVisitorId='+visitorId);
  }

 
  getVisitorDetail(visitorId): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_DETAIL + '?uniqueVisitorId=' + visitorId);
  }

  getAllUser(): Observable < any > {
    return this.apiService.get(APIConstant.GET_USER);
  }

  updateUser(id,data){
   return this.apiService.put(APIConstant.UPDATE_USER+"?id="+id,data)
  }

  getUserById(id): Observable < any > {
    return this.apiService.get(APIConstant.GET_USER_BY_ID+"?id="+id);
  }
  
  deleteUser(id): Observable < any > {
    return this.apiService.delete(APIConstant.DELETE_USER_ID+"?id="+id);
  }
  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }
  
  getProximityOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.PROXIMITY_OPTION_DATA);
  }

  getWhomToMeetOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.WHOM_TO_MEET);
  }

  getVisitorConstituencyData(): Observable <any> {
    return this.apiService.get(APIConstant.GET_CONSTITUENCY)
  }

  getVisitorCategoryOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_CATEGORY);
  }

  getVisitorPurposeOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_PURPOSE);
  }

  getVisitorPoliticalInclinationOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_POLITICAL_INCLINATION);
  }

  getVisitorLocationOfMeetingOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_LOCATION_OF_MEETING);
  }

  getVisitorImage(visitorId): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_IMAGE_GET + '?id=' + visitorId);
  }

  getVisitorByFilter(filterByPurpose:any, filterBySearch:any, FilterByDate:any, pageIndex:any) {
    const url = APIConstant.VISITOR_LIST;
    let params = new HttpParams();
    if (filterByPurpose) params = params.append('purpose', filterByPurpose);
    if (filterBySearch) params = params.append('search', filterBySearch);
    if ((FilterByDate.fromDate) && (FilterByDate.toDate)) {
      console.log(FilterByDate)
      const formatDate = {
        fromDate: new Date(FilterByDate.fromDate.getTime() - FilterByDate.fromDate.getTimezoneOffset() * 60000),
        toDate: new Date(FilterByDate.toDate.getTime() - FilterByDate.toDate.getTimezoneOffset() * 60000),
      }
      params = params.append('fromDate', formatDate.fromDate.toISOString());
      params = params.append('toDate', formatDate.toDate.toISOString());
    }
    if (pageIndex) params = params.append('skip', pageIndex);
    params = params.append('limit', '8');
    return this.apiService.get(url, params);
  }
  getAllVisitorList(): Observable < any > {
 
    return this.apiService.get('/visitor/download-csv?limit=6000&purpose=Engineer');
  }


  // getVisitorByFilter(filterByPurpose, filterBySearch, FilterByDate) {
  //   let url = APIConstant.VISITOR_LIST_FILTER;
  //     const formatDate = {
  //       fromDate: new Date(FilterByDate.fromDate.getTime() - FilterByDate.fromDate.getTimezoneOffset() * 60000),
  //       toDate: new Date(FilterByDate.toDate.getTime() - FilterByDate.toDate.getTimezoneOffset() * 60000),
  //     }
  //   url = APIConstant.VISITOR_LIST_FILTER + 'search=' + filterBySearch + '&&purpose=' + filterByPurpose + '&&fromDate=' + formatDate.fromDate.toISOString() + '&&toDate=' + formatDate.toDate.toISOString();;
  //   return this.apiService.get(url);
  // }

  getVisitAnalyticData(): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_ANALYTIC_DATA);
  }

  uniqueVisitorIdFetchData(uniqueId): Observable < any > {
    return this.apiService.get(APIConstant.DATA_BY_UNIQUE_VISITOR_ID + '?uniqueVisitorId=' + uniqueId);
  }

  ExistVisitorInformationFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.EXIST_VISITOR_FORM, formData);
  }

  getCasteOptionData(): Observable < any > {
    return this.apiService.get(APIConstant.GET_CASTES);
   // return this.http.get("https://pr.cms.thensight.in/visitor/getCaste")

  }

  boothNameByNumber(boothNumber): Observable < any > {
    return this.apiService.get(APIConstant.BOOTH_NAME_BY_NUMBER + '?boothNumber=' + boothNumber);
  }

  getVisitAnalyticGraphData(filterValue): Observable < any > {
    if (filterValue) {
      return this.apiService.get(APIConstant.VISITOR_ANALYTIC_GRAPH_DATA + '?'+ filterValue.key +'=' + filterValue.value);
    } else {
      return this.apiService.get(APIConstant.VISITOR_ANALYTIC_GRAPH_DATA);
    }  
  }  
  getScheduleAnalyticGraphData(filterValue): Observable < any > {
    if (filterValue) {
      return this.apiService.get(APIConstant.SCHEDULE_ANALYTIC_GRAPH_DATA + '?'+ filterValue.key +'=' + filterValue.value);
    } else {
      return this.apiService.get(APIConstant.SCHEDULE_ANALYTIC_GRAPH_DATA);
    }  
  }

  getDropDownMetaData(): Observable < any > {
    return this.apiService.get(APIConstant.GET_DROP_DOWN_META_DATA);
  }

  scheduleMeetingFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.SCHEDULE_MEET_FORM_SUBMIT, formData);
  }

  uploadMultipleDocInSchedule(uploadDoc): Observable < any > {
    return this.apiService.post(APIConstant.UPLOAD_DOC_IN_SCHEDULE+'?page=event', uploadDoc);
  }


  getEventList(): Observable < any > {
    return this.apiService.get(APIConstant.GET_EVENT_LIST + '?limit=5000');
  }

scheduleAdminEventdata(): Observable < any > {
  return this.apiService.get(APIConstant.SCHEDULE_ADMIN_EVENTDATA );
}
  getEventDetail(eventId): Observable < any > {
    return this.apiService.get(APIConstant.EVENT_DETAIL + '?eventId=' + eventId);
  }

  getSchedulerAnalyticData(): Observable < any > {
    return this.apiService.get(APIConstant.SCHEDULAR_ANALYTIC_DATA);
  }

  getEventsByFilter(filterByPurpose, filterBySearch, FilterByDate) {
    const url = APIConstant.GET_EVENT_LIST;
    let params = new HttpParams();
    if (filterByPurpose) params = params.append('purpose', filterByPurpose);
    if (filterBySearch) params = params.append('search', filterBySearch);
    if ((FilterByDate.fromDate) && (FilterByDate.toDate)) {
     
      const formatDate = {
        fromDate: new Date(FilterByDate.fromDate.getTime() - FilterByDate.fromDate.getTimezoneOffset() * 60000),
        toDate: new Date(FilterByDate.toDate.getTime() - FilterByDate.toDate.getTimezoneOffset() * 60000),
      }
      params = params.append('fromDate', formatDate.fromDate.toISOString());
      params = params.append('toDate', formatDate.toDate.toISOString());
    }
    params = params.append('limit', '5000');
    return this.apiService.get(url, params);
  }

  getCalenderEvent(calendarView, dateRange?:any): Observable < any > {
    const url = APIConstant.GET_CALENDER_EVENT;
    let params = new HttpParams();
    if (calendarView) params = params.append('schedule', calendarView);

    if ((dateRange.fromDate) && (dateRange.toDate)) {
      params = params.append('fromDate', dateRange.fromDate.toISOString());
      params = params.append('toDate', dateRange.toDate.toISOString());
    }
    // if (dateRange) params = params.append('fromDate', dateRange);
    return this.apiService.get(url, params);
  }

  closeCalendarEvent(formData): Observable < any > {
    return this.apiService.post(APIConstant.CLOSE_CALENDAR_EVENT, formData);
  }

  getVoterListDetail(name): Observable < any > {
    return this.apiService.get(APIConstant.GET_VOTER_LIST_DETAIL + '?voterName=' + name);
  }

  getVisiterListByName(name): Observable < any > {
    return this.apiService.get(APIConstant.SEARCH_VISITOR_LIST + '?fullName=' + name);
  }
  scheduleMeetingWithGoogleCalendarKeyFormSubmit(formData): Observable < any > {
    return this.apiService.post(APIConstant.SCHEDULE_MEET_WITH_CALENDAR_ACCESS_FORM_SUBMIT, formData);
  }
  getVisitorOccupation(): Observable < any > {
    return this.apiService.get(APIConstant.VISITOR_OCCUPTION );
  }
//separate graph api
getVisitorDistrict(): Observable < any > {
  return this.apiService.get(APIConstant.GET_DISTRICT );
}  
 

getFilterMeetStatus(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_MEET_STATUS + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_MEET_STATUS );
  }  
  
}
getFilterArea(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_AREA + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_AREA );
  } 
  
}
getFilterDistrictConstituency(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_DISTRICT_CONSTITUENCY + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_DISTRICT_CONSTITUENCY );
  } 

}
getFilterAgeGroup(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_AGE_GROUP + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_AGE_GROUP );
  } 
  
}
getFilterMeetLocation(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_MEET_LOCATION + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_MEET_LOCATION );
  } 
  
}
getFilterIsSamjawadi(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_IS_SAMAJWADI + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_IS_SAMAJWADI );
  } 
  
}
getFilterGender(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_GENDER + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_GENDER );
  } 
 
}
getFilterCaste(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_CASTE + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_CASTE );
  } 
 
}
getFilterOccupation(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_OCCUPATION + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_OCCUPATION );
  } 
  
}
getFilterPpi(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_PPI + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_PPI );
  } 
  
}
getFilterPurpose(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_PURPOSE + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_PURPOSE );
  } 
 
}
getFilterTimeFrame(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_TIMEFRAME + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_TIMEFRAME );
  } 
 
}
getFilterVisitorCategory(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_VISITOR_CATEGORY + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_VISITOR_CATEGORY );
  }
  
}
getFilterVisitorMeet(filterValue?:any): Observable < any > {
  if (filterValue) {
    return this.apiService.get(APIConstant.GET_FILTER_VISITOR_MEET + '?'+ filterValue.key +'=' + filterValue.value);
  } else {
    return this.apiService.get(APIConstant.GET_FILTER_VISITOR_MEET );
  }
  
}
getVisitorGraphFilter(filterByPurpose:any, pageIndex:any) {
  const url = APIConstant.VISITOR_LIST;
  let params = new HttpParams(); 
  if (filterByPurpose) params = params.append(filterByPurpose.key, filterByPurpose.value);
  if (pageIndex) params = params.append('skip', pageIndex);
  params = params.append('limit', '20');
  return this.apiService.get(url, params);
}
}