import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { TotalVisitComponent } from 'src/app/shared/modals/total-visit/total-visit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-total-visit-list',
  templateUrl: './total-visit-list.component.html',
  styleUrls: ['./total-visit-list.component.css']
})
export class TotalVisitListComponent implements OnInit {
  visitorLists: any;
  visitorId: any;
  VisitorName: any;
  exportVisitorListFileName = 'visitorVisit.xlsx';
  dataSource: any;
  visitorDetail
  baseApiUrl
  isLoaderHappen: boolean;
  filterValue: any;
  isLoadingResults: boolean;
  rangeDate: any;
  filterInitial = "";
  range = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });
  filterKeyword: any;
  visitorListsTotalLength: any;
  exportList: any = [];
  pageLength:any;
  purposes: any;
  pageIndexOfListingTable: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "S.No.",
    "Unique Visitor ID",
    "Visitor_Name",
    "Address",
    "Date",
    "enrollmentDate",
    "Mobile",
    "Purpose_of_Visit",
    "Status",
    "Visitor_Category",
    "Total_no_of_Visits",
    "Remarks",
    "politicalInformationRemarks",
    "refrenceName",
    "refrenceMobile",
    "refrenceRemark",
    "accompliceName",
    "accompliceMobile",
    "accompliceRemark",
    "captureDetailsOfAnyAccompliceWithTheVisitor",
    "Action",
  ];
  dateFilterDropdownOption=[
    {value:"1Day",label:"Today"},
    {value:"7Day",label:"Last 7 Day"},
    {value:"14Day",label:"Last 14 Day"},
    {value:"30Day",label:"Last 30 Day"},
    {value:"week",label:"This Week"},
    {value:"month",label:"This Month"},
  ]
  today = new Date();
  date = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate()
  filterInitialDateRange =""
  constructor(
    private userService: UserService, private _snackBar: MatSnackBar, private dialog: MatDialog,
     private route: ActivatedRoute,private router:Router ) {
      this.baseApiUrl = environment.api_base_url +'/visitor/download-csv?limit=100000';
      
     }

  ngOnInit(): void {


    this.VisitorName=this.route.snapshot.paramMap.get('VisitorName');
    this.visitorId = this.route.snapshot.paramMap.get('Visitorid');
    this.getVisitorList(1)
    this.getVisitorPurposeOptionData()
  }

  
 addDays(theDate, days) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}

// 

  selecteRingSize(value){
    let dropDownValue = value
    console.log(value)
    let now = new Date()
    if(dropDownValue==='1Day'){
      var newDatew = this.addDays(new Date(), -1);
      this.range.value.fromDate = newDatew 
      this.range.value.toDate = now
      this.filterTable()
    }else if(dropDownValue==='7Day'){
      var newDatew = this.addDays(new Date(), -7);
      this.range.value.fromDate = newDatew
      this.range.value.toDate = now 
      this.filterTable()
    }else if(dropDownValue==='14Day'){
      var newDatew = this.addDays(new Date(), -14);
      this.range.value.fromDate = newDatew
      this.range.value.toDate = now
      this.filterTable()
    }
    else if(dropDownValue==='30Day'){
      var newDatew = this.addDays(new Date(), -30);
      this.range.value.fromDate = newDatew
      this.range.value.toDate = now
      this.filterTable()
    } else if(dropDownValue==='week'){
      var newDatew = this.addDays(new Date(), -8);
      this.range.value.fromDate = newDatew
      this.range.value.toDate = now
      this.filterTable()
    } else if(dropDownValue==='month'){
      var newDatew = this.addDays(new Date(), -30);
      this.range.value.fromDate = newDatew
      this.range.value.toDate = now
      this.filterTable()
    }else{
      this.range.reset()
      this.filterTable() 
    }
}
modelChanged(newObj){
console.log(newObj)
if(newObj){
  this.filterTable()
}
}
  addVisitorDetail(visitorId): void {
    this.router.navigate(["/add-visitor", visitorId]);
  }

  pinColumn(e){
  
    e.preventDefault();

      // var index = $("#exportVisitorListTable th a").index(e.target);
      const index = Array.from($("#exportVisitorListTable th")).indexOf(e.target.parentElement) + 1;
      console.log('indi:',index);

      $(e.target).toggleClass("active");
      $("th:nth-child(" + index + "), td:nth-child(" + index + ")").toggleClass("pinned");

 
  }



  exportTable() {
    /* table id is passed over here */
    const element = document.getElementById('exportVisitorListTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {
      cellDates: true,
      raw: true
    });
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.exportVisitorListFileName);
  }

  exportTableInPDF(): void {
    const doc = new jsPDF('l');

    const pages = doc.getNumberOfPages();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    // doc.setFontSize(10);

    for (let j = 1; j < pages + 1; j++) {
      const horizontalPos = pageWidth / 2; //Can be fixed number
      const verticalPos = pageHeight - 10; //Can be fixed number
      doc.setPage(j);
      doc.text(`Copyright © 2006-2021, NSIGHT Consulting. All rights reserved.`, horizontalPos, verticalPos, {
        align: 'center'
      });
    }

    doc.text('Visitor Visits List', 65, 13, null, 'center');
    doc.text('Date & Time : ' + new Date().toLocaleString().toString(), 240, 13, null, 'center');


    autoTable(doc, {
      margin: {
        top: 25
      },
      html: '#exportVisitorListTable'
    })
    doc.save('visitorVisit.pdf');
  }



  openInNewTab() {
    // this._snackBar.open("Please wait while we are downloading your data..");
     this.isLoaderHappen = false;
     this._snackBar.open("Please wait while we are downloading your data..", "", {
       duration: 5000,
     });
     console.log("this.isLoaderHappen", this.isLoaderHappen);
     // this.userService.download(this.baseApiUrl)
     //   .subscribe(blob => {saveAs(blob, 'VisitorList')
     //   this._snackBar.dismiss();});
     // FileSaver.saveAs(this.baseApiUrl, 'VisitorList');
     window.open(this.baseApiUrl, '_blank');
    //window.open(this.baseApiUrl,'MyWindow','width=600,height=300'); return false;
    }
    filterTable(): void {
      this.isLoadingResults = true;
      console.log(this.range.value)
      this.userService
        .getVisitorByFilter(
          this.filterInitial,
          this.filterValue,
          this.range.value,
         1
        )
        .subscribe(
          (response: any) => {
            if (response.error === false) {
              this.filterKeyword = {
              search: this.filterInitial,
              purpose: this.filterValue,
              date: this.range.value,
              }
              this.visitorLists = response.data.response;
              this.visitorListsTotalLength = response.data.length;
              this.exportList=[];
              for (var i = 0; i <= this.visitorLists.length - 1; i++) {
                var d = new Date(this.visitorLists[i].createdAt);
    
                var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
                var Ed = new Date(this.visitorLists[i].enrollmentDate);
    
                var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
                this.exportList.push({
                  serial: i + 1,
                  uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
                  fullName: this.visitorLists[i].fullName,
                  address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
                  createdAt: day,
                  enrollmentDate: Eday,
                  mobile: this.visitorLists[i].mobile,
                  revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
                  revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
                  visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                  totalVisits: this.visitorLists[i].totalVisits,
                  remark: this.visitorLists[i].objectiveInfoRemark,
                  politicalRemark: this.visitorLists[i].politicalInforRemark,
    
                })
    
              }
              this.dataSource = new MatTableDataSource < any > (this.visitorLists);
              // this.dataSource.paginator = this.paginator;
              this.paginator.pageIndex = 0;
              this.pageLength = this.visitorListsTotalLength;
              this.isLoadingResults = false;
            }
          },
          (error) => {
            this.isLoadingResults = false;
            this._snackBar.open(error.message, "", {
              duration: 5000,
            });
          }
        );
    }
  
    
    getVisitorList(pageIndexOfListingTable?:any): void {
      this.isLoadingResults = true;
      var currentTime = new Date();
      var fromdate = new Date("Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)");
      const range = {fromDate:fromdate,toDate:currentTime}
      this.userService.getVisitorList(pageIndexOfListingTable).subscribe(
        (response: any) => {
          if (response.error === false) {
            this.visitorLists = response.data.response;
           
            this.visitorListsTotalLength = response.data.length;
            this.exportList=[];
            for (var i = 0; i <= this.visitorLists.length - 1; i++) {
              var d = new Date(this.visitorLists[i].createdAt);
  
              var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
              var Ed = new Date(this.visitorLists[i].enrollmentDate);
  
              var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
              this.exportList.push({
                serial: i + 1,
                uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
                fullName: this.visitorLists[i].fullName,
                // address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
                address:"ADDRESS DUMMY",
                createdAt: day,
                enrollmentDate: Eday,
                mobile: this.visitorLists[i].mobile,
                revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
                revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
                visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                totalVisits: this.visitorLists[i].totalVisits,
                remark: this.visitorLists[i].objectiveInfoRemark,
                politicalRemark: this.visitorLists[i].politicalInforRemark,
  
              })
            }
            this.dataSource = new MatTableDataSource < any > (this.visitorLists);
            this.pageLength =response.data.length;
            console.log(this.visitorLists)
            // this.dataSource.paginator = this.paginator;
            this.paginator.pageIndex = 0;
            // this.pageLength = this.visitorListsTotalLength;
         
            this.isLoadingResults = false;
          }
        },
        (error) => {
          this.isLoadingResults = false;
          this._snackBar.open(error.message, "", {
            duration: 5000,
          });
        }
      );
    }
    getVisitorPurposeOptionData() {
      this.userService.getVisitorPurposeOptionData().subscribe(
        (response: any) => {
          if (response.error === false) {
            this.purposes = response.data;
          }
        },
        (error) => {
          this._snackBar.open(error.message, "", {
            duration: 5000,
          });
        }
      );
    }
    resetFilter() {
      this.paginator.pageIndex = 0;
      this.visitorListsTotalLength = 1;
      this.filterInitial = "";
      this.filterValue = "";
      this.pageLength =0;
      this.range.controls.fromDate.setValue("");
      this.range.controls.toDate.setValue("");
      this.filterKeyword = {
        search: this.filterInitial,
        purpose: this.filterValue,
        date: this.range.value,
        }
        this.getVisitorList(1)
    }
    yourPageChangeLogic(event){

    }
    filterByName(value){
      this.filterValue=value
      this.filterInitial=''
      this.range.reset()
      this.filterTable()
    }
    filterPurpose(value){
      this.filterInitial=value
      this.filterValue=''
      this.range.reset()
      this.filterTable()
    }
    filterDate(){
      this.filterInitial=''
      this.filterValue=''
      this.filterTable()
    }

    getVisitorDetail(id): void {
      this.userService.getVisitorDetail(id).subscribe((response: any) => {
        if (response.error === false) {
            this.visitorDetail = response.data;
            this.openAction(this.visitorDetail)
        }
      },(error) => {
          this.router.navigate(['']);
          this._snackBar.open(error.message, '', {
            duration: 5000,
          });
      });
    }

    openAction(item) {
      console.log(item)
       const dialogRef = this.dialog.open(TotalVisitComponent, {
         width: "700px",
       //  height: '700px',
        data: item.visitor,
       });
   
       dialogRef.afterClosed().subscribe(() => {
         this.VisitorName=this.route.snapshot.paramMap.get('VisitorName');
         this.visitorId = this.route.snapshot.paramMap.get('Visitorid');
         console.log(this.visitorId)
   
        // this.getTotalVisitList(this.visitorId);
   
       });
     }
   
    //  getTotalVisitList(visitorId): void {
   
    //    this.userService.getTotalVisitorList(visitorId).subscribe((response: any) => {
    //      if (response.error === false) {
    //          this.visitorLists = response.data;
    //          this.dataSource = new MatTableDataSource<any>(this.visitorLists);
            
    //          this.dataSource.paginator = this.paginator;
    //      }
    //    }, (error) => {
    //      this._snackBar.open(error.message, '', {
    //        duration: 5000,
    //      });
    //    });
    //  }
  }