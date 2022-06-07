import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UploderService } from 'src/app/core/services/uploder.service';
import { MapsAPILoader } from '@agm/core';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { PickupLocationComponent } from 'src/app/shared/modals/pickup-location/pickup-location.component';
import { MatDialog } from '@angular/material/dialog';
import { CameraModalComponent } from 'src/app/shared/modals/camera-modal/camera-modal.component';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-add-visitor',
  templateUrl: './add-visitor.component.html',
  styleUrls: ['./add-visitor.component.scss']
})
export class AddVisitorComponent implements OnInit {
  visitorInformation: FormGroup;
  visitorAddress: FormGroup;
  objectiveInformation: FormGroup;
  politicalInformation: FormGroup;
  ExistVisitorInformation: FormGroup;
  gender = [
    'Male',
    'Female'
  ];
  isSamajwadiParty = [
    'Yes',
    'No'
  ];


  progress: number;
  infoMessage: any;
  isUploading: boolean = false;
  file: File;

  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
    uploadImageUrl: any;
  fileName: string = "No file selected";

  SelectProximityOfVisitors: any;

  meetingLocations: any;

  perceivedPoliticalInclinations: any;

  visitorCategories: any;

  categoryPurposeOfVisits: any;
  otherOptionOfSelectParty = false;

  boothCoordinators: any

  whomVisitorMeets: any;
  visitorDistrict:any;

  isAcknowledgementSentValue: boolean;

  lat: number;
  lng: number;
  getAddress: number;
  bounds = null;

  loader = false;
  loaderWebcam = false;
  submitFormLoader = false; 
  // customLocationMeeting = false;
  editForm = false;
  existVisitorFlag = false;
  fetchUniqueIdData = false;
 
  boothAddress: any;
  BoothAreas: any;
  today = new Date(); 
  ifScheduleEvent = {};
ifAddWorkerEvent={};
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();
  filterRecord: any;
  mobileFlag:boolean = true;
  options$: Observable<any[]>;
  $castesSuggestion: Observable<any[]>;
  $occupationSuggestion: Observable<any[]>;
  castes: any;
  relationshipStatus: any;
  loaderVisitorSuggestion: boolean;
  visitorConstituency: any;
  occupation:any;
  constructor(
    private _formBuilder: FormBuilder,
    private uploader: UploderService,
    private mapsAPILoader:MapsAPILoader,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,) { 
      // this.mapsAPILoader.load().then(() => {
      //   this.bounds = new google.maps.LatLngBounds(
      //     new google.maps.LatLng(51.130739, -0.868052), // SW
      //     new google.maps.LatLng(51.891257, 0.559417) // NE
      //   );
      // });
     
    }
   
  ngOnInit(): void {
    
    this.readyForm();
    this.getCasteOptionData();
    this.getProximityOptionData();
    this.getVisitorConstituencyData();
    this.getWhomToMeetOptionData();
    this.getVisitorCategoryOptionData();
    this.getVisitorPurposeOptionData();
    this.getVisitorLocationOfMeetingOptionData();
    this.getVisitorPoliticalInclinationOptionData();

    if (this.route.snapshot.paramMap.get('visitorId')) {
      this.editForm = true;
      this.getVisitorDataForEdit(this.route.snapshot.paramMap.get('visitorId'));
    }
    this.getVisitorOccupation();
    this.getDistrict();
    this.autoSuggestionName()

  }

  autoSuggestionName(): void {
    this.visitorInformation.controls.fullName.valueChanges.subscribe((res) => {
      console.log("res",res)
      if (res.length > 2) {
        // if (this.hasWhiteSpace(res)) {
          this.loaderVisitorSuggestion = true;
          this.userService.getVoterListDetail(res).subscribe((res) => {
          this.options$ = res.data;
          this.filterRecord= res.data;
          console.log(res.data)
          this.loaderVisitorSuggestion = false;
        })
      // } else if(res === '') {
      //     this.options$ = undefined;
      // }
      }
    });
  }


hasWhiteSpace(value) {
  return /\s/g.test(value);
}

getIndex(index): void {
  const selectedVisitorData = this.filterRecord.find((value, ind, array) => {
    return array.indexOf(value) === index;
  });
  
  this.visitorInformation.controls.father.patchValue('');
  this.visitorInformation.controls.mother.patchValue('');

  switch (selectedVisitorData.relationType) {
    case 'F': {
      this.relationshipStatus = 'Father';
      this.visitorInformation.controls.father.patchValue((selectedVisitorData.realtionTypeFamilyFirstName ? selectedVisitorData.realtionTypeFamilyFirstName : '') +' '+(selectedVisitorData.relationTypeFamilyLastName ? selectedVisitorData.relationTypeFamilyLastName : ''));
      break;
    }
    case 'M': {
      this.relationshipStatus = 'Mother';
      this.visitorInformation.controls.mother.patchValue((selectedVisitorData.realtionTypeFamilyFirstName ? selectedVisitorData.realtionTypeFamilyFirstName : '') +' '+(selectedVisitorData.relationTypeFamilyLastName ? selectedVisitorData.relationTypeFamilyLastName : ''));
      break;
    } 
    case 'H': {
      this.relationshipStatus = 'Husband';
      break;
    } 
    case 'W': {
      this.relationshipStatus = 'Wife';
      break;
    } 
    case 'G': {
      this.relationshipStatus = 'Guru';
      break;
    } 
    case 'O': {
      this.relationshipStatus = 'Others';
      break;
    }
    default:
      break;
  }


  this.visitorInformation.patchValue({

    fullName: (selectedVisitorData.firstName ? selectedVisitorData.firstName : '') +' '+(selectedVisitorData.lastName ? selectedVisitorData.lastName : ''),

    // mother: res.visitor.mother,
    dob: new Date(selectedVisitorData.dob),
    gender: selectedVisitorData.gender == 'M' ? 'Male' : 'Female',
    isNewVisitor: true
});

if (selectedVisitorData.boothNumber) {
  this.boothAddressByNumber(selectedVisitorData.boothNumber)
}

this.visitorAddress.patchValue({
  houseNumber: selectedVisitorData.houseNumber,
  line1: selectedVisitorData.villageName,
  tehsil: selectedVisitorData.tehsil,
  district: selectedVisitorData.district,
  // voterId: selectedVisitorData.voterId,
  constituency: selectedVisitorData.acName,
  boothNumber: selectedVisitorData.boothNumber,
  boothName: selectedVisitorData.boothName,
  boothArea: selectedVisitorData.boothArea,
});
}

// mobileValidate(value){
//   if(value){
//     this.mobileFlag=this.objectiveInformation.controls.mobile.valid;
//   }
//   else{
//     this.mobileFlag=true;
//   }
  
// }
  readyForm() {
    this.visitorInformation = this._formBuilder.group({
      visitorId: [''],
      enrollmentDate: [new Date(), Validators.required],
      fullName: ['', Validators.required],
      father: ['', ],
      mother: ['', ],
      caste: ['', Validators.required],
      dob: ['', Validators.required],
      // uniqueVisitorId: ['', ],
      gender: ['', Validators.required],
      voterId: ['',  ],
      isNewVisitor: ['', Validators.required],
      occupation:['',Validators.required],
    });
    this.visitorAddress = this._formBuilder.group({
      addressId: ['', ],
      visitorId: ['', ],
      houseNumber: ['',  ],
      area:['',Validators.required],
      line1: ['',  ],
      line2: ['',  ],
      tehsil: ['', ],
      district: ['',  ],
      zipCode: ['',  ],
      constituency: ['', Validators.required],
      boothNumber: ['',  ],
      boothName: ['',  ],
      boothArea: ['',  ],
    });
    this.objectiveInformation = this._formBuilder.group({
      visitorId: ['', ],
      objectiveId: ['', ],
      // totalVisits: ['', ],
      // numberOfVisit: ['', ],
      meetingLocation: ['', Validators.required],
      locationName: ['', ],
      perceivedPoliticalInclination: ['', Validators.required],
      proximityOfVisitor: ['', Validators.required],
      partyName: ['', ],
      totalFamilyMembers: ['', ],
      emailId: ['', ],
      mobile: ['', Validators.pattern("[0-9\-]{10,12}")],
      mobileTwo: ['', ],
      mobileThree: ['', ],
      landLineNumber: ['', ],
      remark: ['', ]
    });
    this.politicalInformation = this._formBuilder.group({
      visitorId: ['', ],
      politicalId: ['', ],
      visitorCategory: ['', Validators.required],
      visitPurposeCategory: ['', Validators.required],
      purposeOfVisitText: ['', ],
      whomToMeet: ['', Validators.required],
      accomplicedDetails: ['', ],
      isAcknowledgementSent: ['', ],
      isSamajwadiPartyMember: ['',Validators.required ],
      acknowledgementMessage: ['', ],
      isInfoSentToBooth: ['', ],
      boothNumber: ['', ],
      boothCoordinator: ['', ],

      refrenceName: ['',],
      refrenceMobile:['',],
      refrenceRemark: ['',],
      accompliceName:['',],
      accompliceMobile:['',],
      accompliceRemark:['',],
    });
    this.visitorInformation.controls.isNewVisitor.setValue(true);
    this.politicalInformation.controls.isAcknowledgementSent.setValue(true);
    this.politicalInformation.controls.isSamajwadiPartyMember.setValue('No');
    this.politicalInformation.controls.isInfoSentToBooth.setValue(true);
    
  }


  existVisitorForm() {
    this.ExistVisitorInformation = this._formBuilder.group({
      // visitorId: [''],
      uniqueVisitorId: [''],
      date: ['', Validators.required],
      visitPurposeCategoryForExist: ['', Validators.required],
      whomToMeetForExist: ['', Validators.required],
      meetingLocationForExist: ['', Validators.required],
      isNewVisitor: ['', ],
      perceivedPoliticalInclinationForExist: ['', Validators.required],
      meetingRemark: ['', ],
    });
  }
  
  getVisitorOccupation(){
    this.userService.getVisitorOccupation().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.occupation = response.data;
          this.visitorInformation.controls.occupation.valueChanges.subscribe((res) => {
            this.occupationFilter(res)
          })
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
  

  getProximityOptionData() {
    this.userService.getProximityOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.SelectProximityOfVisitors = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getWhomToMeetOptionData() {
    this.userService.getWhomToMeetOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.whomVisitorMeets = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getVisitorPurposeOptionData() {
    this.userService.getVisitorPurposeOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.categoryPurposeOfVisits = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getVisitorCategoryOptionData() {
    this.userService.getVisitorCategoryOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.visitorCategories = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getVisitorPoliticalInclinationOptionData() {
    this.userService.getVisitorPoliticalInclinationOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.perceivedPoliticalInclinations = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getVisitorLocationOfMeetingOptionData() {
    this.userService.getVisitorLocationOfMeetingOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.meetingLocations = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getVisitorConstituencyData() {   
    this.userService.getVisitorConstituencyData().subscribe((response: any) => {
      if (response.error === false) {
          this.visitorConstituency = response.data;
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }
  getDistrict(){
    this.userService.getVisitorDistrict().subscribe((response: any) => {
      if (response.error === false) {
          this.visitorDistrict = response.data;
          console.log('getDistrict',response)
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  getCasteOptionData() {
    this.userService.getCasteOptionData().subscribe((response: any) => {
      if (response.error === false) {
          this.castes = response.data;
          if (this.castes) {
            this.visitorInformation.controls.caste.valueChanges.subscribe((res) => {
              this.casteFilter(res)
            })
          }
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  casteFilter(name: string) {
    const filterValue = name.toLowerCase();
    this.$castesSuggestion = this.castes.filter(option => option.caste.toLowerCase().indexOf(filterValue) === 0);
    // console.log(this.$castesSuggestion,"name",name,this.visitorInformation.controls.caste.value.trim().toLowerCase());
    // var trimcaste=this.visitorInformation.controls.caste.value.trim().toLowerCase();
    // this.visitorInformation.controls.caste.setValue(trimcaste);

  }
  occupationFilter(name: string) {
    const filterValue = name.toLowerCase();
    this.$occupationSuggestion = this.occupation.filter(option => option.occupation.toLowerCase().indexOf(filterValue) === 0);
  }

  boothNameByNumber(boothNumber) {
    this.fetchUniqueIdData = true;
    this.userService.boothNameByNumber(boothNumber).subscribe((response: any) => {
      if (response.error === false) {
          if (response.data[1]) {
            this.boothCoordinators = response.data[1];
          } else {
            this.politicalInformation.controls.boothCoordinator.setValue('');
            this.boothCoordinators = [];
            // this._snackBar.open('No any Booth Record Found !', '', {
            //   duration: 2000,
            // });
          }
          this.fetchUniqueIdData = false;
      }
    },(error) => {
      this.fetchUniqueIdData = false;
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  boothAddressByNumber(boothNumber) {
    this.fetchUniqueIdData = true;
    this.userService.boothNameByNumber(boothNumber).subscribe((response: any) => {
      if (response.error === false) {
          if (response.data[0]) {
            this.boothAddress = response.data[0];
            this.visitorAddress.controls.boothName.patchValue(this.boothAddress.booth_name);
            this.BoothAreas = this.boothAddress.booth_area_covered.split(',');
          } else {
            this.BoothAreas = [];
            this.visitorAddress.controls.boothArea.setValue('');
            this.visitorAddress.controls.boothName.setValue('');
          }
          this.fetchUniqueIdData = false;
      }
    },(error) => {
      this.fetchUniqueIdData = false;
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  } 

  getVisitorDataForEdit(visitorId) {
    if (visitorId) {
      this.userService.getVisitorDetail(visitorId).subscribe((response: any) => {
      if (response.error === false) {
        const res = response.data;

      this.visitorInformation.patchValue({
          visitorId: res.visitor._id,
          enrollmentDate: new Date(res.visitor.enrollmentDate),
          fullName: res.visitor.fullName,
          father: res.visitor.father,
          mother: res.visitor.mother,
          caste: res.visitor.caste,
          dob: res.visitor.dob,
          uniqueVisitorId: res.visitor.uniqueVisitorId,
          gender: res.visitor.gender,
          voterId: res.visitor.voterId,
          isNewVisitor: false,
          occupation:res.visitor.occupation
      });

      console.log('res::',res);

      if (res.addressInfo.boothNumber) {
        this.boothAddressByNumber(res.addressInfo.boothNumber)
      }

      this.visitorAddress.patchValue({
        visitorId: res.visitor._id,
        addressId: res.addressInfo._id,
        houseNumber: res.addressInfo.houseNumber,
        line1: res.addressInfo.line1,
        line2: res.addressInfo.line2,
        tehsil: res.addressInfo.tehsil,
        district: res.addressInfo.district,
        zipCode: res.addressInfo.zipCode,
        constituency: res.addressInfo.constituency,
        boothNumber: res.addressInfo.boothNumber,
        boothName: res.addressInfo.boothName,
        boothArea: res.addressInfo.boothArea,
        area:res.addressInfo.area
      });

      this.objectiveInformation.patchValue({
        visitorId: res.visitor._id,
        objectiveId: res.objectiveInfo._id,
        // totalVisits: res.objectiveInfo.totalVisits,
        // numberOfVisit: res.objectiveInfo.numberOfVisit,
        meetingLocation: res.objectiveInfo.meetingLocation,
        locationName: res.objectiveInfo.locationName,
        perceivedPoliticalInclination: res.objectiveInfo.perceivedPoliticalInclination,
        proximityOfVisitor: res.objectiveInfo.proximityOfVisitor,
        partyName: res.objectiveInfo.partyName,
        totalFamilyMembers: res.objectiveInfo.totalFamilyMembers,
        emailId: res.visitor.emailId,
        mobile: res.visitor.mobile,
        mobileTwo: res.visitor.mobileTwo,
        mobileThree: res.visitor.mobileThree,
        landLineNumber: res.visitor.landLineNumber,
        remark: res.objectiveInfo.remark,
      });

      if (res.politicalInfo.boothNumber) {
        this.boothNameByNumber(res.politicalInfo.boothNumber);
      }

      this.politicalInformation.patchValue({
        visitorId: res.visitor._id,
        politicalId: res.politicalInfo._id,
        visitorCategory: res.politicalInfo.visitorCategory,
        visitPurposeCategory: res.politicalInfo.visitPurposeCategory,
        purposeOfVisitText: res.politicalInfo.purposeOfVisitText,
        remarks: res.politicalInfo.remarks,
        refrenceMobile: res.politicalInfo.refrenceMobile,
        refrenceName: res.politicalInfo.refrenceName,
        refrenceRemark: res.politicalInfo.refrenceRemark,
        accompliceName: res.politicalInfo.accompliceName,
        accompliceMobile: res.politicalInfo.accompliceMobile,
        accompliceRemark: res.politicalInfo.accompliceRemark,
        whomToMeet: res.politicalInfo.whomToMeet,
        accomplicedDetails: res.politicalInfo.accomplicedDetails,
        isAcknowledgementSent: res.politicalInfo.isAcknowledgementSent,
        isSamajwadiPartyMember: res.politicalInfo.isSamajwadiPartyMember,
        acknowledgementMessage: res.politicalInfo.acknowledgementMessage,
        isInfoSentToBooth: res.politicalInfo.isInfoSentToBooth,
        boothNumber: res.politicalInfo.boothNumber,
        boothCoordinator: res.politicalInfo.boothCoordinator,
      });

      this.getVisitorImage(res.visitor._id);

      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
    }
  }

  getVisitorImage(id): void {
    this.userService.getVisitorImage(id).subscribe((response: any) => {
      if (response.imagePath){
        this.imageUrl = response.imagePath;
      } else {
        this.imageUrl = 'https://bulma.io/images/placeholders/480x480.png';
      }
    },(error) => {
      this.imageUrl = 'https://bulma.io/images/placeholders/480x480.png';
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const Visitor_id = this.visitorInformation.controls.visitorId.value;
      reader.onload = event => {
        this.uploadImageUrl = reader.result;

      };
      // this.onUpload();
      this.loader = true;
      this.userService.uploadVisitorImage(this.file, Visitor_id).subscribe((res) => {
        this.loader = false;
        this.imageUrl = this.uploadImageUrl
      }, (error) => {
        this.loader = false;
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
      })
     
    }
    
  }

  onUpload() {
    this.infoMessage = null;
    this.progress = 0;
    this.isUploading = true;
    const Visitor_id = this.visitorInformation.controls.visitorId.value;
    this.uploader.upload(this.file, Visitor_id).subscribe(message => {
      this.isUploading = false;
      this.infoMessage = message;
    });
  }


    getPosition() {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.getAddress=(this.lat,this.lng)
    
          this.mapsAPILoader.load().then(() => {
            let geocoder = new google.maps.Geocoder;
            let latlng = {lat: this.lat, lng: this.lng};
           
            geocoder.geocode({'location': latlng}, (results) => {
                if (results[0]) {
                this.objectiveInformation.controls.locationName.patchValue(results[0].formatted_address);
                } else {
                  this._snackBar.open('Unable to track location', '', {
                    duration: 5000,
                  });
                }
            });
          });
    
        }
      })
    }
}


visitorInformationFormSubmit(stepper?:any) {
  console.log(stepper,"name",this.visitorInformation.controls.caste.value.trim().toLowerCase());
  var trimcaste=this.visitorInformation.controls.caste.value.trim().toLowerCase();
  this.visitorInformation.controls.caste.setValue(trimcaste);
  if (this.visitorInformation.valid === true) {
    this.userService.visitorInformationFormSubmit(this.visitorInformation.value).subscribe((response: any) => {
      if (response.error === false) {
        this.visitorInformation.controls.visitorId.patchValue(response.data._id);
        this.visitorAddress.controls.visitorId.patchValue(response.data._id);
        this.objectiveInformation.controls.visitorId.patchValue(response.data._id);
        this.politicalInformation.controls.visitorId.patchValue(response.data._id);
        this.ifAddWorkerEvent['workerName']=this.visitorInformation.controls.fullName.value;
        this.ifAddWorkerEvent['fatherName']=this.visitorInformation.controls.father.value;
        this.ifAddWorkerEvent['motherName']=this.visitorInformation.controls.mother.value;
        this.ifAddWorkerEvent['caste']=this.visitorInformation.controls.caste.value;
        this.ifAddWorkerEvent['gender']=this.visitorInformation.controls.gender.value;
        this.ifAddWorkerEvent['workerId']=response.data._id;
        // this._snackBar.open(response.message, '', {
        //   duration: 5000,
        // });
        stepper.next();
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }
}



visitorAddressFormSubmit(stepper) {
  if (this.visitorAddress.valid === true) {
    this.userService.visitorAddressFormSubmit(this.visitorAddress.value).subscribe((response: any) => {
      if (response.error === false) {
        this.visitorAddress.controls.addressId.patchValue(response.data._id);

        this.ifScheduleEvent['boothNumber'] = this.visitorAddress.controls.boothNumber.value;
        this.ifScheduleEvent['boothName'] = this.visitorAddress.controls.boothName.value;
        this.ifScheduleEvent['boothArea'] = this.visitorAddress.controls.boothArea.value;
        this.ifAddWorkerEvent['houseNumber']= this.visitorAddress.controls.houseNumber.value;
      //  this.ifAddWorkerEvent['constituency']= this.visitorAddress.controls.constituency.value;
        this.ifAddWorkerEvent['boothNumber']= this.visitorAddress.controls.boothNumber.value;
        this.ifAddWorkerEvent['boothArea']= this.visitorAddress.controls.boothArea.value;
        this.ifAddWorkerEvent['boothName']= this.visitorAddress.controls.boothName.value;
        // this.ifAddWorkerEvent['voterId']= this.visitorAddress.controls.voterId.value;
        this.ifAddWorkerEvent['zipCode']= this.visitorAddress.controls.zipCode.value;

        this.ifAddWorkerEvent['district']= this.visitorAddress.controls.district.value;
        this.ifAddWorkerEvent['tehsil']= this.visitorAddress.controls.tehsil.value;
        this.ifAddWorkerEvent['colony']= this.visitorAddress.controls.line1.value;
        this.ifAddWorkerEvent['ward']= this.visitorAddress.controls.line2.value;



        stepper.next();
        // this._snackBar.open(response.message, '', {
        //   duration: 5000,
        // });
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }
}

objectiveInformationFormSubmit(stepper) {
  this.mobileFlag=this.objectiveInformation.controls.mobile.valid;
  if (this.objectiveInformation.valid === true) {
    this.objectiveInformation.controls.mobile.setValue(this.objectiveInformation.controls.mobile.value.toString());
    if( this.objectiveInformation.controls.mobileTwo.value){
      this.objectiveInformation.controls.mobileTwo.patchValue(this.objectiveInformation.controls.mobileTwo.value.toString());
    }
    else{
      this.objectiveInformation.controls.mobileTwo.patchValue("");
    }
    if( this.objectiveInformation.controls.mobileThree.value){
      this.objectiveInformation.controls.mobileThree.patchValue(this.objectiveInformation.controls.mobileThree.value.toString());
    }
    else{
      this.objectiveInformation.controls.mobileThree.patchValue("");
    }
   
    
    this.userService.objectiveInformationFormSubmit(this.objectiveInformation.value).subscribe((response: any) => {
      if (response.error === false) {
        this.objectiveInformation.controls.objectiveId.patchValue(response.data._id);

        this.ifScheduleEvent['locationName'] = this.objectiveInformation.controls.locationName.value;
        this.ifScheduleEvent['mobile'] = this.objectiveInformation.controls.mobile.value;
        this.ifAddWorkerEvent['emailId']= this.objectiveInformation.controls.emailId.value;
        this.ifAddWorkerEvent['mobile']= this.objectiveInformation.controls.mobile.value;
        stepper.next();
      }
    },(error) => {
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }
}

politicalInformationFormSubmit() {
  if (this.politicalInformation.valid === true) {
    this.submitFormLoader = true;
    this.userService.politicalInformationFormSubmit(this.politicalInformation.value).subscribe((response: any) => {
      if (response.error === false) {
        this.ifAddWorkerEvent['workerCategory']= this.politicalInformation.controls.visitorCategory.value;
  
        this.politicalInformation.controls.politicalId.patchValue(response.data._id);
        this._snackBar.open("Saved Successfully", '', {
          duration: 5000,
        }); 
        this.submitFormLoader = false;
        this.router.navigate(['/dashboard']);
        // if (this.politicalInformation.controls.visitPurposeCategory.value === 'Invitation'){
        //   this.router.navigate(['/scheduler-meeting'], { state: this.ifScheduleEvent });
        // } 
        // else if(this.politicalInformation.controls.visitorCategory.value === 'Political worker'  && this.editForm == false){
        //   this.router.navigate(['/worker-add'], { state: this.ifAddWorkerEvent });
        // }
        // else {
        //   this.router.navigate(['/dashboard']);
        // }
      }
    },(error) => {
      this.submitFormLoader = false;
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }
}


  // Use for further 

  // politicalInclinationPartySelect(value) {
  //   if (value === 'Other') {
  //     this.otherOptionOfSelectParty = true;
  //   } else {
  //     this.otherOptionOfSelectParty = false;
  //   }
  // }


  meetingLocationPopup(meetingLocationValue): void {
    if (meetingLocationValue === 'On the Fly') {
      const dialogRef = this.dialog.open(PickupLocationComponent, {
        width: '60%',
      });
      dialogRef.afterClosed().subscribe(coordinatorAddress => {
        if (coordinatorAddress !== undefined) {
         this.objectiveInformation.controls.locationName.patchValue(coordinatorAddress);
        } else {
          // this.objectiveInformation.controls.meetingLocation.patchValue('');
        }
      });
    } else {
      this.objectiveInformation.controls.locationName.patchValue(meetingLocationValue);
    }
  }

  startWeb() {
    const dialogRef = this.dialog.open(CameraModalComponent, {
      width: '70%',
    });
    dialogRef.afterClosed().subscribe(webCam => {
      if (webCam !== undefined) {
      const Visitor_id = this.visitorInformation.controls.visitorId.value;
      this.loaderWebcam = true;
        fetch(webCam._imageAsDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "File name",{ type: "image/png" });
          this.userService.uploadVisitorImage(file, Visitor_id).subscribe((res) => {
            this.loaderWebcam = false;
            this.imageUrl = webCam._imageAsDataUrl;
          }, (error) => {
            this.loaderWebcam = false;
            this.imageUrl = "https://bulma.io/images/placeholders/480x480.png";
            this._snackBar.open(error.message, '', {
              duration: 5000,
            });
          })
        })
  
      } else {
        this.imageUrl = "https://bulma.io/images/placeholders/480x480.png";
      }
    });
  }

  existVisitorBtn(ev): void {
    if (ev.value === false) {
      this.existVisitorForm();
      this.existVisitorFlag = true;
    } else {
      this.readyForm();
      this.autoSuggestionName();
      this.existVisitorFlag = false;
    }
  }

  uniqueVisitorIdFetchData(event) {
    if (event.length === 13) {
      this.fetchUniqueIdData = true;
      this.userService.uniqueVisitorIdFetchData(event).subscribe((response: any) => {
        if (response.error === false) {
          this.fetchUniqueIdData = false;
          if (response.data.length) {
              const existVisitorData = response.data.slice(-1).pop();
            
              this.ExistVisitorInformation.patchValue({
                date: new Date(existVisitorData.date),
                meetingLocationForExist: existVisitorData.meetingLocation,
                visitPurposeCategoryForExist: existVisitorData.visitPurposeCategory,
                whomToMeetForExist: existVisitorData.whomToMeet,
                meetingRemark: existVisitorData.meetingRemark,
                perceivedPoliticalInclinationForExist: existVisitorData.perceivedPoliticalInclination,
                
            });
         }
        }
      },(error) => {
        this.fetchUniqueIdData = false;
          this._snackBar.open(error.message, '', {
            duration: 5000,
          });
      });
    }
  }

  ExistVisitorInformationFormSubmit(): void {
    this.submitFormLoader = true;
    const existVisitorLocal = {
      uniqueVisitorId: this.ExistVisitorInformation.controls.uniqueVisitorId.value,
      date: this.ExistVisitorInformation.controls.date.value,
      visitPurposeCategory: this.ExistVisitorInformation.controls.visitPurposeCategoryForExist.value,
      meetingLocation: this.ExistVisitorInformation.controls.meetingLocationForExist.value,
      whomToMeet: this.ExistVisitorInformation.controls.whomToMeetForExist.value,
      meetingRemark: this.ExistVisitorInformation.controls.meetingRemark.value,
      perceivedPoliticalInclination: this.ExistVisitorInformation.controls.perceivedPoliticalInclinationForExist.value,
    }
  
    this.userService.ExistVisitorInformationFormSubmit(existVisitorLocal).subscribe((response: any) => {
      if (response.error === false) {
        this._snackBar.open(response.message, '', {
          duration: 5000,
        }); 
        this.submitFormLoader = false;
        this.router.navigate(['/dashboard']);
      }
    },(error) => {
      this.submitFormLoader = false;
        this._snackBar.open(error.message, '', {
          duration: 5000,
        });
    });
  }
  
}
