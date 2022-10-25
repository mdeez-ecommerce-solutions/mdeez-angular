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

@Component({
  selector: 'app-samajwadi-party-graph',
  templateUrl: './samajwadi-party-graph.component.html',
  styleUrls: ['./samajwadi-party-graph.component.css']
})
export class SamajwadiPartyGraphComponent implements OnInit {
  visitorAreaGraph: any;
  aapfilter: any;
  @Input() set samajwadiPartyData(data) {
    if (data) {
      this.visitorAreaGraph.data = data;
    }
  }
  graphDataLoader: boolean = true;
  @Output() samajwadiPartyFilterObj: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  private user: UserService) {
    this.user.graphDataLoader.subscribe((res) => this.graphDataLoader = res)
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
     
this.visitorAreaGraph = create("samajwadiParty", am4charts.PieChart);
this.visitorAreaGraph.hiddenState.properties.opacity = 0; // this creates initial fade-in
this.visitorAreaGraph.logo.disabled = true;
this.visitorAreaGraph.data = [];
this.visitorAreaGraph.radius = percent(70);
this.visitorAreaGraph.innerRadius = percent(40);
this.visitorAreaGraph.startAngle = 180;
this.visitorAreaGraph.endAngle = 360;  

let series = this.visitorAreaGraph.series.push(new am4charts.PieSeries());
series.dataFields.value = "count";
series.dataFields.category = "_id";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.slices.template.draggable = false;
series.slices.template.inert = true;
series.alignLabels = false;

series.hiddenState.properties.startAngle = 90;
series.hiddenState.properties.endAngle = 90;

this.visitorAreaGraph.legend = new am4charts.Legend();


series.labels.template.disabled = true;


series.colors.list = [
  // color("#3FA8E1"),
  // color("#D69600"),
  // color("#D35249"),
  color("#305ae3"),
  color("#d95ad5"),


];


// this.networkSeries.colors.list = [
//   color("#2039d1"),
//   color("#305ae3"),
//   color("#207cd1"),
//   color("#409bdb"),
//   color("#43a8d6"),
//#fd7e14 No
//#d69728 yes


this.user.themeValueBehavior.subscribe((value) => {
  if (value === "dark") {
    this.visitorAreaGraph.legend.labels.template.fill = color("#fff");
    this.visitorAreaGraph.legend.valueLabels.template.fill = color("#fff"); 
  } else {
    this.visitorAreaGraph.legend.labels.template.fill = color("#2B2C2D");
    this.visitorAreaGraph.legend.valueLabels.template.fill = color("#2B2C2D"); 
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

  visitorAreaGraphFilter(value): void {
    this.samajwadiPartyFilterObj.emit({
        key: 'isSamajwadiPartyMember',
        value: value
    })
    this.aapfilter = value;
  } 

}