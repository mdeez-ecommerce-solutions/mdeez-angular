import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnChanges,
  HostListener,
} from "@angular/core";
import {
  isPlatformBrowser
} from "@angular/common";
import moment from 'moment';
// amCharts imports

import { useTheme, options, create, math, ResponsiveBreakpoints, DropShadowFilter, Tooltip, Button, RadialGradient, LinearGradient, Scrollbar, color, percent, type, array, PlayButton, Label, Circle, ZoomOutButton, DataSource, MouseCursorStyle } from '@amcharts/amcharts4/core';
import * as am4maps from "@amcharts/amcharts4/maps";
// import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4geodata_worldLow from "@amcharts/amcharts4-geodata/indiaHigh";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { environment } from '../../../environments/environment';
import {
  FormGroup,
  FormControl
} from "@angular/forms";
import {
  UserService
} from "src/app/core/services/user.service";
import {
  MatSnackBar
} from "@angular/material/snack-bar";
import {
  MatTableDataSource
} from "@angular/material/table";
import {
  MatPaginator, PageEvent
} from "@angular/material/paginator";

import am4geodata_indiaHigh from "@amcharts/amcharts4-geodata/indiaHigh";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Router
} from "@angular/router";
import { saveAs } from 'file-saver';
import {
  toBase64String
} from "@angular/compiler/src/output/source_map";

// import * as data from "./graphs/states-map/geojson.json";
import * as data from "./graphs/states-map/patiala.json";


/* Chart code */
// Themes begin
useTheme(am4themes_animated);
options.queue = false;
// // options.animationsEnabled = true;
// options.deferredDelay = 0;
options.onlyShowOnViewport = true;


declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnChanges {
  purposes: any;
  exportVisitorListFileName = "VisitorVisit.xlsx";
  pageEvent: PageEvent;
  pageLength: any;
  visitorOccupationOption: any;

  range = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  geodatajson = data;

  visitorLists: any;
  exportList: any = [];
  psData = {};
  allData = {
    "2003": [
      {
        "network": "Electricity Problem",
        "MAU": 0
      },
      {
        "network": "Regarding Job",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 0
      },

      {
        "network": "Water Problem",
        "MAU": 4470000
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 0
      }
    ],
    "2004": [
      {
        "network": "Electricity Problem",
        "MAU": 0
      },
      {
        "network": "Regarding Job",
        "MAU": 3675135
      },
      {
        "network": "Water Problem",
        "MAU": 5970054
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 980036
      },
      {
        "network": "Unknown Problem",
        "MAU": 4900180
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 0
      }
    ],
    "2005": [
      {
        "network": "Electricity Problem",
        "MAU": 0
      },
      {
        "network": "Regarding Job",
        "MAU": 7399354
      },
      {
        "network": "Water Problem",
        "MAU": 7459742
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 9731610
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 19490059
      },
      {
        "network": "Unknown Problem",
        "MAU": 9865805
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 1946322
      }
    ],
    "2006": [
      {
        "network": "Electricity Problem",
        "MAU": 0
      },
      {
        "network": "Regarding Job",
        "MAU": 14949270
      },
      {
        "network": "Water Problem",
        "MAU": 8989854
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 19932360
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 54763260
      },
      {
        "network": "Unknown Problem",
        "MAU": 14966180
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 248309
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 19878248
      }
    ],
    "2007": [
      {
        "network": "Electricity Problem",
        "MAU": 0
      },
      {
        "network": "Regarding Job",
        "MAU": 29299875
      },
      {
        "network": "Water Problem",
        "MAU": 24253200
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 29533250
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 69299875
      },
      {
        "network": "Unknown Problem",
        "MAU": 26916562
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 488331
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 143932250
      }
    ],
    "2008": [
      {
        "network": "Electricity Problem",
        "MAU": 100000000
      },
      {
        "network": "Regarding Job",
        "MAU": 30000000
      },
      {
        "network": "Water Problem",
        "MAU": 51008911
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 55045618
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 72408233
      },
      {
        "network": "Unknown Problem",
        "MAU": 44357628
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 1944940
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 294493950
      }
    ],
    "2009": [
      {
        "network": "Electricity Problem",
        "MAU": 276000000
      },
      {
        "network": "Regarding Job",
        "MAU": 41834525
      },
      {
        "network": "Water Problem",
        "MAU": 28804331
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 57893524
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 70133095
      },
      {
        "network": "Unknown Problem",
        "MAU": 47366905
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 3893524
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 0
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 0
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 413611440
      }
    ],
    "2010": [
      {
        "network": "Electricity Problem",
        "MAU": 517750000
      },
      {
        "network": "Regarding Job",
        "MAU": 54708063
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 166029650
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 59953290
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 68046710
      },
      {
        "network": "Unknown Problem",
        "MAU": 49941613
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 43250000
      },
      {
        "network": "Foreign Issues",
        "MAU": 0
      },
      {
        "network": "Help Seeking",
        "MAU": 19532900
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 480551990
      }
    ],
    "2011": [
      {
        "network": "Electricity Problem",
        "MAU": 766000000
      },
      {
        "network": "Regarding Job",
        "MAU": 66954600
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 170000000
      },
      {
        "network": "Sewer Problem",
        "MAU": 0
      },
      {
        "network": "Political Purpose",
        "MAU": 46610848
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 46003536
      },
      {
        "network": "Unknown Problem",
        "MAU": 47609080
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 0
      },
      {
        "network": "Hiring",
        "MAU": 92750000
      },
      {
        "network": "Foreign Issues",
        "MAU": 47818400
      },
      {
        "network": "Help Seeking",
        "MAU": 48691040
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 642669824
      }
    ],
    "2012": [
      {
        "network": "Electricity Problem",
        "MAU": 979750000
      },
      {
        "network": "Regarding Job",
        "MAU": 79664888
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 170000000
      },
      {
        "network": "Sewer Problem",
        "MAU": 107319100
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 0
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 45067022
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 146890156
      },
      {
        "network": "Hiring",
        "MAU": 160250000
      },
      {
        "network": "Foreign Issues",
        "MAU": 118123370
      },
      {
        "network": "Help Seeking",
        "MAU": 79195730
      },
      {
        "network": "Marital Issues",
        "MAU": 0
      },
      {
        "network": "Education",
        "MAU": 844638200
      }
    ],
    "2013": [
      {
        "network": "Electricity Problem",
        "MAU": 1170500000
      },
      {
        "network": "Regarding Job",
        "MAU": 80000000
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 170000000
      },
      {
        "network": "Sewer Problem",
        "MAU": 205654700
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 117500000
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 0
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 293482050
      },
      {
        "network": "Hiring",
        "MAU": 223675000
      },
      {
        "network": "Foreign Issues",
        "MAU": 196523760
      },
      {
        "network": "Help Seeking",
        "MAU": 118261880
      },
      {
        "network": "Marital Issues",
        "MAU": 300000000
      },
      {
        "network": "Education",
        "MAU": 1065223075
      }
    ],
    "2014": [
      {
        "network": "Electricity Problem",
        "MAU": 1334000000
      },
      {
        "network": "Regarding Job",
        "MAU": 0
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 170000000
      },
      {
        "network": "Sewer Problem",
        "MAU": 254859015
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 250000000
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 135786956
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 388721163
      },
      {
        "network": "Hiring",
        "MAU": 223675000
      },
      {
        "network": "Foreign Issues",
        "MAU": 444232415
      },
      {
        "network": "Help Seeking",
        "MAU": 154890345
      },
      {
        "network": "Marital Issues",
        "MAU": 498750000
      },
      {
        "network": "Education",
        "MAU": 1249451725
      }
    ],
    "2015": [
      {
        "network": "Electricity Problem",
        "MAU": 1516750000
      },
      {
        "network": "Regarding Job",
        "MAU": 0
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 170000000
      },
      {
        "network": "Sewer Problem",
        "MAU": 298950015
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 400000000
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 0
      },
      {
        "network": "Human Welfare",
        "MAU": 163346676
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 475923363
      },
      {
        "network": "Hiring",
        "MAU": 304500000
      },
      {
        "network": "Foreign Issues",
        "MAU": 660843407
      },
      {
        "network": "Help Seeking",
        "MAU": 208716685
      },
      {
        "network": "Marital Issues",
        "MAU": 800000000
      },
      {
        "network": "Education",
        "MAU": 1328133360
      }
    ],
    "2016": [
      {
        "network": "Electricity Problem",
        "MAU": 1753500000
      },
      {
        "network": "Regarding Job",
        "MAU": 0
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 398648000
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 550000000
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 143250000
      },
      {
        "network": "Human Welfare",
        "MAU": 238972480
      },
      {
        "network": "Society Issues",
        "MAU": 238648000
      },
      {
        "network": "Advertisement",
        "MAU": 0
      },
      {
        "network": "Business",
        "MAU": 565796720
      },
      {
        "network": "Hiring",
        "MAU": 314500000
      },
      {
        "network": "Foreign Issues",
        "MAU": 847512320
      },
      {
        "network": "Help Seeking",
        "MAU": 281026560
      },
      {
        "network": "Marital Issues",
        "MAU": 1000000000
      },
      {
        "network": "Education",
        "MAU": 1399053600
      }
    ],
    "2017": [
      {
        "network": "Electricity Problem",
        "MAU": 2035750000
      },
      {
        "network": "Regarding Job",
        "MAU": 0
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 495657000
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 750000000
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 195000000
      },
      {
        "network": "Human Welfare",
        "MAU": 297394200
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 239142500
      },
      {
        "network": "Business",
        "MAU": 593783960
      },
      {
        "network": "Hiring",
        "MAU": 328250000
      },
      {
        "network": "Foreign Issues",
        "MAU": 921742750
      },
      {
        "network": "Help Seeking",
        "MAU": 357569030
      },
      {
        "network": "Marital Issues",
        "MAU": 1333333333
      },
      {
        "network": "Education",
        "MAU": 1495657000
      }
    ],
    "2018": [
      {
        "network": "Electricity Problem",
        "MAU": 2255250000
      },
      {
        "network": "Regarding Job",
        "MAU": 0
      },
      {
        "network": "Water Problem",
        "MAU": 0
      },
      {
        "network": "Invitation",
        "MAU": 0
      },
      {
        "network": "Sewer Problem",
        "MAU": 430000000
      },
      {
        "network": "Political Purpose",
        "MAU": 0
      },
      {
        "network": "Road Problem",
        "MAU": 1000000000
      },
      {
        "network": "Service Problem",
        "MAU": 0
      },
      {
        "network": "Unknown Problem",
        "MAU": 0
      },
      {
        "network": "Healthcare",
        "MAU": 246500000
      },
      {
        "network": "Human Welfare",
        "MAU": 355000000
      },
      {
        "network": "Society Issues",
        "MAU": 0
      },
      {
        "network": "Advertisement",
        "MAU": 500000000
      },
      {
        "network": "Business",
        "MAU": 624000000
      },
      {
        "network": "Hiring",
        "MAU": 329500000
      },
      {
        "network": "Foreign Issues",
        "MAU": 1000000000
      },
      {
        "network": "Help Seeking",
        "MAU": 431000000
      },
      {
        "network": "Marital Issues",
        "MAU": 1433333333
      },
      {
        "network": "Education",
        "MAU": 1900000000
      }
    ]
  }
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
    // "Thank_You_Acknowledgment_message_sent",
    // "Information_sent_to_the_booth_village_coordinator_of_the_visitor",
    "Action",
  ];
  liveyear = 2003;
  dataSource: any;
  rangeDate: any;
  filterInitial = "";
  filterValue: any;
  anlyticData: any;
  isLoadingResults: boolean;
  castes = [];
  perceivedPoliticalInclinationsOption = [];
  visitorCategoriesOption = [];
  whomVisitorMeetsOption = [];
  meetingLocationsOption = [];
  statePolygonForGeo: any;
  visitorAreaData: any;
  purposeGraph: any;
  livepurposeGraph?: any;
  genderGraph: any;
  casteGraph: any;
  visitorCategoryData: any;
  visitorOccupatioData: any;
  ageGraphData: any;
  perceivedPoliticalInclinationData: any;
  meetingLocationGraphData: any;
  timeFrameGraphData: any;
  timeFrameXText?: any;
  whomVisitorMeetGraphData: any;
  meetingStatusGraphData: any;
  graphDataLoader: boolean;
  graphDataLoader1: boolean;
  graphDataLoader2: boolean;
  graphDataLoader3: boolean;
  viewGraphresetBtn: boolean;
  geodata: any;
  geodata1: any;
  filteredVisitorCount: any;
  visitorListsTotalLength: any;
  pageIndexOfListingTable: any;
  filterKeyword: any;
  isLoaderHappen: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  samajwadiPartyGraphData: any;
  exportAllDataVar: any;
  baseApiUrl: any;
  appliedFilters = {}
  authData
  adminRole = environment.ADMIN_ROLE
  superAdminRole = environment.SUPER_ADMIN_ROLE
  editorRole = environment.EDITOR_ROLE
  loader = false;
  authenticated = false
  networkSeries: any;
  pbPoints:any;


  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.authData = JSON.parse(localStorage.getItem("SignInUserData"));

    switch (this.authData.role) {
      case 'SUPER_ADMIN': {
        this.authenticated = true
        break;
      }
      case 'ADMIN': {
        this.authenticated = true
        break;
      }
    }
    this.userService.isLoadingVisitorList.subscribe((res) => this.isLoaderHappen = res);
    this.baseApiUrl = environment.api_base_url + '/visitor/download-csv?limit=100000';

  }

  ngOnInit(): void {

    // this.livepurposeGraph = [];
    // this.genderGraph = [];
    // this.casteGraph = [];
    // this.paginator = null;

    this.purposeGraph = [];
    this.timeFrameGraphData = []
    this.timeFrameXText = []
    // this.getFilterMeetStatus()
    // this.getFilterArea()
    // // this.getFilterDistrictConstituency()
    // this.getFilterAgeGroup()
    // this.getFilterMeetLocation()
    // this.getFilterIsSamjawadi()
    // this.getFilterGender()
    // this.getFilterCaste()
    // this.getFilterOccupation()
    // this.getFilterPpi()
    // this.getFilterPurpose()
    // this.getFilterTimeFrame()
    // this.getFilterVisitorCategory()
    // this.getFilterVisitorMeet()
    // this.getVisitorList(1);
    // this.rangeSelection();
    // this.getVisitorPurposeOptionData();
    // this.getCasteOptionData();
    // this.getVisitorPoliticalInclinationOptionData();
    // this.getVisitorCategoryOptionData();
    //this.getWhomToMeetOptionData();
    // this.getVisitorLocationOfMeetingOptionData();
    this.getVisitAnalyticData();
    this.getVisitorOccupationData();


    // Graph Data Calling
    this.genderGraph = [];
    this.casteGraph = [];


    this.getVisitAnalyticGraphData();



    //  // this.rangeSelection();
    //  this.getVisitorPurposeOptionData();
    //  this.getCasteOptionData();
    //  this.getVisitorPoliticalInclinationOptionData();
    //  this.getVisitorCategoryOptionData();
    //  this.getWhomToMeetOptionData();
    //  this.getVisitorLocationOfMeetingOptionData();
    //  this.getVisitAnalyticData();
    //  this.getVisitorOccupationData();

    //  // Graph Data Calling
    //   this.getVisitAnalyticGraphData();

  }
  openInNewTab() {
    // this._snackBar.open("Please wait while we are downloading your data..");
    this.isLoaderHappen = false;
    this._snackBar.open("Please wait while we are downloading your data..", "", {
      duration: 5000,
    });
    // console.log("this.isLoaderHappen", this.isLoaderHappen);
    // this.userService.download(this.baseApiUrl)
    //   .subscribe(blob => {saveAs(blob, 'VisitorList')
    //   this._snackBar.dismiss();});
    // FileSaver.saveAs(this.baseApiUrl, 'VisitorList');
    window.open(this.baseApiUrl, '_blank');
    //window.open(this.baseApiUrl,'MyWindow','width=600,height=300'); return false;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.ngOnChanges();
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {

      useTheme(am4themes_animated);
      //  this.geoMapDistrict();
      // Create geomap :AC instance
      let chart = create("geoMap", am4maps.MapChart);
      chart.logo.disabled = true;
      chart.maxZoomLevel = 64;

      chart.geodata = am4geodata_indiaHigh;
      // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]

      // Set projection
      chart.projection = new am4maps.projections.Projection();

      // Add button
      let zoomOut = chart.tooltipContainer.createChild(ZoomOutButton);
      zoomOut.align = "right";
      zoomOut.valign = "top";
      zoomOut.margin(20, 20, 20, 20);
      zoomOut.events.on("hit", function () {
        if (currentSeries) {
          currentSeries.hide();
        }
        chart.goHome();
        zoomOut.hide();
        currentSeries = regionalSeries.IN.series;
        currentSeries.show();
      });
      zoomOut.hide();

      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;
      polygonSeries.calculateVisualCenter = true;

      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = chart.colors.getIndex(9);
      //shantam
      polygonSeries.include = ["IN-DL"];
      chart.events.on("ready", loadStores);
      //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      this.geodata = chart.series.push(new am4maps.MapImageSeries());
      // let imageSeriesTemplate = imageSeries.mapImages.template;
      let imageSeriesTemplate = this.geodata.mapImages.template;
      let circle = imageSeriesTemplate.createChild(Circle);
      circle.radius = 5;
      // circle.fill = color("#B27799");
      circle.fill = color("#ed3833");
      circle.stroke = color("#FFFFFF");
      circle.strokeWidth = 2;
      circle.nonScaling = true;
      circle.tooltipText = "{constituency}";
      imageSeriesTemplate.propertyFields.latitude = "latitude";
      imageSeriesTemplate.propertyFields.longitude = "longitude";

      imageSeriesTemplate.tooltipText = "{constituency}: {count}";

      function loadStores() {
        let loader = new DataSource();
        loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
        loader.events.on("parseended", (ev: any) => {
          setupStores(ev.target.data);
        });
        loader.load();
      }

      // Creates a series
      function createSeries(heatfield) {
        let series = chart.series.push(new am4maps.MapImageSeries());
        series.dataFields.value = heatfield;

        let template = series.mapImages.template;
        template.verticalCenter = "middle";
        template.horizontalCenter = "middle";
        template.propertyFields.latitude = "lat";
        template.propertyFields.longitude = "long";
        template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
        // template.dataItem

        let circle = template.createChild(Circle);
        circle.radius = 10;
        circle.fillOpacity = 0.7;
        circle.verticalCenter = "middle";
        circle.horizontalCenter = "middle";
        circle.nonScaling = true;

        let label = template.createChild(Label);
        label.text = "{stores}";
        label.fill = color("#fff");
        label.verticalCenter = "middle";
        label.horizontalCenter = "middle";
        label.nonScaling = true;

        let heat = series.heatRules.push({
          target: circle,
          property: "radius",
          min: 10,
          max: 30
        });

        // Set up drill-down
        series.mapImages.template.events.on("hit", (ev: any) => {

          // Determine what we've clicked on
          let data = ev.target.dataItem.dataContext;

          // No id? Individual store - nothing to drill down to further
          if (!data.target) {
            return;
          }

          // Create actual series if it hasn't been yet created
          if (!regionalSeries[data.target].series) {
            regionalSeries[data.target].series = createSeries("count");
            regionalSeries[data.target].series.data = data.markerData;
          }

          // Hide current series
          if (currentSeries) {
            currentSeries.hide();
          }

          // Control zoom
          if (data.type == "state") {
            let statePolygon = polygonSeries.getPolygonById("IN-DL");
            chart.zoomToMapObject(statePolygon);
          } else if (data.type == "city") {
            chart.zoomToGeoPoint({
              latitude: data.lat,
              longitude: data.long
            }, 64, true);
          }
          zoomOut.show();

          // Show new targert series
          currentSeries = regionalSeries[data.target].series;
          currentSeries.show();
        });
        // console.log("series",series)
        return series;
      }

      let regionalSeries: any = {};
      let currentSeries;

      function setupStores(data) {
        // console.log("data 1 ",data)
        // console.log("regionalSeries ",regionalSeries)

        // Init country-level series
        regionalSeries.IN = {
          markerData: [],
          series: createSeries("stores")
        };

        // Set current series
        currentSeries = regionalSeries.IN.series;
        // console.log("currentSeries ",currentSeries)

        // Process data
        array.each(data.query_results, (data: any) => {

          //  console.log("data 2 ",data)
          // Get store data
          let store = {
            state: data.MAIL_ST_PROV_C,
            long: type.toNumber(data.LNGTD_I),
            lat: type.toNumber(data.LATTD_I),
            location: data.co_loc_n,
            city: data.mail_city_n,
            count: type.toNumber(data.count)
          };

          // Process state-level data
          if (regionalSeries[store.state] == undefined) {
            let statePolygonForGeo: any = polygonSeries.getPolygonById("IN-" + store.state);
            if (statePolygonForGeo) {
              // console.log("statePolygonForGeo", statePolygonForGeo)
              // Add state data
              regionalSeries[store.state] = {
                target: store.state,
                type: "state",
                name: statePolygonForGeo.dataItem.dataContext.name,
                count: store.count,
                stores: 1,
                lat: statePolygonForGeo.visualLatitude,
                long: statePolygonForGeo.visualLongitude,
                state: store.state,
                markerData: []
              };
              regionalSeries.IN.markerData.push(regionalSeries[store.state]);

            } else {
              // State not found
              return;
            }
          } else {

            regionalSeries[store.state].stores++;
            regionalSeries[store.state].count += store.count;
            // console.log("regionalSeries[store.state].stores ",regionalSeries[store.state].stores)

          }

          // Process city-level data
          if (regionalSeries[store.city] == undefined) {
            regionalSeries[store.city] = {
              target: store.city,
              type: "city",
              name: store.city,
              count: store.count,
              stores: 1,
              lat: store.lat,
              long: store.long,
              state: store.state,
              markerData: []
            };
            regionalSeries[store.state].markerData.push(regionalSeries[store.city]);
          } else {
            regionalSeries[store.city].stores++;
            regionalSeries[store.city].count += store.count;
            // console.log("regionalSeries[store.city].stores ",regionalSeries[store.city].stores)

          }

          // Process individual store
          regionalSeries[store.city].markerData.push({
            name: store.location,
            count: store.count,
            stores: 1,
            lat: store.lat,
            long: store.long,
            state: store.state
          });

        });

        regionalSeries.IN.series.data = regionalSeries.IN.markerData;
        // console.log("regionalSeries.IN.series.data",regionalSeries.IN.series.data)

      }

      // Chart for geo district
      //Graph Geo Map District
      // Create map instance
     let chartGeo = create("geoMap1", am4maps.MapChart);
      chartGeo.logo.disabled = true;
      chartGeo.maxZoomLevel = 64;

      chartGeo.geodata = this.geodatajson;


      this.geodatajson.features.map(el => {
        if (el.geometry.type == "Polygon") {
          return el.geometry.coordinates.forEach(d => {
            d.reverse();
          });
        }
      });

      // Set projection
      chartGeo.projection = new am4maps.projections.Miller();

      // Create map polygon series
      let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
      polygonSeries1.useGeodata = true;

      let mapgradient = new RadialGradient();
      mapgradient.addColor(color("#192eac"), 0.05);
      mapgradient.addColor(color("#192eac"), 0.1);
      mapgradient.addColor(color("#192eac"), 0.2);
      mapgradient.addColor(color("#192eac"), 0.3);
      mapgradient.addColor(color('#192eac'), 0.5);



      // linecolor: color("#1f39d1"),
      // dotcolor: color("#2d4bfc"),
      // gradient: createGradient(color('#192eac'))

      // Configure series
      var polygonTemplate1 = polygonSeries1.mapPolygons.template;
      polygonTemplate1.tooltipText = "{geocoding.name}";
      polygonTemplate1.strokeWidth = 0.6;
      polygonTemplate1.stroke = color("#1f39d1");
      polygonTemplate1.fill = mapgradient;

      let shadow = polygonTemplate1.background.filters.push(new DropShadowFilter());
      shadow.dx = 10;
      shadow.dy = 10;
      shadow.blur = 5;
      shadow.color = color("#fff");

      // Create hover state and set alternative fill color
      // var hs = polygonTemplate1.states.create("hover");
      // hs.properties.fill = color("#8067dc");

      //polling station points
      this.pbPoints = chartGeo.series.push(new am4maps.MapImageSeries());
      let imageSeriesTemplate1 = this.pbPoints.mapImages.template;
      let circle1 = imageSeriesTemplate1.createChild(Circle);
      circle1.radius = 4;
      circle1.fill = color("#2d4bfc");
      // circle1.fill = color("#ff0000");


      circle1.stroke = color("#000");
      circle1.strokeWidth = 0.5;
      circle1.nonScaling = true;
      circle1.tooltip = new Tooltip();
      circle1.tooltipText = "{boothName} : {boothNumber} : {count}";
      circle1.tooltip.label.background.fill = color("#181d2a");
      circle1.tooltip.label.fontSize = 12;
      circle1.tooltip.label.fontWeight = "lighter";
      circle1.tooltip.background.strokeWidth = 0;
      circle1.tooltip.strokeWidth = 0;


      circle1.cursorOverStyle = MouseCursorStyle.pointer;

      imageSeriesTemplate1.events.on("hit", (ev) => {

        this.psData = ev.target.dataItem.dataContext;

        console.log("psdata",this.psData);

        if (this.psData) {

          let pshtml = '<div class="psno">PB No. <b>' + this.psData['boothNumber'] + '</b></div>'
            + '<div class="psloc">' + this.psData['boothName'] + '</div>'
            + '<div class="psaddr">' + this.psData['count'] + ' Visitor(s)</div>';

          $("#psData").html(pshtml);

        }

      });

      // console.log("charditi",this.pbPoints.data);

      // imageSeriesTemplate1.propertyFields.latitude = "Latitude";
      // imageSeriesTemplate1.propertyFields.longitude = "Longitude";

      // imageSeriesTemplate1.tooltipText = "{district}: {count}";
      // circle1.tooltipText = "{constituency}";
      // imageSeriesTemplate1.dataItem.dataContext =  40;
      imageSeriesTemplate1.propertyFields.latitude = "latitude";
      imageSeriesTemplate1.propertyFields.longitude = "longitude";


      // imageSeriesTemplate1.tooltipText = "{constituency}: {count}";


      // Add zoom control
      // chartGeo.zoomControl = new am4maps.ZoomControl();
      // chartGeo.zoomControl.height = 100;

      var home = chartGeo.chartContainer.createChild(Button);
      home.label.text = "RESET";
      home.valign = "bottom";
      home.align = "right";
      //  home.height =  25;
      //  home.width = 200;
      home.background.fill = color("#3c3f4a");
      home.background.strokeWidth = 0;
      home.strokeWidth = 0.5;
      home.padding(5, 6, 5, 6);
      home.fontSize = 11;
      home.label.stroke = color("#fff");
      home.label.fontWeight = "lighter";
      home.events.on("hit", function (ev) {
        chartGeo.goHome();
      });

      chartGeo.events.on("zoomlevelchanged", resetbutton);

      function resetbutton() {

        if (chartGeo.zoomLevel > 1.3) {
          home.show();
        } else {
          home.hide();
        }

      }


      // chartGeo.geodataSource.url = "./graphs/states-map/geojson.json";
      // chartGeo.geodata = am4geodata_worldLow;

      // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]

      // Set projection
      // chartGeo.projection = new am4maps.projections.Projection();

      // // Add button
      // let zoomOut1 = chartGeo.tooltipContainer.createChild(ZoomOutButton);
      // zoomOut1.align = "right";
      // zoomOut1.valign = "top";
      // zoomOut1.margin(20, 20, 20, 20);
      // zoomOut1.events.on("hit", function () {
      //   if (currentSeries1) {
      //     currentSeries1.hide();
      //   }
      //   chartGeo.goHome();
      //   zoomOut1.hide();
      //   currentSeries1 = regionalSeries1.IN.series;
      //   currentSeries1.show();
      // });
      // zoomOut1.hide();

      //   // Create map polygon series
      //   let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
      //   polygonSeries1.useGeodata = true;
      //   polygonSeries1.calculateVisualCenter = true;

      //   // Configure series
      //   let polygonTemplate1 = polygonSeries1.mapPolygons.template;
      //   polygonTemplate1.tooltipText = "{district}";
      //   polygonTemplate1.fill = chartGeo.colors.getIndex(0);
      //   //shantam

      // let dd =  this.geodatajson;

      // for(var i = 0; i < dd.features.length; i++) {
      //   var feature = dd.features[i];
      //   for(var x = 0; x < feature.geometry.coordinates.length; x++) {
      //     if (feature.geometry.type == "MultiPolygon") {


      //       feature.geometry.coordinates.forEach(element => {
      //         // element[x][y].reverse();
      //         });
      //     }
      //     else {
      //       feature.geometry.coordinates.forEach(e=>{
      //         e.reverse();
      //       });
      //     }
      //   }
      // }


      // polygonSeries1.geodata = dd;
      // chartGeo.events.on("ready", loadStores1);
      //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      // this.geodata1 = chartGeo.series.push(new am4maps.MapImageSeries());
      // // let imageSeriesTemplate = imageSeries.mapImages.template;
      // let imageSeriesTemplate1 = this.geodata1.mapImages.template;
      // let circle1 = imageSeriesTemplate1.createChild(Circle);
      // circle1.radius = 5;
      // // circle1.fill = color("#B27799");
      //  circle1.fill = color("#ed3833");
      //  circle1.stroke = color("#FFFFFF");
      //  circle1.strokeWidth = 2;
      // circle1.nonScaling = true;
      // circle1.tooltipText = "{district}";
      // imageSeriesTemplate1.propertyFields.latitude = "Latitude";
      // imageSeriesTemplate1.propertyFields.longitude = "Longitude";

      // imageSeriesTemplate1.tooltipText = "{district}: {count}";
      // circle1.tooltipText = "{constituency}";
      // imageSeriesTemplate1.propertyFields.latitude = "latitude";
      // imageSeriesTemplate1.propertyFields.longitude = "longitude";

      // imageSeriesTemplate1.tooltipText = "{constituency}: {count}";


      // function loadStores1() {
      //   let loader = new DataSource();
      //   loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
      //   loader.events.on("parseended", (ev: any) => {
      //     setupStores1(ev.target.data);
      //   });
      //   loader.load();
      // }

      // Creates a series
      // function createSeries1(heatfield) {
      //   let series = chartGeo.series.push(new am4maps.MapImageSeries());
      //   series.dataFields.value = heatfield;

      //   let template = series.mapImages.template;
      //   template.verticalCenter = "middle";
      //   template.horizontalCenter = "middle";
      //   template.propertyFields.latitude = "lat";
      //   template.propertyFields.longitude = "long";
      //   template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
      //   // template.dataItem

      //   let circle = template.createChild(Circle);
      //   circle.radius = 10;
      //   circle.fillOpacity = 0.7;
      //   circle.verticalCenter = "middle";
      //   circle.horizontalCenter = "middle";
      //   circle.nonScaling = true;

      //   let label = template.createChild(Label);
      //   label.text = "{stores}";
      //   label.fill = color("#fff");
      //   label.verticalCenter = "middle";
      //   label.horizontalCenter = "middle";
      //   label.nonScaling = true;

      //   let heat = series.heatRules.push({
      //     target: circle,
      //     property: "radius",
      //     min: 10,
      //     max: 30
      //   });

      //   // Set up drill-down
      //   series.mapImages.template.events.on("hit", (ev: any) => {

      //     // Determine what we've clicked on
      //     let data = ev.target.dataItem.dataContext;

      //     // No id? Individual store - nothing to drill down to further
      //     if (!data.target) {
      //       return;
      //     }

      //     // Create actual series if it hasn't been yet created
      //     if (!regionalSeries1[data.target].series) {
      //       regionalSeries1[data.target].series = createSeries1("count");
      //       regionalSeries1[data.target].series.data = data.markerData;
      //     }

      //     // Hide current series
      //     if (currentSeries1) {
      //       currentSeries1.hide();
      //     }

      //     // Control zoom
      //     if (data.type == "state") {
      //       let statePolygon = polygonSeries1.getPolygonById("IN-PB");
      //       chartGeo.zoomToMapObject(statePolygon);
      //     } else if (data.type == "city") {
      //       chartGeo.zoomToGeoPoint({
      //         latitude: data.lat,
      //         longitude: data.long
      //       }, 64, true);
      //     }
      //     zoomOut1.show();

      //     // Show new targert series
      //     currentSeries1 = regionalSeries1[data.target].series;
      //     currentSeries1.show();
      //   });

      //   return series;
      // }

      // let regionalSeries1: any = {};
      // let currentSeries1;

      // function setupStores1(data) {

      //   // Init country-level series
      //   regionalSeries1.IN = {
      //     markerData: [],
      //     series: createSeries1("stores")
      //   };

      //   // Set current series
      //   currentSeries1 = regionalSeries1.IN.series;

      //   // Process data
      //   array.each(data.query_results, (data: any) => {


      //     // Get store data
      //     let store = {
      //       state: data.MAIL_ST_PROV_C,
      //       long: type.toNumber(data.LNGTD_I),
      //       lat: type.toNumber(data.LATTD_I),
      //       location: data.co_loc_n,
      //       city: data.mail_city_n,
      //       count: 1000 + type.toNumber(data.count)
      //     };

      //     // Process state-level data
      //     if (regionalSeries1[store.state] == undefined) {
      //       let statePolygonForGeo: any = polygonSeries1.getPolygonById("IN-" + store.state);
      //       if (statePolygonForGeo) {
      //         // console.log("statePolygonForGeo",statePolygonForGeo)
      //         // Add state data
      //         regionalSeries1[store.state] = {
      //           target: store.state,
      //           type: "state",
      //           name: statePolygonForGeo.dataItem.dataContext.name,
      //           count: 1000 + store.count,
      //           stores: 1,
      //           lat: statePolygonForGeo.visualLatitude,
      //           long: statePolygonForGeo.visualLongitude,
      //           state: store.state,
      //           markerData: []
      //         };
      //         regionalSeries1.IN.markerData.push(regionalSeries1[store.state]);

      //       } else {
      //         // State not found
      //         return;
      //       }
      //     } else {
      //       regionalSeries1[store.state].stores++;
      //       regionalSeries1[store.state].count += store.count;
      //     }

      //     // Process city-level data
      //     if (regionalSeries1[store.city] == undefined) {
      //       regionalSeries1[store.city] = {
      //         target: store.city,
      //         type: "city",
      //         name: store.city,
      //         count: 1000 + store.count,
      //         stores: 1,
      //         lat: store.lat,
      //         long: store.long,
      //         state: store.state,
      //         markerData: []
      //       };
      //       regionalSeries1[store.state].markerData.push(regionalSeries1[store.city]);
      //     } else {
      //       regionalSeries1[store.city].stores++;
      //       regionalSeries1[store.city].count += store.count;
      //     }

      //     // Process individual store
      //     regionalSeries1[store.city].markerData.push({
      //       name: store.location,
      //       count: 1000 + store.count,
      //       stores: 1,
      //       lat: store.lat,
      //       long: store.long,
      //       state: store.state
      //     });

      //   });

      //   regionalSeries1.IN.series.data = regionalSeries1.IN.markerData;
      // }


      // // Create chart instance
      // let chartanoth = create("anoth", am4charts.RadarChart);
      // chartanoth.scrollbarX = new Scrollbar();

      // let data = [];

      // for(var i = 0; i < 20; i++){
      //   data.push({category: i, value:Math.round(Math.random() * 100)});
      // }

      // chartanoth.data = data;
      // chartanoth.radius = percent(100);
      // chartanoth.innerRadius = percent(50);

      // // Create axes
      // let categoryAxis0 = chartanoth.xAxes.push(new am4charts.CategoryAxis());
      // categoryAxis0.dataFields.category = "category";
      // categoryAxis0.renderer.grid.template.location = 0;
      // categoryAxis0.renderer.minGridDistance = 30;
      // categoryAxis0.tooltip.disabled = true;
      // categoryAxis0.renderer.minHeight = 110;
      // categoryAxis0.renderer.grid.template.disabled = true;
      // //categoryAxis.renderer.labels.template.disabled = true;
      // let labelTemplate = categoryAxis0.renderer.labels.template;
      // labelTemplate.radius = percent(-60);
      // labelTemplate.location = 0.5;
      // labelTemplate.relativeRotation = 90;

      // let valueAxis0 = chartanoth.yAxes.push(new am4charts.ValueAxis());
      // valueAxis0.renderer.grid.template.disabled = true;
      // valueAxis0.renderer.labels.template.disabled = true;
      // valueAxis0.tooltip.disabled = true;

      // // Create series
      // let series0 = chart.series.push(new am4charts.RadarColumnSeries());
      // series0.sequencedInterpolation = true;
      // series0.dataFields.valueY = "value";
      // series0.dataFields.categoryX = "category";
      // series0.columns.template.strokeWidth = 0;
      // series0.tooltipText = "{valueY}";
      // series0.columns.template.radarColumn.cornerRadius = 10;
      // series0.columns.template.radarColumn.innerCornerRadius = 0;

      // series0.tooltip.pointerOrientation = "vertical";

      // // on hover, make corner radiuses bigger
      // let hoverState = series0.columns.template.radarColumn.states.create("hover");
      // hoverState.properties.cornerRadius = 0;
      // hoverState.properties.fillOpacity = 1;


      // series0.columns.template.adapter.add("fill", function(fill, target) {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      // // Cursor
      // chartanoth.cursor = new am4charts.RadarCursor();
      // chartanoth.cursor.innerRadius = percent(50);
      // chartanoth.cursor.lineY.disabled = true;








      let data1 = [{
        "year": "1989",
        "value": 0.140
      }, {
        "year": "1990",
        "value": 0.200
      }, {
        "year": "1991",
        "value": 0.220
      }, {
        "year": "1992",
        "value": 0.150
      }, {
        "year": "1993",
        "value": 0.145
      }, {
        "year": "1994",
        "value": 0.172
      }, {
        "year": "1995",
        "value": 0.239
      }, {
        "year": "1996",
        "value": 0.230
      }, {
        "year": "1997",
        "value": 0.253
      }, {
        "year": "1998",
        "value": 0.348,
        "disabled": false
      }];


      let data2 = [{
        "year": "1989",
        "value": 0.030
      }, {
        "year": "1990",
        "value": 0.255
      }, {
        "year": "1991",
        "value": 0.21
      }, {
        "year": "1992",
        "value": 0.065
      }, {
        "year": "1993",
        "value": 0.11
      }, {
        "year": "1994",
        "value": 0.172
      }, {
        "year": "1995",
        "value": 0.269
      }, {
        "year": "1996",
        "value": 0.141
      }, {
        "year": "1997",
        "value": 0.353
      }, {
        "year": "1998",
        "value": 0.548,
        "disabled": false
      }];


      let data3 = [{
        "year": "1989",
        "value": 0.530
      }, {
        "year": "1990",
        "value": 0.455
      }, {
        "year": "1991",
        "value": 0.21
      }, {
        "year": "1992",
        "value": 0.065
      }, {
        "year": "1993",
        "value": 0.11
      }, {
        "year": "1994",
        "value": 0.172
      }, {
        "year": "1995",
        "value": 0.200
      }, {
        "year": "1996",
        "value": 0.141
      }, {
        "year": "1997",
        "value": 0.153
      }, {
        "year": "1998",
        "value": 0.008,
        "disabled": false
      }];


      let data4 = [{
        "year": "1989",
        "value": 0.030
      }, {
        "year": "1990",
        "value": 0.255
      }, {
        "year": "1991",
        "value": 0.21
      }, {
        "year": "1992",
        "value": 0.205
      }, {
        "year": "1993",
        "value": 0.11
      }, {
        "year": "1994",
        "value": 0.270
      }, {
        "year": "1995",
        "value": 0.169
      }, {
        "year": "1996",
        "value": 0.300
      }, {
        "year": "1997",
        "value": 0.353
      }, {
        "year": "1998",
        "value": 0.548,
        "disabled": false
      }];


      let createGradient = (color) => {

        let gradient = new LinearGradient();
        gradient.addColor(color, 0.6);
        gradient.addColor(color, 0.3);
        gradient.addColor(color, 0.1);
        gradient.addColor(color, 0);
        gradient.rotation = 90;

        return gradient;

      }


      var themes = [
        {
          linecolor: color("#1f39d1"),
          dotcolor: color("#2d4bfc"),
          gradient: createGradient(color('#192eac'))
        },
        {
          linecolor: color("#6ac2ea"),
          dotcolor: color("#9ce0ff"),
          gradient: createGradient(color('#67b7dc'))
        },
        {
          linecolor: color("#8c72ef"),
          dotcolor: color("#a992ff"),
          gradient: createGradient(color('#8067dc'))
        },
        {
          linecolor: color("#f16ee2"),
          dotcolor: color("#ff85f1"),
          gradient: createGradient(color('#dc67ce'))
        }
      ];




      function createKPI(div, kpiData, theme) {

        // Create chart instance
        var kpichart1 = create(div, am4charts.XYChart);

        kpichart1.logo.disabled = true;


        // Add data
        kpichart1.data = kpiData;
        // Create axes
        let dateAxis1 = kpichart1.xAxes.push(new am4charts.DateAxis());
        dateAxis1.renderer.minGridDistance = 50;
        dateAxis1.renderer.grid.template.location = 0.5;
        dateAxis1.baseInterval = {
          count: 1,
          timeUnit: "year"
        }

        dateAxis1.renderer.grid.template.strokeWidth = 0;

        let kpivalueAxis = kpichart1.yAxes.push(new am4charts.ValueAxis());

        kpivalueAxis.renderer.grid.template.strokeWidth = 0;

        kpivalueAxis.logarithmic = true;

        dateAxis1.renderer.labels.template.disabled = true;
        kpivalueAxis.renderer.labels.template.disabled = true;

        // Create series
        let kpiseries = kpichart1.series.push(new am4charts.LineSeries());
        kpiseries.dataFields.valueY = "value";
        kpiseries.dataFields.dateX = "year";
        kpiseries.strokeWidth = 2;
        kpiseries.connect = true;
        kpiseries.tensionX = 0.8;
        kpiseries.fillOpacity = 1;


        kpiseries.fill = theme.gradient;


        let bullet = kpiseries.bullets.push(new am4charts.CircleBullet());
        // bullet.stroke =  InterfaceColorSet().getFor("background");
        bullet.disabled = true;
        bullet.propertyFields.disabled = "disabled";

        bullet.strokeWidth = 4;
        bullet.tooltipText = "{valueY}";
        bullet.circle.radius = 2;
        bullet.circle.stroke = theme.dotcolor;

        bullet.adapter.add("fill", function (fill, target) {

          return fill;
        })

        let range = kpivalueAxis.createSeriesRange(kpiseries);
        range.value = 0;
        range.endValue = 100;
        range.contents.stroke = theme.linecolor;
        range.contents.fill = theme.gradient;
        range.contents.fillOpacity = 1;



      }



      createKPI("kpi-total", data1, themes[0]);
      createKPI("kpi-today", data2, themes[1]);
      createKPI("kpi-week", data3, themes[2]);
      createKPI("kpi-month", data4, themes[3]);






      // let chartRH = create("anoth", am4charts.RadarChart);
      // // chartRH.scrollbarX = new Scrollbar();

      // let data = [];

      // for (var i = 0; i < 15; i++) {
      //   data.push({ category: i, value: Math.round(Math.random() * 100) });
      // }

      // chartRH.data = data;
      // chartRH.radius = percent(100);
      // chartRH.innerRadius = percent(25);

      // let categoryAxisH = chartRH.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      // categoryAxisH.dataFields.category = "category";
      // categoryAxisH.renderer.grid.template.location = 0;

      // categoryAxisH.tooltip.disabled = true;
      // // categoryAxisH.renderer.minHeight = 110;
      // categoryAxisH.renderer.grid.template.disabled = true;



      // categoryAxisH.renderer.minGridDistance = 60;
      // categoryAxisH.renderer.inversed = true;
      // categoryAxisH.renderer.labels.template.location = 40;
      // categoryAxisH.renderer.grid.template.strokeOpacity = 0.08;


      // //categoryAxis.renderer.labels.template.disabled = true;
      // let labelTemplate = categoryAxisH.renderer.labels.template;
      // labelTemplate.radius = percent(-25);
      // labelTemplate.location = 0.5;
      // // labelTemplate.relativeRotation = 90;
      // labelTemplate.stroke = color("#fff");

      // let valueAxisH = chartRH.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());
      // valueAxisH.renderer.grid.template.disabled = true;
      // valueAxisH.renderer.labels.template.disabled = true;
      // valueAxisH.tooltip.disabled = true;


      // valueAxisH.min = 0;
      // valueAxisH.extraMax = 0.1;
      // valueAxisH.renderer.grid.template.strokeOpacity = 0.08;

      // chartRH.seriesContainer.zIndex = -10;


      // // Create series
      // let seriesH = chartRH.series.push(new am4charts.RadarColumnSeries());
      // // seriesH.sequencedInterpolation = true;
      // seriesH.dataFields.valueY = "value";
      // seriesH.dataFields.categoryX = "category";
      // seriesH.columns.template.strokeWidth = 0;
      // seriesH.columns.template.stroke = color("#fff");
      // seriesH.tooltipText = "{valueY}";
      // seriesH.columns.template.radarColumn.cornerRadius = 10;
      // seriesH.columns.template.radarColumn.innerCornerRadius = 0;

      // seriesH.tooltip.pointerOrientation = "vertical";
      // seriesH.columns.template.strokeOpacity = 0;





      // // on hover, make corner radiuses bigger
      // let hoverState = seriesH.columns.template.radarColumn.states.create("hover");
      // hoverState.properties.cornerRadius = 0;
      // hoverState.properties.fillOpacity = 1;


      // seriesH.columns.template.adapter.add("fill", function (fill, target) {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      // // Cursor
      // chartRH.cursor = new am4charts.RadarCursor();
      // chartRH.cursor.innerRadius = percent(50);
      // chartRH.cursor.lineY.disabled = true;







      let chartRH = create("anoth", am4charts.RadarChart);

      chartRH.data = [{
        "country": "USA",
        "visits": 2025
      }, {
        "country": "China",
        "visits": 1882
      }, {
        "country": "Japan",
        "visits": 1809
      }, {
        "country": "Germany",
        "visits": 1322
      }, {
        "country": "UK",
        "visits": 1122
      }, {
        "country": "France",
        "visits": 1114
      }, {
        "country": "India",
        "visits": 984
      }, {
        "country": "Spain",
        "visits": 711
      }, {
        "country": "Netherlands",
        "visits": 665
      }, {
        "country": "Russia",
        "visits": 580
      }, {
        "country": "South Korea",
        "visits": 443
      }, {
        "country": "Canada",
        "visits": 441
      }];

      chartRH.innerRadius = percent(40)

      let categoryAxisH = chartRH.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      categoryAxisH.renderer.grid.template.location = 0;
      categoryAxisH.dataFields.category = "country";
      categoryAxisH.renderer.minGridDistance = 60;
      categoryAxisH.renderer.inversed = true;
      categoryAxisH.renderer.labels.template.location = 0.5;
      categoryAxisH.renderer.grid.template.strokeOpacity = 0.08;
      categoryAxisH.renderer.grid.template.stroke = color("#fff");
      categoryAxisH.renderer.tooltip.disabled = true;


      let valueAxisH = chartRH.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());
      valueAxisH.min = 0;
      valueAxisH.extraMax = 0.1;
      valueAxisH.renderer.grid.template.strokeOpacity = 0.08;
      valueAxisH.renderer.grid.template.stroke = color("#fff");
      valueAxisH.renderer.labels.template.disabled = true;


      chartRH.seriesContainer.zIndex = -10;

      let labelTemplate = categoryAxisH.renderer.labels.template;

      labelTemplate.fill = color("#fff");
      labelTemplate.fontSize = 12;

      let seriesH = chartRH.series.push(new am4charts.RadarColumnSeries());
      seriesH.dataFields.categoryX = "country";
      seriesH.dataFields.valueY = "visits";
      seriesH.tooltipText = "{valueY.value}"
      seriesH.columns.template.strokeOpacity = 0;
      seriesH.columns.template.radarColumn.cornerRadius = 5;
      seriesH.columns.template.radarColumn.innerCornerRadius = 0;
      seriesH.columns.template.stroke = color("#fff");

      // chartRH.zoomOutButton.disabled = true;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      seriesH.columns.template.adapter.add("fill", (fill, target) => {
        return chart.colors.getIndex(target.dataItem.index);
      });

      categoryAxisH.sortBySeries = seriesH;

      chartRH.cursor = new am4charts.RadarCursor();
      // chartRH.cursor.behavior = "none";
      // chartRH.cursor.lineX.disabled = true;
      // chartRH.cursor.lineY.disabled = true;




      let heatchart = create("heatmap", am4charts.RadarChart);
      heatchart.innerRadius = percent(30);
      heatchart.fontSize = 11;

      let xAxis = heatchart.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      let yAxis = heatchart.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
      yAxis.renderer.minGridDistance = 5;

      xAxis.renderer.labels.template.location = 0.5;
      xAxis.renderer.labels.template.bent = true;
      xAxis.renderer.labels.template.radius = 5;
      xAxis.renderer.labels.template.fill = color("#fff");


      xAxis.dataFields.category = "hour";
      yAxis.dataFields.category = "weekday";

      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.minGridDistance = 10;

      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.inversed = true;

      // this makes the y axis labels to be bent. By default y Axis labels are regular AxisLabels, so we replace them with AxisLabelCircular
      // and call fixPosition for them to be bent
      let yAxisLabel = new am4charts.AxisLabelCircular();
      yAxisLabel.bent = true;
      yAxisLabel.events.on("validated", function (event) {
        event.target.fixPosition(-90, math.getDistance({ x: event.target.pixelX, y: event.target.pixelY }) - 5);
        event.target.dx = -event.target.pixelX;
        event.target.dy = -event.target.pixelY;
      })
      yAxis.renderer.labels.template = yAxisLabel;
      yAxis.renderer.labels.template.fill = color("#fff");

      let heatseries = heatchart.series.push(new am4charts.RadarColumnSeries());
      heatseries.dataFields.categoryX = "hour";
      heatseries.dataFields.categoryY = "weekday";
      heatseries.dataFields.value = "value";
      heatseries.sequencedInterpolation = true;

      let heatcolumnTemplate = heatseries.columns.template;
      heatcolumnTemplate.strokeWidth = 2;
      heatcolumnTemplate.strokeOpacity = 1;
      heatcolumnTemplate.stroke = color("#1c2233");
      heatcolumnTemplate.tooltipText = "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}";
      heatcolumnTemplate.width = percent(100);
      heatcolumnTemplate.height = percent(100);

      heatchart.seriesContainer.zIndex = -5;

      heatcolumnTemplate.hiddenState.properties.opacity = 0;

      // heat rule, this makes columns to change color depending on value
      // color: #011f5e;
      // color: #7fabff;
      heatseries.heatRules.push({ target: heatcolumnTemplate, property: "fill", min: color("#7fabff"), max: color("#011f5e") });

      // heat legend

      let heatLegend = heatchart.bottomAxesContainer.createChild(am4charts.HeatLegend);
      heatLegend.width = percent(100);
      heatLegend.series = heatseries;
      heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
      heatLegend.valueAxis.renderer.labels.template.fill = color("#fff");

      heatLegend.valueAxis.renderer.minGridDistance = 30;

      // heat legend behavior
      heatseries.columns.template.events.on("over", function (event) {
        handleHover(event.target);
      })

      heatseries.columns.template.events.on("hit", function (event) {
        handleHover(event.target);
      })

      function handleHover(column) {
        if (!isNaN(column.dataItem.value)) {
          heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
        }
        else {
          heatLegend.valueAxis.hideTooltip();
        }
      }

      heatseries.columns.template.events.on("out", function (event) {
        heatLegend.valueAxis.hideTooltip();
      })

      heatchart.data = [
        {
          "hour": "12pm",
          "weekday": "March",
          "value": 0
        },
        {
          "hour": "1am",
          "weekday": "March",
          "value": 2520
        },
        {
          "hour": "2am",
          "weekday": "March",
          "value": 2334
        },
        {
          "hour": "3am",
          "weekday": "March",
          "value": 2230
        },
        {
          "hour": "4am",
          "weekday": "March",
          "value": 2325
        },
        {
          "hour": "5am",
          "weekday": "March",
          "value": 2019
        },
        {
          "hour": "6am",
          "weekday": "March",
          "value": 2128
        },
        {
          "hour": "7am",
          "weekday": "March",
          "value": 2246
        },
        {
          "hour": "8am",
          "weekday": "March",
          "value": 2421
        },
        {
          "hour": "9am",
          "weekday": "March",
          "value": 2788
        },
        {
          "hour": "10am",
          "weekday": "March",
          "value": 2959
        },
        {
          "hour": "11am",
          "weekday": "March",
          "value": 3018
        },
        {
          "hour": "12am",
          "weekday": "March",
          "value": 3154
        },
        {
          "hour": "1pm",
          "weekday": "March",
          "value": 3172
        },
        {
          "hour": "2pm",
          "weekday": "March",
          "value": 3368
        },
        {
          "hour": "3pm",
          "weekday": "March",
          "value": 3464
        },
        {
          "hour": "4pm",
          "weekday": "March",
          "value": 3746
        },
        {
          "hour": "5pm",
          "weekday": "March",
          "value": 3656
        },
        {
          "hour": "6pm",
          "weekday": "March",
          "value": 3336
        },
        {
          "hour": "7pm",
          "weekday": "March",
          "value": 3292
        },
        {
          "hour": "8pm",
          "weekday": "March",
          "value": 3269
        },
        {
          "hour": "9pm",
          "weekday": "March",
          "value": 3300
        },
        {
          "hour": "10pm",
          "weekday": "March",
          "value": 3403
        },
        {
          "hour": "11pm",
          "weekday": "March",
          "value": 3323
        },
        {
          "hour": "12pm",
          "weekday": "April",
          "value": 3346
        },
        {
          "hour": "1am",
          "weekday": "April",
          "value": 2725
        },
        {
          "hour": "2am",
          "weekday": "April",
          "value": 3052
        },
        {
          "hour": "3am",
          "weekday": "April",
          "value": 3876
        },
        {
          "hour": "4am",
          "weekday": "April",
          "value": 4453
        },
        {
          "hour": "5am",
          "weekday": "April",
          "value": 3972
        },
        {
          "hour": "6am",
          "weekday": "April",
          "value": 4644
        },
        {
          "hour": "7am",
          "weekday": "April",
          "value": 5715
        },
        {
          "hour": "8am",
          "weekday": "April",
          "value": 7080
        },
        {
          "hour": "9am",
          "weekday": "April",
          "value": 8022
        },
        {
          "hour": "10am",
          "weekday": "April",
          "value": 8446
        },
        {
          "hour": "11am",
          "weekday": "April",
          "value": 9313
        },
        {
          "hour": "12am",
          "weekday": "April",
          "value": 9011
        },
        {
          "hour": "1pm",
          "weekday": "April",
          "value": 8508
        },
        {
          "hour": "2pm",
          "weekday": "April",
          "value": 8515
        },
        {
          "hour": "3pm",
          "weekday": "April",
          "value": 8399
        },
        {
          "hour": "4pm",
          "weekday": "April",
          "value": 8649
        },
        {
          "hour": "5pm",
          "weekday": "April",
          "value": 7869
        },
        {
          "hour": "6pm",
          "weekday": "April",
          "value": 6933
        },
        {
          "hour": "7pm",
          "weekday": "April",
          "value": 5969
        },
        {
          "hour": "8pm",
          "weekday": "April",
          "value": 5552
        },
        {
          "hour": "9pm",
          "weekday": "April",
          "value": 5434
        },
        {
          "hour": "10pm",
          "weekday": "April",
          "value": 5070
        },
        {
          "hour": "11pm",
          "weekday": "April",
          "value": 4851
        },
        {
          "hour": "12pm",
          "weekday": "May",
          "value": 4468
        },
        {
          "hour": "1am",
          "weekday": "May",
          "value": 3306
        },
        {
          "hour": "2am",
          "weekday": "May",
          "value": 3906
        },
        {
          "hour": "3am",
          "weekday": "May",
          "value": 4413
        },
        {
          "hour": "4am",
          "weekday": "May",
          "value": 4726
        },
        {
          "hour": "5am",
          "weekday": "May",
          "value": 4584
        },
        {
          "hour": "6am",
          "weekday": "May",
          "value": 5717
        },
        {
          "hour": "7am",
          "weekday": "May",
          "value": 6504
        },
        {
          "hour": "8am",
          "weekday": "May",
          "value": 8104
        },
        {
          "hour": "9am",
          "weekday": "May",
          "value": 8813
        },
        {
          "hour": "10am",
          "weekday": "May",
          "value": 9278
        },
        {
          "hour": "11am",
          "weekday": "May",
          "value": 10425
        },
        {
          "hour": "12am",
          "weekday": "May",
          "value": 10137
        },
        {
          "hour": "1pm",
          "weekday": "May",
          "value": 9290
        },
        {
          "hour": "2pm",
          "weekday": "May",
          "value": 9255
        },
        {
          "hour": "3pm",
          "weekday": "May",
          "value": 9614
        },
        {
          "hour": "4pm",
          "weekday": "May",
          "value": 9713
        },
        {
          "hour": "5pm",
          "weekday": "May",
          "value": 9667
        },
        {
          "hour": "6pm",
          "weekday": "May",
          "value": 8774
        },
        {
          "hour": "7pm",
          "weekday": "May",
          "value": 8649
        },
        {
          "hour": "8pm",
          "weekday": "May",
          "value": 9937
        },
        {
          "hour": "9pm",
          "weekday": "May",
          "value": 10286
        },
        {
          "hour": "10pm",
          "weekday": "May",
          "value": 9175
        },
        {
          "hour": "11pm",
          "weekday": "May",
          "value": 8581
        },
        {
          "hour": "12pm",
          "weekday": "June",
          "value": 8145
        },
        {
          "hour": "1am",
          "weekday": "June",
          "value": 7177
        },
        {
          "hour": "2am",
          "weekday": "June",
          "value": 5657
        },
        {
          "hour": "3am",
          "weekday": "June",
          "value": 6802
        },
        {
          "hour": "4am",
          "weekday": "June",
          "value": 8159
        },
        {
          "hour": "5am",
          "weekday": "June",
          "value": 8449
        },
        {
          "hour": "6am",
          "weekday": "June",
          "value": 9453
        },
        {
          "hour": "7am",
          "weekday": "June",
          "value": 9947
        },
        {
          "hour": "8am",
          "weekday": "June",
          "value": 11471
        },
        {
          "hour": "9am",
          "weekday": "June",
          "value": 12492
        },
        {
          "hour": "10am",
          "weekday": "June",
          "value": 9388
        },
        {
          "hour": "11am",
          "weekday": "June",
          "value": 9928
        },
        {
          "hour": "12am",
          "weekday": "June",
          "value": 9644
        },
        {
          "hour": "1pm",
          "weekday": "June",
          "value": 9034
        },
        {
          "hour": "2pm",
          "weekday": "June",
          "value": 8964
        },
        {
          "hour": "3pm",
          "weekday": "June",
          "value": 9069
        },
        {
          "hour": "4pm",
          "weekday": "June",
          "value": 8898
        },
        {
          "hour": "5pm",
          "weekday": "June",
          "value": 8322
        },
        {
          "hour": "6pm",
          "weekday": "June",
          "value": 6909
        },
        {
          "hour": "7pm",
          "weekday": "June",
          "value": 5810
        },
        {
          "hour": "8pm",
          "weekday": "June",
          "value": 5151
        },
        {
          "hour": "9pm",
          "weekday": "June",
          "value": 4911
        },
        {
          "hour": "10pm",
          "weekday": "June",
          "value": 4487
        },
        {
          "hour": "11pm",
          "weekday": "June",
          "value": 4118
        },
        {
          "hour": "12pm",
          "weekday": "July",
          "value": 3689
        },
        {
          "hour": "1am",
          "weekday": "July",
          "value": 3081
        },
        {
          "hour": "2am",
          "weekday": "July",
          "value": 6525
        },
        {
          "hour": "3am",
          "weekday": "July",
          "value": 6228
        },
        {
          "hour": "4am",
          "weekday": "July",
          "value": 6917
        },
        {
          "hour": "5am",
          "weekday": "July",
          "value": 6568
        },
        {
          "hour": "6am",
          "weekday": "July",
          "value": 6405
        },
        {
          "hour": "7am",
          "weekday": "July",
          "value": 8106
        },
        {
          "hour": "8am",
          "weekday": "July",
          "value": 8542
        },
        {
          "hour": "9am",
          "weekday": "July",
          "value": 8501
        },
        {
          "hour": "10am",
          "weekday": "July",
          "value": 8802
        },
        {
          "hour": "11am",
          "weekday": "July",
          "value": 9420
        },
        {
          "hour": "12am",
          "weekday": "July",
          "value": 8966
        },
        {
          "hour": "1pm",
          "weekday": "July",
          "value": 8135
        },
        {
          "hour": "2pm",
          "weekday": "July",
          "value": 8224
        },
        {
          "hour": "3pm",
          "weekday": "July",
          "value": 8387
        },
        {
          "hour": "4pm",
          "weekday": "July",
          "value": 8218
        },
        {
          "hour": "5pm",
          "weekday": "July",
          "value": 7641
        },
        {
          "hour": "6pm",
          "weekday": "July",
          "value": 6469
        },
        {
          "hour": "7pm",
          "weekday": "July",
          "value": 5441
        },
        {
          "hour": "8pm",
          "weekday": "July",
          "value": 4952
        },
        {
          "hour": "9pm",
          "weekday": "July",
          "value": 4643
        },
        {
          "hour": "10pm",
          "weekday": "July",
          "value": 4393
        },
        {
          "hour": "11pm",
          "weekday": "July",
          "value": 4017
        },
        {
          "hour": "12pm",
          "weekday": "August",
          "value": 4022
        },
        {
          "hour": "1am",
          "weekday": "August",
          "value": 3063
        },
        {
          "hour": "2am",
          "weekday": "August",
          "value": 3638
        },
        {
          "hour": "3am",
          "weekday": "August",
          "value": 3968
        },
        {
          "hour": "4am",
          "weekday": "August",
          "value": 4070
        },
        {
          "hour": "5am",
          "weekday": "August",
          "value": 4019
        },
        {
          "hour": "6am",
          "weekday": "August",
          "value": 4548
        },
        {
          "hour": "7am",
          "weekday": "August",
          "value": 5465
        },
        {
          "hour": "8am",
          "weekday": "August",
          "value": 6909
        },
        {
          "hour": "9am",
          "weekday": "August",
          "value": 7706
        },
        {
          "hour": "10am",
          "weekday": "August",
          "value": 7867
        },
        {
          "hour": "11am",
          "weekday": "August",
          "value": 8615
        },
        {
          "hour": "12am",
          "weekday": "August",
          "value": 8218
        },
        {
          "hour": "1pm",
          "weekday": "August",
          "value": 7604
        },
        {
          "hour": "2pm",
          "weekday": "August",
          "value": 7429
        },
        {
          "hour": "3pm",
          "weekday": "August",
          "value": 7488
        },
        {
          "hour": "4pm",
          "weekday": "August",
          "value": 7493
        },
        {
          "hour": "5pm",
          "weekday": "August",
          "value": 6998
        },
        {
          "hour": "6pm",
          "weekday": "August",
          "value": 5941
        },
        {
          "hour": "7pm",
          "weekday": "August",
          "value": 5068
        },
        {
          "hour": "8pm",
          "weekday": "August",
          "value": 4636
        },
        {
          "hour": "9pm",
          "weekday": "August",
          "value": 4241
        },
        {
          "hour": "10pm",
          "weekday": "August",
          "value": 3858
        },
        {
          "hour": "11pm",
          "weekday": "August",
          "value": 3833
        },
        {
          "hour": "12pm",
          "weekday": "September",
          "value": 3503
        },
        {
          "hour": "1am",
          "weekday": "September",
          "value": 2842
        },
        {
          "hour": "2am",
          "weekday": "September",
          "value": 2808
        },
        {
          "hour": "3am",
          "weekday": "September",
          "value": 2399
        },
        {
          "hour": "4am",
          "weekday": "September",
          "value": 2280
        },
        {
          "hour": "5am",
          "weekday": "September",
          "value": 2139
        },
        {
          "hour": "6am",
          "weekday": "September",
          "value": 2527
        },
        {
          "hour": "7am",
          "weekday": "September",
          "value": 2940
        },
        {
          "hour": "8am",
          "weekday": "September",
          "value": 3066
        },
        {
          "hour": "9am",
          "weekday": "September",
          "value": 3494
        },
        {
          "hour": "10am",
          "weekday": "September",
          "value": 3287
        },
        {
          "hour": "11am",
          "weekday": "September",
          "value": 3416
        },
        {
          "hour": "12am",
          "weekday": "September",
          "value": 3432
        },
        {
          "hour": "1pm",
          "weekday": "September",
          "value": 3523
        },
        {
          "hour": "2pm",
          "weekday": "September",
          "value": 3542
        },
        {
          "hour": "3pm",
          "weekday": "September",
          "value": 3347
        },
        {
          "hour": "4pm",
          "weekday": "September",
          "value": 3292
        },
        {
          "hour": "5pm",
          "weekday": "September",
          "value": 3416
        },
        {
          "hour": "6pm",
          "weekday": "September",
          "value": 3131
        },
        {
          "hour": "7pm",
          "weekday": "September",
          "value": 3057
        },
        {
          "hour": "8pm",
          "weekday": "September",
          "value": 3227
        },
        {
          "hour": "9pm",
          "weekday": "September",
          "value": 3060
        },
        {
          "hour": "10pm",
          "weekday": "September",
          "value": 2855
        },
        {
          "hour": "11pm",
          "weekday": "September",
          "value": 2625
        },
        {
          "hour": "12pm",
          "weekday": "October",
          "value": 3503
        },
        {
          "hour": "1am",
          "weekday": "October",
          "value": 2842
        },
        {
          "hour": "2am",
          "weekday": "October",
          "value": 2808
        },
        {
          "hour": "3am",
          "weekday": "October",
          "value": 2399
        },
        {
          "hour": "4am",
          "weekday": "October",
          "value": 2280
        },
        {
          "hour": "5am",
          "weekday": "October",
          "value": 2139
        },
        {
          "hour": "6am",
          "weekday": "October",
          "value": 2527
        },
        {
          "hour": "7am",
          "weekday": "October",
          "value": 2940
        },
        {
          "hour": "8am",
          "weekday": "October",
          "value": 3066
        },
        {
          "hour": "9am",
          "weekday": "October",
          "value": 3494
        },
        {
          "hour": "10am",
          "weekday": "October",
          "value": 3287
        },
        {
          "hour": "11am",
          "weekday": "October",
          "value": 3416
        },
        {
          "hour": "12am",
          "weekday": "October",
          "value": 3432
        },
        {
          "hour": "1pm",
          "weekday": "October",
          "value": 3523
        },
        {
          "hour": "2pm",
          "weekday": "October",
          "value": 3542
        },
        {
          "hour": "3pm",
          "weekday": "October",
          "value": 3347
        },
        {
          "hour": "4pm",
          "weekday": "October",
          "value": 3292
        },
        {
          "hour": "5pm",
          "weekday": "October",
          "value": 3416
        },
        {
          "hour": "6pm",
          "weekday": "October",
          "value": 3131
        },
        {
          "hour": "7pm",
          "weekday": "October",
          "value": 3057
        },
        {
          "hour": "8pm",
          "weekday": "October",
          "value": 3227
        },
        {
          "hour": "9pm",
          "weekday": "October",
          "value": 3060
        },
        {
          "hour": "10pm",
          "weekday": "October",
          "value": 2855
        },
        {
          "hour": "11pm",
          "weekday": "October",
          "value": 2625
        },
        {
          "hour": "12pm",
          "weekday": "November",
          "value": 3503
        },
        {
          "hour": "1am",
          "weekday": "November",
          "value": 2842
        },
        {
          "hour": "2am",
          "weekday": "November",
          "value": 2808
        },
        {
          "hour": "3am",
          "weekday": "November",
          "value": 2399
        },
        {
          "hour": "4am",
          "weekday": "November",
          "value": 2280
        },
        {
          "hour": "5am",
          "weekday": "November",
          "value": 2139
        },
        {
          "hour": "6am",
          "weekday": "November",
          "value": 2527
        },
        {
          "hour": "7am",
          "weekday": "November",
          "value": 2940
        },
        {
          "hour": "8am",
          "weekday": "November",
          "value": 3066
        },
        {
          "hour": "9am",
          "weekday": "November",
          "value": 3494
        },
        {
          "hour": "10am",
          "weekday": "November",
          "value": 3287
        },
        {
          "hour": "11am",
          "weekday": "November",
          "value": 3416
        },
        {
          "hour": "12am",
          "weekday": "November",
          "value": 3432
        },
        {
          "hour": "1pm",
          "weekday": "November",
          "value": 3523
        },
        {
          "hour": "2pm",
          "weekday": "November",
          "value": 3542
        },
        {
          "hour": "3pm",
          "weekday": "November",
          "value": 3347
        },
        {
          "hour": "4pm",
          "weekday": "November",
          "value": 3292
        },
        {
          "hour": "5pm",
          "weekday": "November",
          "value": 3416
        },
        {
          "hour": "6pm",
          "weekday": "November",
          "value": 3131
        },
        {
          "hour": "7pm",
          "weekday": "November",
          "value": 3057
        },
        {
          "hour": "8pm",
          "weekday": "November",
          "value": 3227
        },
        {
          "hour": "9pm",
          "weekday": "November",
          "value": 3060
        },
        {
          "hour": "10pm",
          "weekday": "November",
          "value": 2855
        },
        {
          "hour": "11pm",
          "weekday": "November",
          "value": 2625
        }

      ];







      // Create chart instance
      let streamchart = create("streamchart", am4charts.XYChart);

      // Add data
      streamchart.data = [
        { year: "1896", uk: 7, Connaught_Place: 0, okhla: 0, Nehru_Place: 20, New_Friends_Colony: 0 },
        { year: "1900", uk: 78, Connaught_Place: 0, okhla: 0, Nehru_Place: 55, New_Friends_Colony: 0 },
        { year: "1904", uk: 2, Connaught_Place: 0, okhla: 0, Nehru_Place: 394, New_Friends_Colony: 0 },
        { year: "1908", uk: 347, Connaught_Place: 0, okhla: 0, Nehru_Place: 63, New_Friends_Colony: 0 },
        { year: "1912", uk: 160, Connaught_Place: 0, okhla: 0, Nehru_Place: 101, New_Friends_Colony: 0 },
        { year: "1916", uk: 0, Connaught_Place: 0, okhla: 0, Nehru_Place: 0, New_Friends_Colony: 0 },
        { year: "1920", uk: 107, Connaught_Place: 0, okhla: 0, Nehru_Place: 193, New_Friends_Colony: 0 },
        { year: "1924", uk: 66, Connaught_Place: 0, okhla: 0, Nehru_Place: 198, New_Friends_Colony: 0 },
        { year: "1928", uk: 55, Connaught_Place: 0, okhla: 0, Nehru_Place: 84, New_Friends_Colony: 0 },
        { year: "1932", uk: 34, Connaught_Place: 0, okhla: 0, Nehru_Place: 181, New_Friends_Colony: 0 },
        { year: "1936", uk: 36, Connaught_Place: 0, okhla: 0, Nehru_Place: 92, New_Friends_Colony: 0 },
        { year: "1940", uk: 0, Connaught_Place: 0, okhla: 0, Nehru_Place: 0, New_Friends_Colony: 0 },
        { year: "1944", uk: 0, Connaught_Place: 0, okhla: 0, Nehru_Place: 0, New_Friends_Colony: 0 },
        { year: "1948", uk: 56, Connaught_Place: 0, okhla: 0, Nehru_Place: 148, New_Friends_Colony: 0 },
        { year: "1952", uk: 31, Connaught_Place: 117, okhla: 0, Nehru_Place: 130, New_Friends_Colony: 0 },
        { year: "1956", uk: 45, Connaught_Place: 169, okhla: 0, Nehru_Place: 118, New_Friends_Colony: 0 },
        { year: "1960", uk: 28, Connaught_Place: 169, okhla: 0, Nehru_Place: 112, New_Friends_Colony: 0 },
        { year: "1964", uk: 28, Connaught_Place: 174, okhla: 0, Nehru_Place: 150, New_Friends_Colony: 0 },
        { year: "1968", uk: 18, Connaught_Place: 188, okhla: 0, Nehru_Place: 149, New_Friends_Colony: 0 },
        { year: "1972", uk: 29, Connaught_Place: 211, okhla: 0, Nehru_Place: 155, New_Friends_Colony: 0 },
        { year: "1976", uk: 32, Connaught_Place: 285, okhla: 0, Nehru_Place: 155, New_Friends_Colony: 0 },
        { year: "1980", uk: 45, Connaught_Place: 442, okhla: 0, Nehru_Place: 0, New_Friends_Colony: 0 },
        { year: "1984", uk: 72, Connaught_Place: 0, okhla: 0, Nehru_Place: 333, New_Friends_Colony: 76 },
        { year: "1988", uk: 53, Connaught_Place: 294, okhla: 0, Nehru_Place: 193, New_Friends_Colony: 53 },
        { year: "1992", uk: 50, Connaught_Place: 0, okhla: 0, Nehru_Place: 224, New_Friends_Colony: 83 },
        { year: "1996", uk: 26, Connaught_Place: 0, okhla: 115, Nehru_Place: 260, New_Friends_Colony: 110 },
        { year: "2000", uk: 55, Connaught_Place: 0, okhla: 188, Nehru_Place: 248, New_Friends_Colony: 79 },
        { year: "2004", uk: 57, Connaught_Place: 0, okhla: 192, Nehru_Place: 264, New_Friends_Colony: 94 },
        { year: "2008", uk: 77, Connaught_Place: 0, okhla: 143, Nehru_Place: 315, New_Friends_Colony: 184 }
      ];

      // Create axes
      let categoryAxisStream = streamchart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxisStream.dataFields.category = "year";
      categoryAxisStream.renderer.grid.template.location = 0;
      categoryAxisStream.renderer.minGridDistance = 50;
      categoryAxisStream.renderer.labels.template.fill = color("#fff");
      categoryAxisStream.renderer.grid.template.stroke = color("#fff");
      categoryAxisStream.startLocation = 0.5;
      categoryAxisStream.endLocation = 0.5;

      let valueAxisstream = streamchart.yAxes.push(new am4charts.ValueAxis());

      valueAxisstream.renderer.labels.template.fill = color("#fff");
      valueAxisstream.renderer.grid.template.stroke = color("#fff");

      // Create series
      function createSeriesStream(field, name) {
        let series = streamchart.series.push(new am4charts.LineSeries());
        series.dummyData = {
          field: field
        }
        series.dataFields.valueY = field + "_hi";
        series.dataFields.openValueY = field + "_low";
        series.dataFields.categoryX = "year";
        series.name = name;
        series.tooltipText = "[font-size: 18]{name}[/]\n{categoryX}: [bold]{" + field + "}[/]";
        series.strokeWidth = 1;
        series.fillOpacity = 1;
        series.tensionX = 0.8;

        return series;
      }

      createSeriesStream("uk", "Kalindi Kunj");
      createSeriesStream("Connaught_Place", "Connaught Place");
      createSeriesStream("okhla", "Okhla");
      createSeriesStream("Nehru_Place", "Nehru Place");
      createSeriesStream("New_Friends_Colony", "New Friends Colony");

      // Legend
      streamchart.legend = new am4charts.Legend();
      streamchart.legend.itemContainers.template.togglable = false;
      streamchart.legend.itemContainers.template.cursorOverStyle = MouseCursorStyle.default;
      streamchart.legend.position = "right"
      streamchart.legend.reverseOrder = true;
      streamchart.legend.labels.template.fill = color("#fff");



      // Cursor
      streamchart.cursor = new am4charts.XYCursor();
      streamchart.cursor.maxTooltipDistance = 0;

      // Responsive
      streamchart.responsive.enabled = true;
      streamchart.responsive.useDefault = false;
      streamchart.responsive.rules.push({
        relevant: ResponsiveBreakpoints.widthL,
        state: function (target, stateId) {
          if (target instanceof am4charts.Legend) {
            let state = target.states.create(stateId);
            state.properties.position = "bottom";
            return state;
          }
          return null;
        }
      });

      // Prepare data for the river-stacked series
      streamchart.events.on("beforedatavalidated", updateData);
      function updateData() {

        let data = streamchart.data;
        if (data.length == 0) {
          return;
        }

        for (var i = 0; i < data.length; i++) {
          let row = data[i];
          let sum = 0;

          // Calculate open and close values
          streamchart.series.each(function (series) {
            let field = series.dummyData.field;
            let val = Number(row[field]);
            row[field + "_low"] = sum;
            row[field + "_hi"] = sum + val;
            sum += val;
          });

          // Adjust values so they are centered
          let offset = sum / 2;
          streamchart.series.each(function (series) {
            let field = series.dummyData.field;
            row[field + "_low"] -= offset;
            row[field + "_hi"] -= offset;
          });

        }

      }





      /* Create chart instance */
      let spiderchart = create("spiderchart", am4charts.RadarChart);

      let data = [];
      let value1 = 500;
      let value2 = 600;

      for (var i = 0; i < 12; i++) {
        let date = new Date();
        date.setMonth(i, 1);
        value1 -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
        value2 -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 50);
        data.push({ date: date, value1: value1, value2: value2 })
      }

      spiderchart.data = data;

      /* Create axes */
      let categoryAxisSpider = spiderchart.xAxes.push(new am4charts.DateAxis<any>());

      categoryAxisSpider.renderer.labels.template.fill = color("#fff");
      categoryAxisSpider.renderer.grid.template.stroke = color("#fff");

      let valueAxisSpider = spiderchart.yAxes.push(new am4charts.ValueAxis<any>());
      valueAxisSpider.extraMin = 0.2;
      valueAxisSpider.extraMax = 0.2;
      valueAxisSpider.tooltip.disabled = true;

      valueAxisSpider.renderer.labels.template.fill = color("#fff");
      valueAxisSpider.renderer.grid.template.stroke = color("#fff");

      /* Create and configure series */
      let series1 = spiderchart.series.push(new am4charts.RadarSeries());
      series1.dataFields.valueY = "value1";
      series1.dataFields.dateX = "date";
      // series1.yAxis = valueAxisSpider;
      // series.xAxis = categoryAxisSpider;
      series1.strokeWidth = 3;
      series1.tooltipText = "{valueY}";
      series1.name = "Series 1";
      series1.bullets.create(am4charts.CircleBullet);
      series1.dataItems.template.locations.dateX = 0.5;

      let series2 = spiderchart.series.push(new am4charts.RadarSeries());
      series2.dataFields.valueY = "value2";
      series2.dataFields.dateX = "date";
      // series2.yAxis = valueAxisSpider;
      // series2.xAxis = categoryAxisSpider;
      series2.strokeWidth = 3;
      series2.tooltipText = "{valueY}";
      series2.name = "Series 3";
      series2.bullets.create(am4charts.CircleBullet);
      series2.dataItems.template.locations.dateX = 0.5;

      // spiderchart.scrollbarX = new Scrollbar();
      // spiderchart.scrollbarY = new Scrollbar();

      spiderchart.cursor = new am4charts.RadarCursor();

      spiderchart.legend = new am4charts.Legend();

      spiderchart.legend.labels.template.fill = color("#fff");






      // Chart for PURPOSE
      this.purposeGraph = create("purpose", am4charts.PieChart);
      this.purposeGraph.logo.disabled = true;
      // Add data
      // this.purposeGraph.data = [];
      // Add and configure Series
      console.log("PGDATA_", this.purposeGraph.data);
      let pieSeries = this.purposeGraph.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "_id";
      pieSeries.innerRadius = percent(50);
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;


      this.purposeGraph.legend = new am4charts.Legend();
      this.purposeGraph.legend.position = "right";

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          this.purposeGraph.legend.labels.template.fill = color("#fff");
          this.purposeGraph.legend.valueLabels.template.fill = color(
            "#fff"
          );
        } else {
          this.purposeGraph.legend.labels.template.fill = color(
            "#2B2C2D"
          );
          this.purposeGraph.legend.valueLabels.template.fill = color(
            "#2B2C2D"
          );
        }
      });


      //live purpose chart

      this.livepurposeGraph = create("livepurpose", am4charts.XYChart);
      this.livepurposeGraph.padding(40, 40, 40, 40);

      this.livepurposeGraph.numberFormatter.bigNumberPrefixes = [
        { "number": 1e+3, "suffix": "K" },
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
      ];

      let label = this.livepurposeGraph.plotContainer.createChild(Label);
      label.x = percent(97);
      label.y = percent(95);
      label.horizontalCenter = "right";
      label.verticalCenter = "middle";
      label.dx = -15;
      label.fontSize = 50;

      let playButton = this.livepurposeGraph.plotContainer.createChild(PlayButton);
      playButton.x = percent(97);
      playButton.y = percent(95);
      playButton.dy = -2;
      playButton.verticalCenter = "middle";
      playButton.events.on("toggled", function (event) {
        if (event.target.isActive) {
          play();
        }
        else {
          stop();
        }
      })


      let stepDuration = 4000;

      let categoryAxis = this.livepurposeGraph.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "network";
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      var valuex = this.livepurposeGraph.xAxes.push(new am4charts.ValueAxis());
      valuex.min = 0;
      // valuex.rangeChangeEasing = ease.linear;
      // valuex.rangeChangeDuration = stepDuration;
      valuex.extraMax = 0.1;

      let series = this.livepurposeGraph.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "network";
      series.dataFields.valueX = "MAU";
      series.tooltipText = "{valueX.value}"
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.interpolationDuration = stepDuration;
      // series.interpolationEasing = ease.linear;

      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "right";
      labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
      labelBullet.label.textAlign = "end";
      labelBullet.label.dx = -10;

      this.livepurposeGraph.zoomOutButton.disabled = true;


      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          valuex.renderer.labels.template.fill = color("#fff");
          categoryAxis.renderer.labels.template.fill = color("#fff");
          valuex.title.fill = color("#fff");
          label.fill = color("#fff");
          categoryAxis.title.fill = color("#fff");
        } else {
          valuex.renderer.labels.template.fill = color("#2B2C2D");
          categoryAxis.renderer.labels.template.fill = color("#2B2C2D");
          valuex.title.fill = color("#2B2C2D");
          label.fill = color("#2B2C2D");
          categoryAxis.title.fill = color("#2B2C2D");
        }
      });


      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", (fill, target) => {
        return this.livepurposeGraph.colors.getIndex(target.dataItem.index);
      });

      this.liveyear = 2003;
      label.text = this.liveyear.toString();

      let interval;

      function play() {
        interval = setInterval(function () {
          nextYear();
        }, stepDuration)
        nextYear();
      }

      function stop() {
        if (interval) {
          clearInterval(interval);
        }
      }


      let nextYear = () => {
        this.liveyear++;

        if (this.liveyear > 2018) {
          this.liveyear = 2003;
        }

        let newData = this.allData[this.liveyear];
        let itemsWithNonZero = 0;
        for (var i = 0; i < this.livepurposeGraph.data.length; i++) {
          this.livepurposeGraph.data[i].MAU = newData[i].MAU;
          if (this.livepurposeGraph.data[i].MAU > 0) {
            itemsWithNonZero++;
          }
        }

        if (this.liveyear == 2003) {
          series.interpolationDuration = stepDuration / 4;
          valueAxis.rangeChangeDuration = stepDuration / 4;
        }
        else {
          series.interpolationDuration = stepDuration;
          valueAxis.rangeChangeDuration = stepDuration;
        }

        this.livepurposeGraph.invalidateRawData();
        label.text = this.liveyear.toString();

        categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
      }


      categoryAxis.sortBySeries = series;



      this.livepurposeGraph.data = JSON.parse(JSON.stringify(this.allData[this.liveyear]));
      console.log("LIVEDATA::", this.livepurposeGraph);


      categoryAxis.zoom({ start: 0, end: 1 / this.livepurposeGraph.data.length });

      series.events.on("inited", function () {
        setTimeout(function () {
          // playButton.isActive = true; // this starts interval
          console.log("new");
        }, 2000)
      })



      //endlive purpose chart


      //bubblecastchart

      let bubblechart = create("bubblechart", am4plugins_forceDirected.ForceDirectedTree);



      this.networkSeries = bubblechart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

    
    
      
      this.networkSeries.colors.list = [
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        color("#67b7dc"),
        color("#6794dc"),
        color("#6771dc"),
        color("#8067dc"),
        color("#a367dc"),
        color("#c767dc"),
        color("#dc67ce"),
        color("#dc67ab"),
        color("#4c3348"),
        // color("#c767dc"),

      ];

      this.networkSeries.dataFields.linkWith = "linkWith";
      this.networkSeries.dataFields.name = "_id";
      this.networkSeries.dataFields.id = "_id";
      this.networkSeries.dataFields.value = "count";
      this.networkSeries.dataFields.children = "children";
      this.networkSeries.links.template.distance = 1;
      this.networkSeries.nodes.template.tooltipText = "{id} {count}";
      this.networkSeries.nodes.template.fillOpacity = 1;
      this.networkSeries.nodes.template.outerCircle.scale = 1;
      this.networkSeries.strokeWidth = 0;
      this.networkSeries.nodes.template.strokeWidth = 0;

      this.networkSeries.nodes.template.outerCircle.disabled = true;

      this.networkSeries.nodes.template.outerCircle.strokeDasharray = "0";


      this.networkSeries.nodes.template.label.text = "{id}"
      this.networkSeries.fontSize = 11;
      this.networkSeries.nodes.template.label.fill = color("#000");
      this.networkSeries.nodes.template.label.hideOversized = false;
      this.networkSeries.nodes.template.label.truncate = true;
      this.networkSeries.minRadius = percent(3.7);
      this.networkSeries.manyBodyStrength = -6;
      this.networkSeries.links.template.strokeOpacity = 0;

      //endbubblechart


      // Chart for gender
      this.genderGraph = create("gender", am4charts.PieChart);
      this.genderGraph.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.genderGraph.logo.disabled = true;
      this.genderGraph.data = [];
      this.genderGraph.radius = percent(70);
      this.genderGraph.innerRadius = percent(40);
      this.genderGraph.startAngle = 180;
      this.genderGraph.endAngle = 360;

      let genderSeries = this.genderGraph.series.push(
        new am4charts.PieSeries()
      );

      genderSeries.dataFields.value = "count";
      genderSeries.dataFields.category = "_id";

      genderSeries.slices.template.cornerRadius = 10;
      genderSeries.slices.template.innerCornerRadius = 7;
      genderSeries.slices.template.draggable = false;
      genderSeries.slices.template.inert = true;
      genderSeries.alignLabels = false;

      genderSeries.hiddenState.properties.startAngle = 90;
      genderSeries.hiddenState.properties.endAngle = 90;

      genderSeries.labels.template.disabled = true;

      genderSeries.colors.list = [
        color("#1f3ad1"),
        color("#439757"),
      ];

      this.genderGraph.legend = new am4charts.Legend();

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          this.genderGraph.legend.labels.template.fill = color("#fff");
          this.genderGraph.legend.valueLabels.template.fill = color(
            "#fff"
          );
        } else {
          this.genderGraph.legend.labels.template.fill = color(
            "#2B2C2D"
          );
          this.genderGraph.legend.valueLabels.template.fill = color(
            "#2B2C2D"
          );
        }
      });

      // Chart for TIME FRAME
      this.timeFrameGraphData = create("timeFrame", am4charts.XYChart);
      this.timeFrameGraphData.logo.disabled = true;
      // timeFrame.scrollbarX = new Scrollbar();

      // Add data
      this.timeFrameGraphData.data = [];

      this.timeFrameXText = this.timeFrameGraphData.xAxes.push(
        new am4charts.CategoryAxis()
      );
      this.timeFrameXText.dataFields.category = "_id";
      this.timeFrameXText.renderer.grid.template.location = 0;
      this.timeFrameXText.renderer.minGridDistance = 30;
      this.timeFrameXText.title.text = "MONTHS";

      // this.timeFrameXText.renderer.labels.template.events.on("over", function(ev) {
      //   var point = this.timeFrameXText?.categoryToPoint(ev.target.dataItem.category);
      //   this.timeFrameGraphData.cursor.triggerMove(point, "soft");
      // });

      this.timeFrameXText?.renderer.labels.template.events.on("out", function (ev) {
        if (this.timeFrameXText) {
          var point = this.timeFrameXText?.categoryToPoint(ev.target.dataItem.category);
          this.timeFrameGraphData.cursor.triggerMove(point, "none");
        }
      });


      let valueAxis = this.timeFrameGraphData.yAxes.push(
        new am4charts.ValueAxis()
      );
      valueAxis.title.text = "PEOPLE VISITED";
      //valueAxis.integersOnly = true;
      valueAxis.tooltip.disabled = true;
      // Create series
      let timeFrameSeries = this.timeFrameGraphData.series.push(
        new am4charts.ColumnSeries()
      );
      timeFrameSeries.dataFields.valueY = "count";
      timeFrameSeries.dataFields.categoryX = "_id";
      timeFrameSeries.name = "count";


      timeFrameSeries.columns.template.tooltipText =
        "{categoryX}: [bold]{valueY}[/]";
      this.timeFrameGraphData.cursor = new am4charts.XYCursor();
      this.timeFrameGraphData.cursor.lineY.disabled = true;
      this.timeFrameGraphData.cursor.lineX.disabled = true;


      timeFrameSeries.columns.template.fill = color("#203ad1");

      let columnTemplate = timeFrameSeries.columns.template;
      columnTemplate.strokeWidth = 0;
      columnTemplate.strokeOpacity = 0;

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          this.timeFrameXText.renderer.labels.template.fill = color("#fff");
          valueAxis.renderer.labels.template.fill = color("#fff");
          valueAxis.title.fill = color("#fff");
          this.timeFrameXText.title.fill = color("#fff");
        } else {
          this.timeFrameXText.renderer.labels.template.fill = color("#2B2C2D");
          valueAxis.renderer.labels.template.fill = color("#2B2C2D");
          valueAxis.title.fill = color("#2B2C2D");
          this.timeFrameXText.title.fill = color("#2B2C2D");
        }
      });
      // let label = this.timeFrameXText.renderer.labels.template;
      // label.truncate = true;
      // label.maxWidth = 120;

      // Create CAST chart instance
      this.casteGraph = create("caste", am4charts.XYChart);
      this.casteGraph.logo.disabled = true;
      // Add data
      this.casteGraph.data = [];

      // this.casteGraph.responsive.enabled = true;
      // Create axes

      let casteCategoryAxis = this.casteGraph.xAxes.push(
        new am4charts.CategoryAxis()
      );
      casteCategoryAxis.dataFields.category = "_id";
      casteCategoryAxis.renderer.grid.template.location = 0;
      casteCategoryAxis.renderer.minGridDistance = 30;
      casteCategoryAxis?.renderer.labels.template.events.on("out", function (ev) {
        if (casteCategoryAxis) {
          var point = casteCategoryAxis?.categoryToPoint(ev.target.dataItem.category);
          casteCategoryAxis.cursor.triggerMove(point, "none");
        }
      });

      // let label = this.timeFrameXText.renderer.labels.template;
      // label.truncate = true;
      // label.maxWidth = 120;

      // casteCategoryAxis.renderer.labels.template.adapter.add(
      //   "dy",
      //   (dy, target) => {
      //     if (target.dataItem && target.dataItem.index && 2 == 2) {
      //       return dy + 25;
      //     }
      //     return dy;
      //   }
      // );
      casteCategoryAxis.title.text = "CASTE CATEGORY";
      let casteValueAxis = this.casteGraph.yAxes.push(
        new am4charts.ValueAxis()
      );
      casteValueAxis.title.text = "PEOPLE VISITED";
      casteValueAxis.tooltip.disabled = true;
      // Create series
      let casteSeries = this.casteGraph.series.push(
        new am4charts.ColumnSeries()
      );
      casteSeries.dataFields.valueY = "count";
      casteSeries.dataFields.categoryX = "_id";
      casteSeries.name = "count";
      casteSeries.columns.template.tooltipText =
        "{categoryX}: [bold]{valueY}[/]";
      casteSeries.columns.template.fill = color("#5C3DCE");

      casteSeries.columns.template.width = percent(10);

      this.casteGraph.cursor = new am4charts.XYCursor();
      this.casteGraph.cursor.lineY.disabled = true;
      this.casteGraph.cursor.lineX.disabled = true;

      let casteColumnTemplate = casteSeries.columns.template;
      casteColumnTemplate.strokeWidth = 0;
      casteColumnTemplate.strokeOpacity = 0;

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          casteCategoryAxis.renderer.labels.template.fill = color(
            "#fff"
          );
          casteValueAxis.renderer.labels.template.fill = color("#fff");
          casteValueAxis.title.fill = color("#fff");
          casteCategoryAxis.title.fill = color("#fff");
        } else {
          casteCategoryAxis.renderer.labels.template.fill = color(
            "#2B2C2D"
          );
          casteValueAxis.renderer.labels.template.fill = color(
            "#2B2C2D"
          );
          casteValueAxis.title.fill = color("#2B2C2D");
          casteCategoryAxis.title.fill = color("#2B2C2D");
        }
      });
    });
  }



  getCasteOptionData() {
    this.userService.getCasteOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.castes = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
  getVisitorOccupationData() {
    this.userService.getVisitorOccupation().subscribe(
      (response: any) => {
        if (response.error === false) {
          console.log(response.data)
          this.visitorOccupationOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
  // geoMapDistrict(){
  //   //Graph Geo Map District
  //           // Create map instance
  //           let chartGeo = create("geoMap1", am4maps.MapChart);
  //           chartGeo.logo.disabled = true;
  //           chartGeo.maxZoomLevel = 64;
  //           // console.log("dfgh")
  //           chartGeo.geodata = am4geodata_worldLow;
  //           // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]

  //           // Set projection
  //           chartGeo.projection = new am4maps.projections.Projection();

  //           // Add button
  //           let zoomOut1 = chartGeo.tooltipContainer.createChild(ZoomOutButton);
  //           zoomOut1.align = "right";
  //           zoomOut1.valign = "top";
  //           zoomOut1.margin(20, 20, 20, 20);
  //           zoomOut1.events.on("hit", function () {
  //             if (currentSeries1) {
  //               currentSeries1.hide();
  //             }
  //             chartGeo.goHome();
  //             zoomOut1.hide();
  //             currentSeries1 = regionalSeries1.IN.series;
  //             currentSeries1.show();
  //           });
  //           zoomOut1.hide();

  //           // Create map polygon series
  //           let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
  //           polygonSeries1.useGeodata = true;
  //           polygonSeries1.calculateVisualCenter = true;

  //           // Configure series
  //           let polygonTemplate1 = polygonSeries1.mapPolygons.template;
  //           polygonTemplate1.tooltipText = "{name}";
  //           polygonTemplate1.fill = chartGeo.colors.getIndex(0);
  //           //shantam
  //           polygonSeries1.include = ["IN-DL"];
  //           chartGeo.events.on("ready", loadStores1);
  //           //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
  //           this.geodata = chartGeo.series.push(new am4maps.MapImageSeries());
  //           // let imageSeriesTemplate = imageSeries.mapImages.template;
  //           let imageSeriesTemplate1 = this.geodata.mapImages.template;
  //           let circle1 = imageSeriesTemplate1.createChild(Circle);
  //           circle1.radius = 4;
  //           circle1.fill = color("#B27799");
  //           circle1.stroke = color("#FFFFFF");
  //           circle1.strokeWidth = 2;
  //           circle1.nonScaling = true;
  //           circle1.tooltipText = "{constituency}";
  //           imageSeriesTemplate1.propertyFields.latitude = "latitude";
  //           imageSeriesTemplate1.propertyFields.longitude = "longitude";

  //           imageSeriesTemplate1.tooltipText = "{constituency}: {count}";

  //           function loadStores1() {
  //             let loader = new DataSource();
  //             loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
  //             loader.events.on("parseended", (ev: any) => {
  //               setupStores1(ev.target.data);
  //             });
  //             loader.load();
  //           }

  //           // Creates a series
  //           function createSeries1(heatfield) {
  //             let series = chartGeo.series.push(new am4maps.MapImageSeries());
  //             series.dataFields.value = heatfield;

  //             let template = series.mapImages.template;
  //             template.verticalCenter = "middle";
  //             template.horizontalCenter = "middle";
  //             template.propertyFields.latitude = "lat";
  //             template.propertyFields.longitude = "long";
  //             template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
  //             // template.dataItem

  //             let circle = template.createChild(Circle);
  //             circle.radius = 10;
  //             circle.fillOpacity = 0.7;
  //             circle.verticalCenter = "middle";
  //             circle.horizontalCenter = "middle";
  //             circle.nonScaling = true;

  //             let label = template.createChild(Label);
  //             label.text = "{stores}";
  //             label.fill = color("#fff");
  //             label.verticalCenter = "middle";
  //             label.horizontalCenter = "middle";
  //             label.nonScaling = true;

  //             let heat = series.heatRules.push({
  //               target: circle,
  //               property: "radius",
  //               min: 10,
  //               max: 30
  //             });

  //             // Set up drill-down
  //             series.mapImages.template.events.on("hit", (ev: any) => {

  //               // Determine what we've clicked on
  //               let data = ev.target.dataItem.dataContext;

  //               // No id? Individual store - nothing to drill down to further
  //               if (!data.target) {
  //                 return;
  //               }

  //               // Create actual series if it hasn't been yet created
  //               if (!regionalSeries1[data.target].series) {
  //                 regionalSeries1[data.target].series = createSeries1("count");
  //                 regionalSeries1[data.target].series.data = data.markerData;
  //               }

  //               // Hide current series
  //               if (currentSeries1) {
  //                 currentSeries1.hide();
  //               }

  //               // Control zoom
  //               if (data.type == "state") {
  //                 let statePolygon = polygonSeries1.getPolygonById("IN-PB");
  //                 chartGeo.zoomToMapObject(statePolygon);
  //               } else if (data.type == "city") {
  //                 chartGeo.zoomToGeoPoint({
  //                   latitude: data.lat,
  //                   longitude: data.long
  //                 }, 64, true);
  //               }
  //               zoomOut1.show();

  //               // Show new targert series
  //               currentSeries1 = regionalSeries1[data.target].series;
  //               currentSeries1.show();
  //             });

  //             return series;
  //           }

  //           let regionalSeries1: any = {};
  //           let currentSeries1;

  //           function setupStores1(data) {

  //             // Init country-level series
  //             regionalSeries1.IN = {
  //               markerData: [],
  //               series: createSeries1("stores")
  //             };

  //             // Set current series
  //             currentSeries1 = regionalSeries1.IN.series;

  //             // Process data
  //             array.each(data.query_results, (data: any) => {


  //               // Get store data
  //               let store = {
  //                 state: data.MAIL_ST_PROV_C,
  //                 long: type.toNumber(data.LNGTD_I),
  //                 lat: type.toNumber(data.LATTD_I),
  //                 location: data.co_loc_n,
  //                 city: data.mail_city_n,
  //                 count: type.toNumber(data.count)
  //               };

  //               // Process state-level data
  //               if (regionalSeries1[store.state] == undefined) {
  //                 let statePolygonForGeo: any = polygonSeries1.getPolygonById("IN-" + store.state);
  //                 if (statePolygonForGeo) {

  //                   // Add state data
  //                   regionalSeries1[store.state] = {
  //                     target: store.state,
  //                     type: "state",
  //                     name: statePolygonForGeo.dataItem.dataContext.name,
  //                     count: store.count,
  //                     stores: 1,
  //                     lat: statePolygonForGeo.visualLatitude,
  //                     long: statePolygonForGeo.visualLongitude,
  //                     state: store.state,
  //                     markerData: []
  //                   };
  //                   regionalSeries1.IN.markerData.push(regionalSeries1[store.state]);

  //                 } else {
  //                   // State not found
  //                   return;
  //                 }
  //               } else {
  //                 regionalSeries1[store.state].stores++;
  //                 regionalSeries1[store.state].count += store.count;
  //               }

  //               // Process city-level data
  //               if (regionalSeries1[store.city] == undefined) {
  //                 regionalSeries1[store.city] = {
  //                   target: store.city,
  //                   type: "city",
  //                   name: store.city,
  //                   count: store.count,
  //                   stores: 1,
  //                   lat: store.lat,
  //                   long: store.long,
  //                   state: store.state,
  //                   markerData: []
  //                 };
  //                 regionalSeries1[store.state].markerData.push(regionalSeries1[store.city]);
  //               } else {
  //                 regionalSeries1[store.city].stores++;
  //                 regionalSeries1[store.city].count += store.count;
  //               }

  //               // Process individual store
  //               regionalSeries1[store.city].markerData.push({
  //                 name: store.location,
  //                 count: store.count,
  //                 stores: 1,
  //                 lat: store.lat,
  //                 long: store.long,
  //                 state: store.state
  //               });

  //             });

  //             regionalSeries1.IN.series.data = regionalSeries1.IN.markerData;
  //           }


  // }

  getVisitorPoliticalInclinationOptionData() {
    this.userService.getVisitorPoliticalInclinationOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.perceivedPoliticalInclinationsOption = response.data;

        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getVisitorCategoryOptionData() {
    this.userService.getVisitorCategoryOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.visitorCategoriesOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getWhomToMeetOptionData() {
    this.userService.getWhomToMeetOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.whomVisitorMeetsOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getVisitorLocationOfMeetingOptionData() {
    this.userService.getVisitorLocationOfMeetingOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.meetingLocationsOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  yourPageChangeLogic(ev) {
    this.pageIndexOfListingTable = ev.pageIndex + 1
    // this.getVisitorList(this.pageIndexOfListingTable)


    this.isLoadingResults = true;
    var currentTime = new Date();
    var fromdate = new Date("Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)");
    const range = { fromDate: fromdate, toDate: currentTime }
    this.userService.getVisitorByFilter(
      this.filterKeyword ? this.filterKeyword.search : '',
      this.filterKeyword ? this.filterKeyword.purpose : '',
      this.filterKeyword ? this.filterKeyword.date : '',
      this.pageIndexOfListingTable).subscribe(
        (response: any) => {
          if (response.error === false) {
            this.visitorLists = response.data.response;
            this.exportList = [];
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
                revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
                visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                totalVisits: this.visitorLists[i].totalVisits,
                remark: this.visitorLists[i].objectiveInfoRemark,
                politicalRemark: this.visitorLists[i].politicalInforRemark,

              })

            }
            this.dataSource = new MatTableDataSource<any>(this.visitorLists);
            // this.dataSource.paginator = this.paginator;
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

  getVisitorList(pageIndexOfListingTable?: any): void {
    // this.isLoadingResults = true;
    var currentTime = new Date();
    var fromdate = new Date("Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)");
    const range = { fromDate: fromdate, toDate: currentTime }
    this.userService.getVisitorList(pageIndexOfListingTable).subscribe(
      (response: any) => {
        if (response.error === false) {
          this.visitorLists = response.data.response;

          this.visitorListsTotalLength = response.data.length;
          this.exportList = [];
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
              address: "data dummy address",
              createdAt: day,
              enrollmentDate: Eday,
              mobile: this.visitorLists[i].mobile,
              revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
              revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
              visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
              totalVisits: this.visitorLists[i].totalVisits,
              remark: this.visitorLists[i].objectiveInfoRemark,
              politicalRemark: this.visitorLists[i].politicalInforRemark,

            })
          }

          // console.log(this.dataSource)
          // console.log(this.visitorLists)
          this.dataSource = new MatTableDataSource<any>(this.visitorLists);
          this.pageLength = response.data.length;
          // this.dataSource.paginator = this.paginator;
          // this.paginator.pageIndex = 0;
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

  exportTable() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.exportList);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, this.exportVisitorListFileName);
  }

  exportTableAll(): void {

    const allData = this.exportAllDataVar.map((element) => {
      return {
        "Unique Visitor ID": element.uniqueVisitorId,
        "Visitor Name": element.fullName,
        "Address": element.houseNumber + element.line1,
        "Date": ("0" + new Date(element.createdAt).getDate()).slice(-2) + "-" + ("0" + (new Date(element.createdAt).getMonth() + 1)).slice(-2) + "-" +
          new Date(element.createdAt).getFullYear(),
        "Enrollment Date": ("0" + new Date(element.enrollmentDate).getDate()).slice(-2) + "-" + ("0" + (new Date(element.enrollmentDate).getMonth() + 1)).slice(-2) + "-" +
          new Date(element.enrollmentDate).getFullYear(),
        "Mobile": element.mobile,
        "Caste": element.caste,
        "DOB": ("0" + new Date(element.dob).getDate()).slice(-2) + "-" + ("0" + (new Date(element.dob).getMonth() + 1)).slice(-2) + "-" +
          new Date(element.dob).getFullYear(),
        "Gender": element.gender,
        "Father Name": element.father,
        "Mother Name": element.mother,
        "House Number": element.houseNumber,
        "Occupation": element.occupation,
        "Tehsil": element.tehsil,
        "District": element.district,
        "Area PIN": element.zipCode,
        // "Visitor Voter Id Number": element.address.voterId,
        "Visitor Voter Id Number": element.voterId,
        "Constituency": element.constituency,
        "Area": element.address.area,
        // "Booth Number": element.boothNumber,
        // "Booth Name": element.boothName,
        // "Booth Area": element.boothArea,
        "Location of Meeting": element.meetingLocation,
        "Location Name": element.locationName,
        "Perceived political inclination": element.perceivedPoliticalInclination,
        "Proximity of Visitor": element.proximityOfVisitor,
        "Total Number of Family Members": element.totalFamilyMembers,
        "Email Id": element.emailId,
        "Landline Number": element.landLineNumber,
        "Purpose of Visit": element.revisits[0] ? element.revisits[0].visitPurposeCategory : '',
        "Whom Visitor Meet": element.revisits[0] ? element.revisits[0].whomToMeet : '',
        "Purpose Of Visit Text": element.revisits[0] ? element.revisits[0].purposeOfVisitText : '',
        //"Booth Coordinator": element.politicalinfo.boothCoordinator,
        "Status": element.revisits[0] ? element.revisits[0].status : '',
        "Visitor Category": element.politicalinfo.visitorCategory,
        "Is Samajwadi Party Member": element.politicalinfo.isSamajwadiPartyMember,
        "Total no of Visits": element.totalVisits,
        "Remarks": element.objectiveInfoRemark,
        "Remarks (In case if the visitor comes with some reference)": element.politicalInforRemark,
        "Reference mobile number": element.refrenceMobile,
        "Capture details of any accomplice with the visitor": element.accomplicedDetails,
        // "Thank You Acknowledgment message sent": element.politicalinfo.isAcknowledgementSent ? 'Yes' : 'No',
        // "Information sent to the booth/Village coordinator of the visitor": element.politicalinfo.isInfoSentToBooth ? 'Yes' : 'No'
      }
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.exportVisitorListFileName);
  }

  exportTableInPDF(): void {

    const doc = new jsPDF("l");

    const pages = doc.getNumberOfPages();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;


    for (let j = 1; j < pages + 1; j++) {
      const horizontalPos = pageWidth / 2; //Can be fixed number
      const verticalPos = pageHeight - 10; //Can be fixed number



      doc.text(
        `Copyright © 2006-2021, NSIGHT Consulting. All rights reserved.`,
        horizontalPos,
        verticalPos,

        {
          align: "center",
        },
      );
      doc.setPage(j);
    }

    // doc.addPage("l");

    // const img = new Image();
    // img.src = '../../../assets/images/logo.png'
    // doc.addImage(img, 'png', 5, 5, 12, 12);

    doc.text("Visitors List", 65, 13, null, "center");
    doc.text(
      "Date & Time : " + new Date().toLocaleString().toString(),
      240,
      13,
      null,
      "center"
    );
    autoTable(doc, {
      margin: {
        top: 25,
      },
      body: this.exportList,
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        5: { cellWidth: 25 },
        10: { cellWidth: 15 },
      },
      columns: [{
        header: 'S.no',
        dataKey: 'serial'
      }, {
        header: 'Unique  ID',
        dataKey: 'uniqueVisitorId'
      }, {
        header: 'Name',
        dataKey: 'fullName'
      }, {
        header: 'Address',
        dataKey: 'address'
      }, {
        header: 'Date',
        dataKey: 'createdAt'
      },
      {
        header: 'Enroll.Date',
        dataKey: 'enrollmentDate'
      },
      {
        header: 'Mobile',
        dataKey: 'mobile'
      }, {
        header: 'Purpose of Visit',
        dataKey: 'revisit'
      }, {
        header: 'Status',
        dataKey: 'revisitStatus'
      }, {
        header: 'Visit Category',
        dataKey: 'visitCategory'
      },

      {
        header: 'Total Visit',
        dataKey: 'totalVisits'
      }, {
        header: 'Remark',
        dataKey: 'remark'
      }, {
        header: 'Political Remarks',
        dataKey: 'politicalRemark'
      },
        //  {
        //   header: 'Capture Details of accomplice ',
        //   dataKey: 'accomDetail'
        // }, {
        //   header: 'Thank you Acknowledgment message sent',
        //   dataKey: 'ack'
        // }, {
        //   header: 'Information of booth coordinator ',
        //   dataKey: 'boothCor'
        // },
      ],
    })
    doc.save("visitorList.pdf");
  }

  // getVisitorPurposeOptionData() {
  //   this.userService.getVisitorPurposeOptionData().subscribe(
  //     (response: any) => {
  //       console.log("response.data", response.data)
  //       this.purposes = response.data;
  //     },
  //     (error) => {
  //       this._snackBar.open(error.message, "", {
  //         duration: 5000,
  //       });
  //     }
  //   );
  // }
  //   visitorListAllData(){
  // //    this.isLoadingResults = true

  //     this.userService
  //     .getAllVisitorList(

  //     )
  //     .subscribe(
  //       (response: any) => {
  //         if (response.error === false) {
  //           this.exportAllDataVar = response.data.response;
  //          // this.visitorListsTotalLength = response.data.length;


  //          console.log(" this.exportAllDataVar ",response.data.response)

  //         //  this.isLoadingResults = false;
  //         }
  //       },
  //       (error) => {
  //         this.isLoadingResults = false;
  //         console.log("error.message",error)

  //         this._snackBar.open(error.message, "", {
  //           duration: 5000,
  //         });
  //       }
  //     );
  //   }
  filterByName(value) {
    this.filterValue = value
    this.filterInitial = ''
    this.range.reset()
    this.filterTable()
  }
  filterPurpose(value) {
    this.filterInitial = value
    this.filterValue = ''
    this.range.reset()
    this.filterTable()
  }
  filterDate() {
    this.filterInitial = ''
    this.filterValue = ''
    this.filterTable()
  }
  filterTable(): void {
    this.isLoadingResults = true;
    this.userService.getVisitorByFilter(
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
            this.exportList = [];
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
                revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
                visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                totalVisits: this.visitorLists[i].totalVisits,
                remark: this.visitorLists[i].objectiveInfoRemark,
                politicalRemark: this.visitorLists[i].politicalInforRemark,

              })

            }
            this.dataSource = new MatTableDataSource<any>(this.visitorLists);
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


  resetFilter() {
    this.appliedFilters = {};
    this.paginator.pageIndex = 0;
    this.visitorListsTotalLength = 1;
    this.filterInitial = "";
    this.filterValue = "";
    this.pageLength = 0;
    this.range.controls.fromDate.setValue("");
    this.range.controls.toDate.setValue("");
    this.filterKeyword = {
      search: this.filterInitial,
      purpose: this.filterValue,
      date: this.range.value,
    }
    // this.getFilterMeetStatus()
    this.filterTable()
    console.log(this.appliedFilters)
    //this.getVisitorList(1);
  }

  getVisitorDetail(visitorId): void {
    this.router.navigate(["/add-visitor", visitorId]);
  }

  getVisitAnalyticData() {
    this.loader = true;

    this.userService.getVisitAnalyticData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.loader = false;
          this.anlyticData = response.data;
        }
      },
      (error) => {
        this.loader = false;
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  setToPollingTableView(): void {
    const ele = document.getElementById("exportVisitorListTable");
    ele.scrollIntoView({
      behavior: "smooth",
    });
  }

  ngOnChanges(): void {
    // this.ngAfterViewInit();

  }
  getVisitAnalyticGraphData(filterValue?: any) {

    console.log('filterdedd', filterValue);

    if (filterValue) {
      this.viewGraphresetBtn = true;
      this.isLoadingResults = true;
    }

    this.userService.graphDataLoader.next(true);
    this.userService.getVisitAnalyticGraphData(filterValue).subscribe(
      (response: any) => {
        if (response.error === false) {


          console.log("SUCCESSFULL ARRIVED");
          this.userService.graphDataLoader.next(false);


          console.log('Purpose:', this.purposeGraph.data);
          this.purposeGraph.data = response.data.purpose;

          this.genderGraph.data = response.data.gender;
          this.casteGraph.data = response.data.caste;
          if (!filterValue) {
            this.purposes = response.data.purpose;
            console.log("purposes", this.purposes);
          }

          console.log("castedat:", this.casteGraph.data);

          // let castGrf = [];
          // for (let i = 0; i < this.casteGraph.data.length; i++) {
          //   let tt = {name: this.casteGraph.data[i]._id, value: 1,}
          //   castGrf.push(tt)
          // }
          this.networkSeries.data = this.casteGraph.data;

          // if (this.casteGraph.data.length > 8) {
          //   this.casteGraph.scrollbarX = new Scrollbar();
          //   this.casteGraph.scrollbarX.parent = this.casteGraph.bottomAxesContainer;
          // }
          if (response.data.timeFrame.length > 8) {
            this.timeFrameGraphData.scrollbarX = new Scrollbar();
            this.timeFrameGraphData.scrollbarX.parent = this.timeFrameGraphData.bottomAxesContainer;
          }

          if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Week') {
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text = "WEEKS"
            this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('ddd'),
                'count': element.count
              }
            })
          } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Month') {
            var sortedData: any = response.data.timeFrame.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

            this.timeFrameGraphData.data = sortedData.map((element) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('MMM'),
                'count': element.count
              }
            })
            this.timeFrameXText.title.text = "MONTH"
          } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Year') {
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text = "YEARS"
            this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('YYYY'),
                'count': element.count
              }
            })
          } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Date') {
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text = "DATES"
            this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {
              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('MMM'),
                'count': element.count
              }
            })
          }
          else {
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text = "MONTHS"
            var sortedData: any = response.data.timeFrame.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

            this.timeFrameGraphData.data = sortedData.map((element) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('MMM'),
                'count': element.count
              }
            })
          }

          // this.geodata.data = response.data.boothArea;
          // this.geodata1.data = response.data.boothArea;
          // this.geodata1.data = response.data.districtArea;
         
          //map ka data in this function below

          let pbnos = response.data.boothArea;

          // this.pbPoints.data = this.geodatajson.features.filter(data => {
          //   return (data.geometry.type == "Point");
          // }).map(points => {
          //   return { ...points, "latitude": points.geometry.coordinates[1], "longitude": points.geometry.coordinates[0]}
          // });

          // pbnos.map()

          this.pbPoints.data = pbnos;
    

          console.log("chgeo:",this.pbPoints);

          console.log('geodata:',response.data.boothArea);

          this.visitorCategoryData = response.data.visitorCategory;
          this.visitorOccupatioData = response.data.occupation;
          this.ageGraphData = response.data.ageGroup;
          this.perceivedPoliticalInclinationData = response.data.ppi
          this.meetingLocationGraphData = response.data.meetingLocation;
          this.whomVisitorMeetGraphData = response.data.whomVisitorMeet;
          this.meetingStatusGraphData = response.data.meetingStatus;
          this.filteredVisitorCount = response.data.count;
          this.samajwadiPartyGraphData = response.data.isSamajwadiPartyMember;
          this.visitorAreaData = response.data.area
        }


        if (filterValue) {
          this.visitorLists = response.data.visitorData;
          this.exportList = [];
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
              revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
              visitCategory: this.visitorLists[i].politicalinfo.visitorCategory,
              totalVisits: this.visitorLists[i].totalVisits,
              remark: this.visitorLists[i].objectiveinfo.remark,
              politicalRemark: this.visitorLists[i].politicalinfo.remarks,

            })
            // if (this.visitorLists[i].politicalinfo.isAcknowledgementSent == true) {

            //   if (this.visitorLists[i].politicalinfo.isInfoSentToBooth == true) {
            //     this.exportList[i].acknowledge = 'Yes';
            //     this.exportList[i].boothCordinate = 'Yes';
            //   } else {
            //     this.exportList[i].acknowledge = 'Yes';
            //     this.exportList[i].boothCordinate = 'No';
            //   }
            // } else {
            //   if (this.visitorLists[i].politicalinfo.isInfoSentToBooth == true) {
            //     this.exportList[i].acknowledge = 'No';
            //     this.exportList[i].boothCordinate = 'Yes';
            //   } else {
            //     this.exportList[i].acknowledge = 'No';
            //     this.exportList[i].boothCordinate = 'No';
            //   }
            // }

          }
          this.dataSource = new MatTableDataSource<any>(this.visitorLists);
          this.dataSource.paginator = this.paginator;
          this.pageLength = response.data.visitorData.length;

          this.viewGraphresetBtn = true;
          this.isLoadingResults = false;
        }
        else {
          this.getVisitorList(1);
          this.viewGraphresetBtn = false;
        }
      },
      (error) => {
        this.userService.graphDataLoader.next(false);
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );

  }

  purposeFilter(value): void {
    const filterObj = {
      key: "purpose",
      value: value,
    };

    this.appliedFilters['purpose'] = value;

    this.getVisitAnalyticGraphData(filterObj);
    // this.getFilterMeetStatus(filterObj)

  }

  visitorAreaFilter(filterObj): void {

    // this.getFilterMeetStatus(filterObj)

    this.getVisitAnalyticGraphData(filterObj);

    this.appliedFilters['area'] = filterObj;

  }

  genderFilter(value): void {
    const filterObj = {
      key: "gender",
      value: value,
    };

    this.appliedFilters['gender'] = value;

    console.log(this.appliedFilters);
    // this.getFilterMeetStatus(filterObj)
    this.getVisitAnalyticGraphData(filterObj);
    // this.getFilterGender(filterObj);


  }

  casteFilter(value): void {
    const filterObj = {
      key: "caste",
      value: value,
    };
    this.appliedFilters['caste'] = value;
    // this.getFilterMeetStatus(filterObj)
    this.getVisitAnalyticGraphData(filterObj);

  }

  ageFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj)
    this.appliedFilters['age'] = filterObj;
    console.log(this.appliedFilters);
    this.getVisitAnalyticGraphData(filterObj);

  }

  perceiveFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['perceive'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }

  samajwadiPartyFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['aapMember'] = filterObj;
    this.getVisitAnalyticGraphData(filterObj);
  }

  visitorCategoryFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['category'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }

  visitorOccupationFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['occupation'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }
  whomVisitorMeetFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['whomMeet'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);


  }

  meetingStatusGraphFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['meetStatus'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);
  }

  meetingLocationGraphFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['meetLocation'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }

  timeFrameFilter(value): void {
    const filterObj = {
      key: "timeFrame",
      value: value,
    };
    // this.getFilterMeetStatus(filterObj)

    this.getVisitAnalyticGraphData(filterObj);
    // this.getFilterArea(filterObj)
    // this.getFilterDistrictConstituency(filterObj)
    // this.getFilterAgeGroup(filterObj)
    // this.getFilterMeetLocation(filterObj)
    // this.getFilterIsSamjawadi(filterObj)
    // this.getFilterGender(filterObj)
    // this.getFilterCaste(filterObj)
    // this.getFilterOccupation(filterObj)
    // this.getFilterPpi(filterObj)
    // this.getFilterPurpose(filterObj)
    // this.getFilterTimeFrame(filterObj)
    // this.getFilterVisitorCategory(filterObj)
    // this.getFilterVisitorMeet(filterObj)
    // this.getVisitorGraphFilter(filterObj);
    // console.log("filterObj",filterObj)
    // this.getVisitAnalyticGraphData(filterObj);
  }

  //separate api

  // getFilterMeetStatus(filterObj?: any): void {

  //   this.isLoadingResults = true;
  //   if (filterObj) {
  //     this.viewGraphresetBtn = true;
  //     this.isLoadingResults = true;
  //   }
  //   else {
  //     this.viewGraphresetBtn = false;
  //     this.appliedFilters = {};
  //   }
  //   //table
  //   this.isLoaderHappen = true;
  //   //All graph loader
  //   this.userService.graphDataLoader.next(true);
  //   this.userService.graphDataLoader5.next(true);
  //   this.userService.graphDataLoader1.next(true);
  //   this.userService.graphDataLoader2.next(true);
  //   this.userService.graphDataLoader4.next(true);
  //   this.graphDataLoader1 = true;
  //   this.graphDataLoader3 = true;
  //   this.userService.graphDataLoader7.next(true);
  //   this.userService.graphDataLoader3.next(true);
  //   this.graphDataLoader = true;
  //   this.graphDataLoader2 = true;
  //   this.userService.graphDataLoader6.next(true);
  //   this.userService.graphDataLoader8.next(true);

  //   this.userService.getFilterMeetStatus(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'meetingStatus') {
  //           this.filteredVisitorCount = response.data[0].count;
  //         }

  //         this.meetingStatusGraphData = response.data;
  //         this.userService.graphDataLoader.next(false);
  //         this.getFilterArea(filterObj)
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterArea(filterObj?: any): void {

  //   this.userService.getFilterArea(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'area') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // console.log("area", this.filteredVisitorCount)
  //         }
  //         this.visitorAreaData = response.data;

  //         this.getFilterDistrictConstituency(filterObj)

  //         this.userService.graphDataLoader5.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterDistrictConstituency(filterObj?: any): void {
  //   // this.isLoadingResults = true;
  //   this.userService.getFilterDistrictConstituency(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         this.geodata1 = response.data[0].district;
  //         this.geodata.data = response.data[0].constituency;
  //         this.getFilterAgeGroup(filterObj)

  //         // this.isLoadingResults = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterAgeGroup(filterObj?: any): void {

  //   this.userService.getFilterAgeGroup(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'ageGroup') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //console.log("ageGroup", this.filteredVisitorCount)
  //         }
  //         this.ageGraphData = response.data;
  //         this.getFilterMeetLocation(filterObj)

  //         this.userService.graphDataLoader1.next(false);

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterMeetLocation(filterObj?: any): void {

  //   this.userService.getFilterMeetLocation(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'meetingLocation') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //console.log("meetingLocation", this.filteredVisitorCount)
  //         }
  //         this.meetingLocationGraphData = response.data;
  //         this.getFilterIsSamjawadi(filterObj)

  //         this.userService.graphDataLoader2.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterIsSamjawadi(filterObj?: any): void {

  //   this.userService.getFilterIsSamjawadi(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         if (filterObj?.key == 'isSamajwadiPartyMember') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //  console.log("isSamajwadiPartyMember", this.filteredVisitorCount)
  //         }
  //         this.samajwadiPartyGraphData = response.data;
  //         setTimeout(() => {
  //           this.getFilterGender(filterObj)
  //         }, 500);

  //         this.userService.graphDataLoader4.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterGender(filterObj?: any): void {

  //   this.userService.getFilterGender(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'gender') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //console.log("gender", this.filteredVisitorCount)
  //         }
  //         this.genderGraph.data = response.data;
  //         setTimeout(() => {
  //           this.getFilterCaste(filterObj)
  //         }, 500);

  //         this.graphDataLoader1 = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterCaste(filterObj?: any): void {

  //   this.userService.getFilterCaste(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'caste') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // console.log("caste", this.filteredVisitorCount)
  //         }
  //         this.casteGraph.data = response.data;
  //         let castGrf = [];
  //         for (let i = 0; i < this.casteGraph.data.length; i++) {
  //           let tt = {name: this.casteGraph.data[i]._id, value: 1,}
  //           castGrf.push(tt)
  //         }
  //         this.networkSeries.data = castGrf;
  //         // this.networkSeries.data = [
  //         //   {name: this.casteGraph.data[0]._id, value: 1,},
  //         //   // {name: this.casteGraph.data[1]._id, value: 1,},
  //         //   // name: 'Singh', value: 1,
  //         //   // name: 'Singh', value: 1,
  //         //   // children: [{
  //         //   //   name: 'Black Tea', value: 1
  //         //   // }, {
  //         //   //   name: 'Floral',
  //         //   //   children: [{
  //         //   //     name: 'Chamomile', value: 1
  //         //   //   }, {
  //         //   //     name: 'Rose', value: 1
  //         //   //   }, {
  //         //   //     name: 'Jasmine', value: 1
  //         //   //   }]
  //         //   // }]
  //         // ]
  //         if (this.casteGraph.data.length > 8) {
  //           this.casteGraph.scrollbarX = new Scrollbar();
  //           this.casteGraph.scrollbarX.parent = this.casteGraph.bottomAxesContainer;
  //         }
  //         this.graphDataLoader3 = false;
  //         this.getFilterOccupation(filterObj)

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterOccupation(filterObj?: any): void {

  //   this.userService.getFilterOccupation(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'occupation') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //console.log("occupation", this.filteredVisitorCount)
  //         }
  //         this.visitorOccupatioData = response.data;
  //         this.userService.graphDataLoader7.next(false);
  //         this.getFilterPpi(filterObj)

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterPpi(filterObj?: any): void {

  //   this.userService.getFilterPpi(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         if (filterObj?.key == 'ppi') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //console.log("ppi", this.filteredVisitorCount)
  //         }
  //         this.perceivedPoliticalInclinationData = response.data;
  //         // this.getFilterPurpose(filterObj)

  //         this.userService.graphDataLoader3.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterPurpose(filterObj?: any): void {
  //   //this.isLoadingResults = true;

  //   this.userService.getFilterPurpose(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //      var data = [
  //           {
  //               "_id": "Other",
  //               "count": 2994
  //           },
  //           {
  //               "_id": "Meeting Leadership",
  //               "count": 22028
  //           },
  //           {
  //               "_id": "Political Purpose",
  //               "count": 2146
  //           },
  //           {
  //               "_id": "Political Function",
  //               "count": 6617
  //           }
  //       ];
  //         this.purposeGraph.data = response.data;
  //         this.purposes = response.data;
  //         // this.purposeGraph.data = data;
  //         // this.purposes = data;

  //         console.log("purposePG", response.data);

  //         this.getFilterTimeFrame(filterObj)
  //         if (filterObj?.key == 'purpose') {
  //           console.log("purpose", this.filteredVisitorCount)
  //           this.filteredVisitorCount = response.data[0].count;
  //         }
  //         this.graphDataLoader = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterTimeFrame(filterValue?: any): void {

  //   this.userService.getFilterTimeFrame(filterValue).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         this.getFilterVisitorCategory(filterValue)
  //         if (filterValue?.key == 'timeFrame') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //  console.log("timeFrame", this.filteredVisitorCount)
  //         }
  //         this.graphDataLoader2 = false;
  //         if (response.data.length > 8) {
  //           this.timeFrameGraphData.scrollbarX = new Scrollbar();
  //           this.timeFrameGraphData.scrollbarX.parent = this.timeFrameGraphData.bottomAxesContainer;
  //         }

  //         // if(filterValue){
  //         if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Week') {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "WEEKS"

  //         } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Month') {
  //           var sortedData: any = response.data.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

  //           this.timeFrameGraphData.data = sortedData.map((element) => {

  //             var d = moment(element._id, 'MM-DD-YYYY');
  //             d.month(); // 1
  //             return {
  //               '_id': d.format('MMM'),
  //               'count': element.count
  //             }
  //           })
  //           this.timeFrameXText.title.text = "MONTH"
  //         } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Year') {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "YEARS"

  //         } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Date') {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "DATES"

  //         }
  //         else {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "MONTHS"
  //           var sortedData: any = response.data.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

  //           this.timeFrameGraphData.data = sortedData.map((element) => {

  //             var d = moment(element._id, 'MM-DD-YYYY');
  //             d.month(); // 1
  //             return {
  //               '_id': d.format('MMM'),
  //               'count': element.count
  //             }
  //           })
  //         }
  //         // }
  //         // else{
  //         //   this.timeFrameGraphData.data = response.data;
  //         //   this.timeFrameXText.title.text= "MONTHS"
  //         // }

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterVisitorCategory(filterObj?: any): void {

  //   this.userService.getFilterVisitorCategory(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'visitorCategory') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // console.log("visitorCategory", this.filteredVisitorCount)
  //         }
  //         this.visitorCategoryData = response.data;
  //         this.userService.graphDataLoader6.next(false);
  //         this.getFilterVisitorMeet(filterObj)

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterVisitorMeet(filterObj?: any): void {

  //   this.userService.getFilterVisitorMeet(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'whomVisitorMeet') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // console.log("whomVisitorMeet", this.filteredVisitorCount)
  //         }
  //         this.whomVisitorMeetGraphData = response.data;
  //         this.userService.graphDataLoader8.next(false);
  //         if (filterObj) {
  //           this.getVisitorGraphFilter(filterObj);
  //         }
  //         else {
  //           this.getVisitorList(1);
  //         }

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getVisitorGraphFilter(filterObj?: any) {
  //   // this.isLoadingResults = true;
  //   this.userService.getVisitorGraphFilter(filterObj, '1').subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         this.visitorLists = response.data.response;
  //         this.visitorListsTotalLength = response.data.length;
  //         this.exportList = [];
  //         for (var i = 0; i <= this.visitorLists.length - 1; i++) {
  //           var d = new Date(this.visitorLists[i].createdAt);

  //           var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  //           var Ed = new Date(this.visitorLists[i].enrollmentDate);

  //           var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

  //           this.exportList.push({
  //             serial: i + 1,
  //             uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
  //             fullName: this.visitorLists[i].fullName,
  //             address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
  //             createdAt: day,
  //             enrollmentDate: Eday,
  //             mobile: this.visitorLists[i].mobile,
  //             revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
  //             revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
  //             visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
  //             totalVisits: this.visitorLists[i].totalVisits,
  //             remark: this.visitorLists[i].objectiveInfoRemark,
  //             politicalRemark: this.visitorLists[i].politicalInforRemark,

  //           })
  //         }
  //         this.dataSource = new MatTableDataSource<any>(this.visitorLists);
  //         this.paginator.pageIndex = 0;
  //         this.pageLength = this.visitorListsTotalLength;
  //         this.isLoadingResults = false;
  //         this.isLoaderHappen = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
}
