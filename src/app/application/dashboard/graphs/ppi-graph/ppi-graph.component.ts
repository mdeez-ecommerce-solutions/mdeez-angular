import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  AfterViewInit
} from '@angular/core';
import {
  isPlatformBrowser
} from '@angular/common';
// amCharts imports
import { useTheme, create, Scrollbar,color, percent, Circle,Image } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

useTheme(am4themes_animated);
@Component({
  selector: 'app-ppi-graph',
  templateUrl: './ppi-graph.component.html',
  styleUrls: ['./ppi-graph.component.css']
})
export class PpiGraphComponent implements OnInit, AfterViewInit {
  dataItem: any;
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

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


      let chart = create("ppiChart", am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.logo.disabled = true;
      chart.paddingBottom = 30;

      // chart.data = [{
      //   "name": "Monica",
      //   "steps": 45688,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"
      // }, {
      //   "name": "Joey",
      //   "steps": 35781,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/joey.jpg"
      // }, {
      //   "name": "Ross",
      //   "steps": 25464,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/ross.jpg"
      // }, {
      //   "name": "Phoebe",
      //   "steps": 18788,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg"
      // }, {
      //   "name": "Rachel",
      //   "steps": 15465,
      //   "href": "https://www.amcharts.com/wp-content/uploads/2019/04/rachel.jpg"
      // }];

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.labels.template.dy = 35;
      categoryAxis.renderer.tooltip.dy = 35;
      

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.fillOpacity = 0.8;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.baseGrid.strokeOpacity = 0;

  


      let series = chart.series.push(new am4charts.ColumnSeries);
      series.dataFields.valueY = "steps";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value}";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = -6;
      series.columnsContainer.zIndex = 100;

      let columnTemplate = series.columns.template;
      columnTemplate.width = percent(40);
      columnTemplate.maxWidth = 33;
      columnTemplate.column.cornerRadius(6, 6, 10, 10);
      columnTemplate.strokeOpacity = 0;

      series.heatRules.push({
        target: columnTemplate,
        property: "fill",
        dataField: "valueY",
        min: color("#e5dc36"),
        max: color("#5faa46")
      });
      series.mainContainer.mask = undefined;

      let cursor = new am4charts.XYCursor();
      chart.cursor = cursor;
      cursor.lineX.disabled = true;
      cursor.lineY.disabled = true;
      cursor.behavior = "none";

      let bullet = columnTemplate.createChild(am4charts.CircleBullet);
      bullet.circle.radius = 15;
      bullet.valign = "bottom";
      bullet.align = "center";
      bullet.isMeasured = true;
      // bullet.mouseEnabled = false;
      bullet.verticalCenter = "bottom";
      bullet.interactionsEnabled = false;

      let hoverState = bullet.states.create("hover");
      let outlineCircle = bullet.createChild(Circle);
      outlineCircle.adapter.add("radius", (radius, target: any) => {
        let circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 10;
      })

      let image = bullet.createChild(Image);
      image.width = 60;
      image.height = 60;
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
      image.propertyFields.href = "url";

      image.adapter.add("mask", (mask, target: any) => {
        let circleBullet = target.parent;
        return circleBullet.circle;
      })

      let previousBullet;
      chart.cursor.events.on("cursorpositionchanged", (event) => {
        this.dataItem = series.tooltipDataItem;

        if (this.dataItem.column) {
          let bullet = this.dataItem.column.children.getIndex(1);

          if (previousBullet && previousBullet != bullet) {
            previousBullet.isHover = false;
          }

          if (previousBullet != bullet) {

            let hs = bullet.states.getKey("hover");
            hs.properties.dy = -bullet.parent.pixelHeight + 30;
            bullet.isHover = true;

            previousBullet = bullet;
          }
        }
      })

    // label color
    valueAxis.renderer.labels.template.fill = color("#fff");
      // VAlue Color Change 
      categoryAxis.renderer.labels.template.fill = color("#fff"); 
    });
  })
  }

}