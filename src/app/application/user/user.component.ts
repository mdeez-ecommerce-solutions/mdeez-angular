import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TotalVisitComponent } from 'src/app/shared/modals/total-visit/total-visit.component';


import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  visitorLists: any;
  visitorId: any;
  VisitorName: any;
  exportVisitorListFileName = 'visitorVisit.xlsx';
  displayedColumns: string[] = ['S.No.', 'Name', 'Email', 'Role', 'Action'];
  dataSource = [
    {name:'Himanshu', email:"himanshuarora2188@gmail.com", role:"Admin"},
    {name:'Test', email:"test@example.com", role:"Editors"}
   ]
  // dataSource: any;
  authData
  adminRole=environment.ADMIN_ROLE
  editorRole=environment.EDITOR_ROLE
  constructor(private userService: UserService, private _snackBar: MatSnackBar, private dialog: MatDialog, 
    private route: ActivatedRoute, ) {
      this.authData = JSON.parse(localStorage.getItem("SignInUserData"));
    }
  ngOnInit(): void {
    
    this.VisitorName=this.route.snapshot.paramMap.get('VisitorName');
  this.visitorId = this.route.snapshot.paramMap.get('Visitorid');
  
 this.getTotalVisitList(1);
 this.getAllUser()
  }
  getAllUser(){
    this.userService.getAllUser().subscribe((res:any)=>{
      console.log(res)
    })
  }
  getTotalVisitList(pageIndexOfListingTable?:any): void {

    this.userService.getVisitorList(pageIndexOfListingTable).subscribe((response: any) => {
      if (response.error === false) {
          this.visitorLists = response.data.response;
          // this.dataSource = new MatTableDataSource<any>(this.visitorLists);
         
          // this.dataSource.paginator = this.paginator;
      }
    }, (error) => {
      this._snackBar.open(error.message, '', {
        duration: 5000,
      });
    });
  }
  
  openAction(item) {

    const dialogRef = this.dialog.open(TotalVisitComponent, {
      width: "700px",
    //  height: '700px',
     data: item,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.VisitorName=this.route.snapshot.paramMap.get('VisitorName');
      this.visitorId = this.route.snapshot.paramMap.get('Visitorid');
      
     this.getTotalVisitList(this.visitorId);
    });
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
}
