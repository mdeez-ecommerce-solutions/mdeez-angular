import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
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
  selector: 'app-age-group-graph',
  templateUrl: './age-group-graph.component.html',
  styleUrls: ['./age-group-graph.component.css']
})
export class AgeGroupGraphComponent implements OnInit {
  // ageNumbers = [
  //   "18-25",
  //   "26-40",
  //   "41-60",
  //   "60+"
  // ]
  ageNumbers = [
    "By Week",
    "By Month",
    "By Year"
  ]
  graphDataLoader: boolean = true;
  @Output() ageFilterObj: EventEmitter<any> = new EventEmitter();
  
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  private user: UserService) {
    this.user.graphDataLoader.subscribe((res) => this.graphDataLoader = res)
  }
  
  ageGraph: any;
  agefilter:any;
  @Input() set ageGraphData(data) {
    if (data) {
      this.ageGraph.data = data;
    }
  }
  ngOnInit(): void {
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
    setTimeout(() => {

    this.browserOnly(() => {
      useTheme(am4themes_animated);
      // Create chart instance
      this.ageGraph = create("ageGroup", am4charts.XYChart);
      this.ageGraph.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      this.ageGraph.logo.disabled = true;
      this.ageGraph.data = [];
      
      let categoryAxis = this.ageGraph.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "age";
      categoryAxis.renderer.minGridDistance = 40;

      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.title.text="AGE GROUP"
      
      // Axes Title
      let valueAxis = this.ageGraph.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "VISITORS";
      
      
      let series = this.ageGraph.series.push(new am4charts.CurvedColumnSeries());
      series.dataFields.categoryX = "age";
      
      series.dataFields.valueY = "count";
      series.tooltipText = "{count}"
      series.columns.template.strokeOpacity = 0;
      series.clustered = false;
      series.hiddenState.properties.visible = true; // this is added in case legend is used and first series is hidden.
      
      // let series2 = chart.series.push(new am4charts.CurvedColumnSeries());
      // series2.dataFields.categoryX = "country";
      
      // series2.dataFields.valueY = "value2";
      // series2.tooltipText = "{valueY.value}"
      // series2.columns.template.strokeOpacity = 0;
      // series2.clustered = false;
      
      // let series3 = chart.series.push(new am4charts.CurvedColumnSeries());
      // series3.dataFields.categoryX = "country";
      
      // series3.dataFields.valueY = "value3";
      // series3.tooltipText = "{valueY.value}"
      // series3.columns.template.strokeOpacity = 0;
      // series3.clustered = false;
      
      this.ageGraph.cursor = new am4charts.XYCursor();
      this.ageGraph.cursor.maxTooltipDistance = 0;
      
      
      series.dataItems.template.adapter.add("width", (width, target) => {
        return percent(target.valueY / valueAxis.max * 100);
      })
      
      // series2.dataItems.template.adapter.add("width", (width, target) => {
      //   return percent(target.valueY / valueAxis.max * 100);
      // })
      
      // series3.dataItems.template.adapter.add("width", (width, target) => {
      //   return percent(target.valueY / valueAxis.max * 100);
      // })
      
      series.columns.template.events.on("parentset",(event: any) => {
        event.target.zIndex = valueAxis.max - event.target.dataItem.valueY;
      })
      
      // series2.columns.template.events.on("parentset", function(event: any){
      //   event.target.parent = series.columnsContainer;
      //   event.target.zIndex = valueAxis.max - event.target.dataItem.valueY;  
      // })
      
      // series3.columns.template.events.on("parentset", function(event: any){
      //   event.target.parent = series.columnsContainer;
      //   event.target.zIndex = valueAxis.max - event.target.dataItem.valueY;  
      // })

       // label Color Change 

       this.user.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          categoryAxis.renderer.labels.template.fill = color("#fff"); 
          valueAxis.renderer.labels.template.fill = color("#fff"); 
          valueAxis.title.fill = color("#fff");
          categoryAxis.title.fill = color("#fff");
        } else {
          categoryAxis.renderer.labels.template.fill = color("#2B2C2D"); 
          valueAxis.renderer.labels.template.fill = color("#2B2C2D"); 
          valueAxis.title.fill = color("#2B2C2D");
          categoryAxis.title.fill = color("#2B2C2D");
        }
      });
    });
  })
  }



  ageFilter(value): void {
    this.ageFilterObj.emit({
        key: 'ageGroup',
        value: value
    })

    this.agefilter = value;

  }
}
