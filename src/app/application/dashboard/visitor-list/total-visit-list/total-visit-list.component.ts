import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { TotalVisitComponent } from 'src/app/shared/modals/total-visit/total-visit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';

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
  constructor(
    private userService: UserService, private _snackBar: MatSnackBar, private dialog: MatDialog,
     private route: ActivatedRoute, ) {
      this.baseApiUrl = environment.api_base_url +'/visitor/download-csv?limit=100000';

     }
  ngOnInit(): void {
    this.VisitorName=this.route.snapshot.paramMap.get('VisitorName');
    this.visitorId = this.route.snapshot.paramMap.get('Visitorid');
    this.getVisitorList(1)
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
            this.pageLength =response.data.length;
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
    }
    yourPageChangeLogic(event){

    }
  }