import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  isPlatformBrowser
} from '@angular/common';
// amCharts imports
import { useTheme, create, Scrollbar,color, percent } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { UserService } from 'src/app/core/services/user.service';


import screenfull from 'screenfull';

useTheme(am4themes_animated);

@Component({
  selector: 'app-meeting-status-graph',
  templateUrl: './meeting-status-graph.component.html',
  styleUrls: ['./meeting-status-graph.component.css']
})
export class MeetingStatusGraphComponent implements OnInit, AfterViewInit {
  meetingStatusGraph: any;
  statusData;
  @Input() set meetingStatusGraphData(data) {
    if (data) {
      this.meetingStatusGraph.data = data;
      if(!this.statusData){
        this.statusData = data;
      } 
    }
  }
  graphDataLoader: boolean = true;
  statusfilter:any;
  @Output() meetingStatusGraphFilterObj: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  private user: UserService) {
    this.user.graphDataLoader.subscribe((res) => this.graphDataLoader = res)
  }

  ngOnInit(): void {

    this.meetingStatusGraph = [];

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
    setTimeout(() => {

    // Chart code goes in here
    this.browserOnly(() => {
      useTheme(am4themes_animated);
     
this.meetingStatusGraph = create("meetingStatus", am4charts.PieChart);
this.meetingStatusGraph.hiddenState.properties.opacity = 0; // this creates initial fade-in
this.meetingStatusGraph.logo.disabled = true;
this.meetingStatusGraph.data = [];
this.meetingStatusGraph.radius = percent(70);
this.meetingStatusGraph.innerRadius = percent(40);
this.meetingStatusGraph.startAngle = 180;
this.meetingStatusGraph.endAngle = 360;  

let series = this.meetingStatusGraph.series.push(new am4charts.PieSeries());
series.dataFields.value = "count";
series.dataFields.category = "_id";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.slices.template.draggable = false;
series.slices.template.inert = true;
series.alignLabels = false;

series.hiddenState.properties.startAngle = 90;
series.hiddenState.properties.endAngle = 90;

this.meetingStatusGraph.legend = new am4charts.Legend();


series.labels.template.disabled = true;


series.colors.list = [

  color("#dd6789"),
  color("#3FA8E1"),
  color("#713e8d"),

];



this.user.themeValueBehavior.subscribe((value) => {
  if (value === "dark") {
    this.meetingStatusGraph.legend.labels.template.fill = color("#fff");
    this.meetingStatusGraph.legend.valueLabels.template.fill = color("#fff"); 
  } else {
    this.meetingStatusGraph.legend.labels.template.fill = color("#2B2C2D");
    this.meetingStatusGraph.legend.valueLabels.template.fill = color("#2B2C2D"); 
  }
});



    });
  })
  }

  
  toggleFullScreen(codePart: HTMLElement) {
    if (screenfull.isEnabled) {
      screenfull.toggle(codePart);
    }
  }

  meetingStatusGraphFilter(value): void {
    this.meetingStatusGraphFilterObj.emit({
        key: 'meetingStatus',
        value: value
    })
    this.statusfilter = value;
  } 

}
