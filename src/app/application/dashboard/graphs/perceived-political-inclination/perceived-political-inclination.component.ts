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
import { useTheme, create, Scrollbar,color, percent, Circle, Image } from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { UserService } from 'src/app/core/services/user.service';

useTheme(am4themes_animated);

@Component({
  selector: 'app-perceived-political-inclination',
  templateUrl: './perceived-political-inclination.component.html',
  styleUrls: ['./perceived-political-inclination.component.css']
})
export class PerceivedPoliticalInclinationComponent implements OnInit, AfterViewInit {
  dataItem: any;
  ppifilter: any;
  @Input() perceivedPoliticalInclinationsVar: any;
  graphDataLoader: boolean = true;
  @Output() perceivedFilterObj: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
  private user: UserService) {
    this.user.graphDataLoader.subscribe((res) => this.graphDataLoader = res)
   
  }

  perceivedPoliticalInclination: any;
  @Input() set perceivedPoliticalInclinationData(data) {
    if (data) {
      this.perceivedPoliticalInclination.data = data;
    }
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
     
      this.perceivedPoliticalInclination = create("perceivedPolitical", am4charts.XYChart);
      this.perceivedPoliticalInclination.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.perceivedPoliticalInclination.logo.disabled = true;
      this.perceivedPoliticalInclination.paddingRight = 40;

      //this.perceivedPoliticalInclination.data = [];

let categoryAxis = this.perceivedPoliticalInclination.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "_id";
categoryAxis.renderer.grid.template.strokeOpacity = 0;
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.labels.template.dx = -40;
categoryAxis.renderer.minWidth = 120;
categoryAxis.renderer.tooltip.dx = -40;


let valueAxis = this.perceivedPoliticalInclination.xAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = true;
valueAxis.renderer.labels.template.fillOpacity = 0.3;
valueAxis.renderer.grid.template.strokeOpacity = 0;
valueAxis.min = 0;
valueAxis.cursorTooltipEnabled = false;
valueAxis.renderer.baseGrid.strokeOpacity = 0;
valueAxis.renderer.labels.template.dy = 20;
valueAxis.title.text= "VISITORS";
valueAxis.title.dy=15;

let series = this.perceivedPoliticalInclination.series.push(new am4charts.ColumnSeries());


series.dataFields.valueX = "count";

series.dataFields.categoryY = "_id";
series.tooltipText = "{_id}: {count}";// "{valueX.count}";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.dy = - 30;
series.columnsContainer.zIndex = 100;
series.dataFields.dy=20

let columnTemplate = series.columns.template;
columnTemplate.height = percent(50);
columnTemplate.maxHeight = 50;
columnTemplate.column.cornerRadius(60, 10, 60, 10);
columnTemplate.strokeOpacity = 0;

series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: color("#207cd1"), max: color("#2039d1") });
series.mainContainer.mask = undefined;

let cursor = new am4charts.XYCursor();
this.perceivedPoliticalInclination.cursor = cursor;
cursor.lineX.disabled = true;
cursor.lineY.disabled = true;
cursor.behavior = "none";

let bullet = columnTemplate.createChild(am4charts.CircleBullet);
bullet.circle.radius = 15;
bullet.valign = "middle";
bullet.align = "left";
bullet.isMeasured = true;
bullet.interactionsEnabled = false;
bullet.horizontalCenter = "right";
bullet.interactionsEnabled = false;

let hoverState = bullet.states.create("hover");
let outlineCircle = bullet.createChild(Circle);
outlineCircle.adapter.add("radius", (radius, target: any) => {
    let circleBullet = target.parent;
    return circleBullet.circle.pixelRadius + 6;
})

let image = bullet.createChild(Image);
image.width = 30;
image.height = 30;
image.horizontalCenter = "middle";
image.verticalCenter = "middle";
image.propertyFields.href = "url";

image.adapter.add("mask", (mask, target: any) => {
    let circleBullet = target.parent;
    return circleBullet.circle;
})

let previousBullet;
this.perceivedPoliticalInclination.cursor.events.on("cursorpositionchanged", (event: any) => {
    this.dataItem = series.tooltipDataItem;

    if (this.dataItem.column) {
        let bullet = this.dataItem.column.children.getIndex(1);

        if (previousBullet && previousBullet != bullet) {
            previousBullet.isHover = false;
        }

        if (previousBullet != bullet) {

            let hs = bullet.states.getKey("hover");
            hs.properties.dx = this.dataItem.column.pixelWidth;
            bullet.isHover = true;

            previousBullet = bullet;
        }
    }
});

this.user.themeValueBehavior.subscribe((value) => {
  if (value === "dark") {
    // label color
    categoryAxis.renderer.labels.template.fill = color("#fff");
    valueAxis.renderer.labels.template.fill = color("#fff");
    valueAxis.title.fill = color("#fff");
    categoryAxis.title.fill= color("#fff");
  } else {
    categoryAxis.renderer.labels.template.fill = color("#2B2C2D");
    valueAxis.renderer.labels.template.fill = color("#2B2C2D");
    valueAxis.title.fill =color("#2B2C2D");
    categoryAxis.title.fill= color("#2B2C2D");
  }
});

    });
  })
  }

  
  perceiveFilter(value): void {
   // this.perceivedPoliticalInclination;
    this.perceivedFilterObj.emit({
      key: 'ppi',
      value: value
  })
  this.ppifilter = value;
  }
}