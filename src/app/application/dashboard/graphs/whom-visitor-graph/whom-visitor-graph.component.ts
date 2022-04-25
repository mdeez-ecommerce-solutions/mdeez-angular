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

useTheme(am4themes_animated);

@Component({
  selector: 'app-whom-visitor-graph',
  templateUrl: './whom-visitor-graph.component.html',
  styleUrls: ['./whom-visitor-graph.component.css']
})
export class WhomVisitorGraphComponent implements OnInit, AfterViewInit {
  @Input() whomVisitorMeetsOptionVar: any;
  whomVisitorMeetGraph: any;
  whommeetfilter: any;
  @Input() set whomVisitorMeetGraphData(data) {
    if (data) {
      this.whomVisitorMeetGraph.data = data;
    }
  }
  graphDataLoader: boolean;
  @Output() whomVisitorMeetFilterObj: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  private user: UserService) {
    this.user.graphDataLoader8.subscribe((res) => this.graphDataLoader = res)
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
    // Chart code goes in here
    setTimeout(() => {

    this.browserOnly(() => {
      useTheme(am4themes_animated);
      // Create chart instance
      this.whomVisitorMeetGraph = create("whomVisitorMeet", am4charts.RadarChart);
      this.whomVisitorMeetGraph.logo.disabled = true;
      // Add data
      this.whomVisitorMeetGraph.data = [];

      // Make chart not full circle
      this.whomVisitorMeetGraph.startAngle = -90;
      this.whomVisitorMeetGraph.endAngle = 180;
      this.whomVisitorMeetGraph.innerRadius = percent(20);

      // Set number format
      // this.whomVisitorMeetGraph.numberFormatter.numberFormat = "#.#'%'";

      // Create axes
      let categoryAxis = this.whomVisitorMeetGraph.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
      categoryAxis.dataFields.category = "_id";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";

      // categoryAxis.renderer.labels.template.fontWeight = 500;
      categoryAxis.renderer.labels.template.adapter.add("fill", (fill, target) => {
        return (target.dataItem.index >= 0) ? this.whomVisitorMeetGraph.colors.getIndex(target.dataItem.index) : fill;
      });
      categoryAxis.renderer.minGridDistance = 10;

      let valueAxis = this.whomVisitorMeetGraph.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.max = "count";
      valueAxis.strictMinMax = true;

      // Create series
      let series1 = this.whomVisitorMeetGraph.series.push(new am4charts.RadarColumnSeries());
      series1.dataFields.valueX = "full";
      series1.dataFields.categoryY = "_id";
      series1.clustered = false;
      series1.columns.template.fill = color("#fff");
      series1.columns.template.fillOpacity = 0.08;
      // series1.columns.template.cornerRadiusTopLeft = 20;
      series1.columns.template.strokeWidth = 0;
      series1.columns.template.radarColumn.cornerRadius = 20;

      let series2 = this.whomVisitorMeetGraph.series.push(new am4charts.RadarColumnSeries());
      series2.dataFields.valueX = "count";
      series2.dataFields.categoryY = "_id";
      series2.clustered = false;
      series2.columns.template.strokeWidth = 0;
      series2.columns.template.tooltipText = "{_id}: [bold]{count}[/]";
      series2.columns.template.radarColumn.cornerRadius = 20;

      series2.columns.template.adapter.add("fill", (fill, target) => {
        return this.whomVisitorMeetGraph.colors.getIndex(target.dataItem.index);
      });

      // Add cursor
      this.whomVisitorMeetGraph.cursor = new am4charts.RadarCursor();

      this.user.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          valueAxis.renderer.labels.template.fill = color("#fff");
        } else {
          valueAxis.renderer.labels.template.fill = color("#2B2C2D");
        }
      });

    });
  })
  }

  whomVisitorMeetFilter(value): void {
    this.whomVisitorMeetFilterObj.emit({
        key: 'whomVsistorMeet',
        value: value
    })
    this.whommeetfilter = value;
  }

}