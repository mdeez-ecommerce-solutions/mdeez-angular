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
import { useTheme, create,percent, Scrollbar,color } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import screenfull from 'screenfull';

import {
  UserService
} from 'src/app/core/services/user.service';
useTheme(am4themes_animated);
@Component({
  selector: 'app-visitor-category-graph',
  templateUrl: './visitor-category-graph.component.html',
  styleUrls: ['./visitor-category-graph.component.css']
})
export class VisitorCategoryGraphComponent implements OnInit {
  @Input() visitorCategoriesOptionVar: any;
  @Input() set visitorCategoryData(data) {
    if (data) {
      this.visitorCategoryGraph.data = data;
      if(!this.categoryData){
        this.categoryData = data;
      }
    }
  }
  visitorCategoryGraph: any;
  graphDataLoader: boolean = true;
  categoryfilter: any;
  categoryData;
  @Output() visitorCategoryFilterObj: EventEmitter < any > = new EventEmitter();

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


      this.visitorCategoryGraph = create("visitorCategoryChart",  am4charts.RadarChart);

      this.visitorCategoryGraph.logo.disabled = true;

      // this.visitorCategoryGraph.data = [{
      //   "country": "USA",
      //   "visits": 2025
      // }, {
      //   "country": "China",
      //   "visits": 1882
      // }, {
      //   "country": "Japan",
      //   "visits": 1809
      // }, {
      //   "country": "Germany",
      //   "visits": 1322
      // }, {
      //   "country": "UK",
      //   "visits": 1122
      // }, {
      //   "country": "France",
      //   "visits": 1114
      // }, {
      //   "country": "India",
      //   "visits": 984
      // }, {
      //   "country": "Spain",
      //   "visits": 711
      // }, {
      //   "country": "Netherlands",
      //   "visits": 665
      // }, {
      //   "country": "Russia",
      //   "visits": 580
      // }, {
      //   "country": "South Korea",
      //   "visits": 443
      // }, {
      //   "country": "Canada",
      //   "visits": 441
      // }];

      this.visitorCategoryGraph.innerRadius = percent(40)

      let categoryAxisH = this.visitorCategoryGraph.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      categoryAxisH.renderer.grid.template.location = 0;
      categoryAxisH.dataFields.category = "_id";
      categoryAxisH.renderer.minGridDistance = 60;
      categoryAxisH.renderer.inversed = true;
      categoryAxisH.renderer.labels.template.location = 0.5;
      categoryAxisH.renderer.grid.template.strokeOpacity = 0.08;
      categoryAxisH.renderer.grid.template.stroke = color("#fff");
      categoryAxisH.renderer.tooltip.disabled = true;


      let valueAxisH = this.visitorCategoryGraph.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());
      valueAxisH.min = 0;
      valueAxisH.extraMax = 0.1;
      valueAxisH.renderer.grid.template.strokeOpacity = 0.08;
      valueAxisH.renderer.grid.template.stroke = color("#fff");
      valueAxisH.renderer.labels.template.disabled = true;
      // valueAxisH.title.text= "VISITORS";


      this.visitorCategoryGraph.seriesContainer.zIndex = -10;

      let labelTemplate = categoryAxisH.renderer.labels.template;

      labelTemplate.fill = color("#fff");
      labelTemplate.fontSize = 12;

      let seriesH = this.visitorCategoryGraph.series.push(new am4charts.RadarColumnSeries());
   
      seriesH.dataFields.categoryX = "_id";
      seriesH.dataFields.valueY = "count";
      seriesH.tooltipText = "{_id}: [bold]{count}[/]"
      seriesH.columns.template.strokeOpacity = 0;
      seriesH.columns.template.radarColumn.cornerRadius = 5;
      seriesH.columns.template.radarColumn.innerCornerRadius = 0;
      seriesH.columns.template.stroke = color("#fff");

      // this.visitorCategoryGraph.zoomOutButton.disabled = true;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      seriesH.columns.template.adapter.add("fill", (fill, target) => {
        return this.visitorCategoryGraph.colors.getIndex(target.dataItem.index);
      });

      categoryAxisH.sortBySeries = seriesH;

      this.visitorCategoryGraph.cursor = new am4charts.RadarCursor();
      // this.visitorCategoryGraph.cursor.behavior = "none";
      // this.visitorCategoryGraph.cursor.lineX.disabled = true;
      // this.visitorCategoryGraph.cursor.lineY.disabled = true;

      this.user.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          valueAxisH.renderer.labels.template.fill = color("#fff");
          categoryAxisH.renderer.labels.template.fill = color("#fff");
          valueAxisH.title.fill = color("#fff");
    categoryAxisH.title.fill= color("#fff");
        } else {
          valueAxisH.renderer.labels.template.fill = color("#2B2C2D");
          categoryAxisH.renderer.labels.template.fill = color("#2B2C2D");
          valueAxisH.title.fill = color("#2B2C2D");
    categoryAxisH.title.fill=  color("#2B2C2D");
        }
      });




      let labelBullet = seriesH.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "left";
      labelBullet.label.dx = 10;
     // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
     labelBullet.label.text = "{values.valueX.workingValue}";
      labelBullet.locationX = 1;
     
      // // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      // series.columns.template.adapter.add("fill", (fill, target) => {
      //   return this.visitorCategoryGraph.colors.getIndex(target.dataItem.index);
      // });
      // series.columns.template.tooltipText = "{_id}: [bold]{count}[/]";

  
      this.visitorCategoryGraph.data = [];
    });
  })
  }

  toggleFullScreen(codePart: HTMLElement) {
    if (screenfull.isEnabled) {
      screenfull.toggle(codePart);
    }
  }


  visitorCategoryFilter(value): void {
    this.visitorCategoryFilterObj.emit({
      key: 'visitorCategory',
      value: value
    })
    this.categoryfilter = value;
  }

}