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
import { useTheme, create, Scrollbar,color } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
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
     
    }
  }
  visitorCategoryGraph: any;
  graphDataLoader: boolean;
  @Output() visitorCategoryFilterObj: EventEmitter < any > = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private user: UserService) {
    this.user.graphDataLoader6.subscribe((res) => this.graphDataLoader = res)
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
    this.browserOnly(() => {
      useTheme(am4themes_animated);


      this.visitorCategoryGraph = create("visitorCategoryChart", am4charts.XYChart);
      this.visitorCategoryGraph.padding(40, 40, 40, 40);
      this.visitorCategoryGraph.logo.disabled = true;
      let categoryAxis = this.visitorCategoryGraph.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "_id";
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;
    
     
      let valueAxis = this.visitorCategoryGraph.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.title.text= "NO. OF PEOPLE VISITED";
      let series = this.visitorCategoryGraph.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "_id";
      series.dataFields.valueX = "count";
    //  series.tooltipText = "{valueX.value}"
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
       series.columns.template.tooltipText = "{_id}: [bold]{count}[/]";

      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "left";
      labelBullet.label.dx = 10;
     // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
     labelBullet.label.text = "{values.valueX.workingValue}";
      labelBullet.locationX = 1;
     
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", (fill, target) => {
        return this.visitorCategoryGraph.colors.getIndex(target.dataItem.index);
      });
      series.columns.template.tooltipText = "{_id}: [bold]{count}[/]";

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
  }


  visitorCategoryFilter(value): void {
    this.visitorCategoryFilterObj.emit({
      key: 'visitorCategory',
      value: value
    })
  }

}