import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  AfterViewInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import {
  isPlatformBrowser
} from '@angular/common';
// amCharts imports
import { useTheme,percent, create, Scrollbar,color } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {
  UserService
} from 'src/app/core/services/user.service';
useTheme(am4themes_animated);

@Component({
  selector: 'app-visitor-occupation-graph',
  templateUrl: './visitor-occupation-graph.component.html',
  styleUrls: ['./visitor-occupation-graph.component.css']
})
export class VisitorOccupationGraphComponent implements OnInit {
  @Input() visitorOccupationOptionVar: any;
  @Input() set visitorOccupationData(data) {
    if (data) {
      this.visitorCategoryGraph.data = data;
      console.log(data);
     if(this.visitorCategoryGraph.data.length > 5 ){

     // this.visitorCategoryGraph.scrollbarY = new am4charts.XYChartScrollbar();
      // this.visitorCategoryGraph.scrollbarY = new Scrollbar();
    }
    
    }
  }
  visitorCategoryGraph: any;
  graphDataLoader: boolean = true;
  occupationfilter: any;
  @Output() visitorOccupationFilterObj: EventEmitter < any > = new EventEmitter();

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
    // Chart code goes in here
    setTimeout(() => {

    this.browserOnly(() => {
      useTheme(am4themes_animated);


      this.visitorCategoryGraph = create("visitorOccupationChart", am4charts.XYChart);

      this.visitorCategoryGraph.logo.disabled = true;
      let categoryAxis = this.visitorCategoryGraph.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "_id";
      categoryAxis.renderer.minGridDistance = 0;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.fontSize = 12;


     
     // this.visitorCategoryGraph.scrollbarY.series.push(categoryAxis);
      //this.visitorCategoryGraph.scrollbarY.width= 5;
      // this.visitorCategoryGraph.scrollbarY = new Scrollbar();
      //       this.visitorCategoryGraph.scrollbarY.parent = this.visitorCategoryGraph.bottomAxesContainer;
    
     
      let valueAxis = this.visitorCategoryGraph.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      // valueAxis.renderer.minGridDistance = 50;

      valueAxis.title.text= "VISITORS";
      let series = this.visitorCategoryGraph.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "_id";
      series.dataFields.valueX = "count";
      series.tooltipText = "{valueX.workingValue}";
      series.columns.template.height = 5;
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      console.log(valueAxis);

      //  this.visitorCategoryGraph.scrollbarX = new am4charts.XYChartScrollbar();
      //  this.visitorCategoryGraph.scrollbarX.series.push(series);

    //   let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    //   labelBullet.label.horizontalCenter = "left";
    //   labelBullet.label.dx = 10;
    //  // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    // //  labelBullet.label.text = "{values.valueX.workingValue}";
    //   labelBullet.locationX = 1;

    let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.as')}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.fill = color("#fff");
    labelBullet.label.fontSize = 11;
    labelBullet.label.dx = 14;
    labelBullet.label.dy = 1;



      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", (fill, target) => {
        return this.visitorCategoryGraph.colors.getIndex(target.dataItem.index);
      });


      this.user.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          valueAxis.renderer.labels.template.fill = color("#fff");
          categoryAxis.renderer.labels.template.fill = color("#fff");
          valueAxis.title.fill = color("#fff");
    categoryAxis.title.fill= color("#fff");
        } else {
          valueAxis.renderer.labels.template.fill = color("#2B2C2D");
          categoryAxis.renderer.labels.template.fill = color("#2B2C2D");
          valueAxis.title.fill = color("#2B2C2D");
    categoryAxis.title.fill=  color("#2B2C2D");
        }
      });


      categoryAxis.sortBySeries = series;
      this.visitorCategoryGraph.data = [];
    });
  })
  }


  visitorCategoryFilter(value): void {
    this.visitorOccupationFilterObj.emit({
      key: 'occupation',
      value: value
    })
    this.occupationfilter = value;
    console.log("OCCU",value);
  }

}
