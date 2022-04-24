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
import { useTheme, create,color, percent } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { UserService } from 'src/app/core/services/user.service';

useTheme(am4themes_animated);

@Component({
  selector: 'app-meeting-location-graph',
  templateUrl: './meeting-location-graph.component.html',
  styleUrls: ['./meeting-location-graph.component.css']
})
export class MeetingLocationGraphComponent implements OnInit {
  @Input() meetingLocationsOptionVar: any;
  meetingLocationGraph: any;
  @Input() set meetingLocationGraphData(data) {
    if (data) {
      this.meetingLocationGraph.data = data;
    }
  }

  graphDataLoader: boolean;
  @Output() meetingLocationGraphFilterObj: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  private user: UserService) {
    this.user.graphDataLoader2.subscribe((res) => this.graphDataLoader = res)
  }

  ngOnInit(): void {}

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
     
this.meetingLocationGraph = create("meetingLocation", am4charts.PieChart);
this.meetingLocationGraph.hiddenState.properties.opacity = 0; // this creates initial fade-in
this.meetingLocationGraph.logo.disabled = true;
this.meetingLocationGraph.data = [];
this.meetingLocationGraph.radius = percent(70);
this.meetingLocationGraph.innerRadius = percent(40);
this.meetingLocationGraph.startAngle = 180;
this.meetingLocationGraph.endAngle = 360;  

let series = this.meetingLocationGraph.series.push(new am4charts.PieSeries());
series.dataFields.value = "count";
series.dataFields.category = "_id";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.slices.template.draggable = false;
series.slices.template.inert = true;
series.alignLabels = false;

series.hiddenState.properties.startAngle = 90;
series.hiddenState.properties.endAngle = 90;

this.meetingLocationGraph.legend = new am4charts.Legend();


series.labels.template.disabled = true;


series.colors.list = [
  color("#6A6DDE"),
  color("#EB6EB0"),
  color("#713E8D"),
];


this.user.themeValueBehavior.subscribe((value) => {
  if (value === "dark") {
    this.meetingLocationGraph.legend.labels.template.fill = color("#fff");
    this.meetingLocationGraph.legend.valueLabels.template.fill = color("#fff"); 
  } else {
    this.meetingLocationGraph.legend.labels.template.fill = color("#2B2C2D");
    this.meetingLocationGraph.legend.valueLabels.template.fill = color("#2B2C2D"); 
  }
});


    });
  })
  }

  meetingLocationGraphFilter(value): void {
    this.meetingLocationGraphFilterObj.emit({
        key: 'meetingLocation',
        value: value
    })
  }

}
