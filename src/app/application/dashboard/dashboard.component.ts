import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnChanges,
  HostListener,
} from "@angular/core";
import {
  isPlatformBrowser
} from "@angular/common";
import moment from 'moment';
// amCharts imports

import { useTheme, create, Scrollbar,color,percent, type, array, Label, Circle, ZoomOutButton, DataSource } from '@amcharts/amcharts4/core';
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { environment } from '../../../environments/environment';
import {
  FormGroup,
  FormControl
} from "@angular/forms";
import {
  UserService
} from "src/app/core/services/user.service";
import {
  MatSnackBar
} from "@angular/material/snack-bar";
import {
  MatTableDataSource
} from "@angular/material/table";
import {
  MatPaginator, PageEvent
} from "@angular/material/paginator";

import am4geodata_indiaHigh from "@amcharts/amcharts4-geodata/indiaHigh";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Router
} from "@angular/router";
import { saveAs } from 'file-saver';
import {
  toBase64String
} from "@angular/compiler/src/output/source_map";

/* Chart code */
// Themes begin
useTheme(am4themes_animated);
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnChanges {
  purposes: any;
  exportVisitorListFileName = "VisitorVisit.xlsx";
  pageEvent: PageEvent;
  pageLength:any;
  visitorOccupationOption:any;

  range = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  visitorLists: any;
  exportList: any = [];
  displayedColumns: string[] = [
    "S.No.",
    "Unique Visitor ID",
    "Visitor_Name",
    "Address",
    "Date",
    "enrollmentDate",
    "Mobile",
    "Purpose_of_Visit",
    "Status",
    "Visitor_Category",
    "Total_no_of_Visits",
    "Remarks",
    "politicalInformationRemarks",
    "refrenceName",
    "refrenceMobile",
    "refrenceRemark",
    "accompliceName",
    "accompliceMobile",
    "accompliceRemark",    
    "captureDetailsOfAnyAccompliceWithTheVisitor",
    // "Thank_You_Acknowledgment_message_sent",
    // "Information_sent_to_the_booth_village_coordinator_of_the_visitor",
    "Action",
  ];
  dataSource: any;
  rangeDate: any;
  filterInitial = "";
  filterValue: any;
  anlyticData: any;
  isLoadingResults: boolean;
  castes = [];
  perceivedPoliticalInclinationsOption = [];
  visitorCategoriesOption = [];
  whomVisitorMeetsOption = [];
  meetingLocationsOption = [];
  statePolygonForGeo: any;
  visitorAreaData:any;
  purposeGraph: any;
  genderGraph: any;
  casteGraph: any;
  visitorCategoryData: any;
  visitorOccupatioData:any;
  ageGraphData: any;
  perceivedPoliticalInclinationData: any;
  meetingLocationGraphData: any;
  timeFrameGraphData: any;
  timeFrameXText?:any ;
  whomVisitorMeetGraphData: any;
  meetingStatusGraphData: any;
  graphDataLoader: boolean;
  graphDataLoader1: boolean;
  graphDataLoader2: boolean;
  graphDataLoader3: boolean;
  viewGraphresetBtn: boolean;
  geodata: any;
  geodata1:any;
  filteredVisitorCount: any;
  visitorListsTotalLength: any;
  pageIndexOfListingTable: any;
  filterKeyword: any;
  isLoaderHappen: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  samajwadiPartyGraphData:any;
  exportAllDataVar:any;
  baseApiUrl:any;
  appliedFilters = {}
  authData
  adminRole=environment.ADMIN_ROLE
  editorRole=environment.EDITOR_ROLE
  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.authData = JSON.parse(localStorage.getItem("SignInUserData"));

    // this.userService.graphDataLoader.subscribe(
    //   (res) => (this.graphDataLoader = res)
    // );
    this.userService.isLoadingVisitorList.subscribe((res) => this.isLoaderHappen = res);
    this.baseApiUrl = environment.api_base_url +'/visitor/download-csv?limit=100000';
 
  }

  ngOnInit(): void {
    
    this.getFilterMeetStatus()
    // this.getFilterArea()
    // this.getFilterDistrictConstituency()
    // this.getFilterAgeGroup()
    // this.getFilterMeetLocation()
    // this.getFilterIsSamjawadi()
    // this.getFilterGender()
    // this.getFilterCaste()
    // this.getFilterOccupation()
    // this.getFilterPpi()
    this.getFilterPurpose()
    // this.getFilterTimeFrame()
    // this.getFilterVisitorCategory()
    // this.getFilterVisitorMeet()
    this.getVisitorList(1);
    // this.rangeSelection();
    // this.getVisitorPurposeOptionData();
   // this.getCasteOptionData();
   // this.getVisitorPoliticalInclinationOptionData();
   // this.getVisitorCategoryOptionData();
    //this.getWhomToMeetOptionData();
   // this.getVisitorLocationOfMeetingOptionData();
    this.getVisitAnalyticData();
   this.getVisitorOccupationData();

    // Graph Data Calling
    // this.getVisitAnalyticGraphData();

  }
  openInNewTab() {
   // this._snackBar.open("Please wait while we are downloading your data..");
    this.isLoaderHappen = false;
    this._snackBar.open("Please wait while we are downloading your data..", "", {
      duration: 5000,
    });
    // console.log("this.isLoaderHappen", this.isLoaderHappen);
    // this.userService.download(this.baseApiUrl)
    //   .subscribe(blob => {saveAs(blob, 'VisitorList')
    //   this._snackBar.dismiss();});
    // FileSaver.saveAs(this.baseApiUrl, 'VisitorList');
    window.open(this.baseApiUrl, '_blank');
   //window.open(this.baseApiUrl,'MyWindow','width=600,height=300'); return false;
   }
 
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.ngOnChanges();
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
    this.browserOnly(() => {
     
      useTheme(am4themes_animated);
    //  this.geoMapDistrict();
      // Create geomap :AC instance
      let chart = create("geoMap", am4maps.MapChart);
      chart.logo.disabled = true;
      chart.maxZoomLevel = 64;

      chart.geodata = am4geodata_indiaHigh;
      // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]

      // Set projection
      chart.projection = new am4maps.projections.Projection();

      // Add button
      let zoomOut = chart.tooltipContainer.createChild(ZoomOutButton);
      zoomOut.align = "right";
      zoomOut.valign = "top";
      zoomOut.margin(20, 20, 20, 20);
      zoomOut.events.on("hit", function () {
        if (currentSeries) {
          currentSeries.hide();
        }
        chart.goHome();
        zoomOut.hide();
        currentSeries = regionalSeries.IN.series;
        currentSeries.show();
      });
      zoomOut.hide();

      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;
      polygonSeries.calculateVisualCenter = true;

      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = chart.colors.getIndex(9);
      //shantam 
      polygonSeries.include = ["IN-DL"];
      chart.events.on("ready", loadStores);
      //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      this.geodata = chart.series.push(new am4maps.MapImageSeries());
      // let imageSeriesTemplate = imageSeries.mapImages.template;
      let imageSeriesTemplate = this.geodata.mapImages.template;
      let circle = imageSeriesTemplate.createChild(Circle);
      circle.radius = 5;
     // circle.fill = color("#B27799");
      circle.fill = color("#ed3833");
      circle.stroke = color("#FFFFFF");
      circle.strokeWidth = 2;
      circle.nonScaling = true;
      circle.tooltipText = "{constituency}";
      imageSeriesTemplate.propertyFields.latitude = "latitude";
      imageSeriesTemplate.propertyFields.longitude = "longitude";

      imageSeriesTemplate.tooltipText = "{constituency}: {count}";

      function loadStores() {
        let loader = new DataSource();
        loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
        loader.events.on("parseended", (ev: any) => {
          setupStores(ev.target.data);
        });
        loader.load();
      }

      // Creates a series
      function createSeries(heatfield) {
        let series = chart.series.push(new am4maps.MapImageSeries());
        series.dataFields.value = heatfield;

        let template = series.mapImages.template;
        template.verticalCenter = "middle";
        template.horizontalCenter = "middle";
        template.propertyFields.latitude = "lat";
        template.propertyFields.longitude = "long";
        template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
        // template.dataItem

        let circle = template.createChild(Circle);
        circle.radius = 10;
        circle.fillOpacity = 0.7;
        circle.verticalCenter = "middle";
        circle.horizontalCenter = "middle";
        circle.nonScaling = true;

        let label = template.createChild(Label);
        label.text = "{stores}";
        label.fill = color("#fff");
        label.verticalCenter = "middle";
        label.horizontalCenter = "middle";
        label.nonScaling = true;

        let heat = series.heatRules.push({
          target: circle,
          property: "radius",
          min: 10,
          max: 30
        });

        // Set up drill-down
        series.mapImages.template.events.on("hit", (ev: any) => {

          // Determine what we've clicked on
          let data = ev.target.dataItem.dataContext;

          // No id? Individual store - nothing to drill down to further
          if (!data.target) {
            return;
          }

          // Create actual series if it hasn't been yet created
          if (!regionalSeries[data.target].series) {
            regionalSeries[data.target].series = createSeries("count");
            regionalSeries[data.target].series.data = data.markerData;
          }

          // Hide current series
          if (currentSeries) {
            currentSeries.hide();
          }

          // Control zoom
          if (data.type == "state") {
            let statePolygon = polygonSeries.getPolygonById("IN-DL");
            chart.zoomToMapObject(statePolygon);
          } else if (data.type == "city") {
            chart.zoomToGeoPoint({
              latitude: data.lat,
              longitude: data.long
            }, 64, true);
          }
          zoomOut.show();

          // Show new targert series
          currentSeries = regionalSeries[data.target].series;
          currentSeries.show();
        });
    // console.log("series",series)
        return series;
      }

      let regionalSeries: any = {};
      let currentSeries;

      function setupStores(data) {
        // console.log("data 1 ",data)
        // console.log("regionalSeries ",regionalSeries)

        // Init country-level series
        regionalSeries.IN = {
          markerData: [],
          series: createSeries("stores")
        };

        // Set current series
        currentSeries = regionalSeries.IN.series;
        // console.log("currentSeries ",currentSeries)

        // Process data
        array.each(data.query_results, (data: any) => {

        //  console.log("data 2 ",data)
          // Get store data
          let store = {
            state: data.MAIL_ST_PROV_C,
            long: type.toNumber(data.LNGTD_I),
            lat: type.toNumber(data.LATTD_I),
            location: data.co_loc_n,
            city: data.mail_city_n,
            count: type.toNumber(data.count)
          };

          // Process state-level data
          if (regionalSeries[store.state] == undefined) {
            let statePolygonForGeo: any = polygonSeries.getPolygonById("IN-" + store.state);
            if (statePolygonForGeo) {
                // console.log("statePolygonForGeo", statePolygonForGeo)
              // Add state data
              regionalSeries[store.state] = {
                target: store.state,
                type: "state",
                name: statePolygonForGeo.dataItem.dataContext.name,
                count: store.count,
                stores: 1,
                lat: statePolygonForGeo.visualLatitude,
                long: statePolygonForGeo.visualLongitude,
                state: store.state,
                markerData: []
              };
              regionalSeries.IN.markerData.push(regionalSeries[store.state]);

            } else {
              // State not found
              return;
            }
          } else {

            regionalSeries[store.state].stores++;
            regionalSeries[store.state].count += store.count;
            // console.log("regionalSeries[store.state].stores ",regionalSeries[store.state].stores)

          }

          // Process city-level data
          if (regionalSeries[store.city] == undefined) {
            regionalSeries[store.city] = {
              target: store.city,
              type: "city",
              name: store.city,
              count: store.count,
              stores: 1,
              lat: store.lat,
              long: store.long,
              state: store.state,
              markerData: []
            };
            regionalSeries[store.state].markerData.push(regionalSeries[store.city]);
          } else {
            regionalSeries[store.city].stores++;
            regionalSeries[store.city].count += store.count;
            // console.log("regionalSeries[store.city].stores ",regionalSeries[store.city].stores)

          }

          // Process individual store
          regionalSeries[store.city].markerData.push({
            name: store.location,
            count: store.count,
            stores: 1,
            lat: store.lat,
            long: store.long,
            state: store.state
          });

        });

        regionalSeries.IN.series.data = regionalSeries.IN.markerData;
        // console.log("regionalSeries.IN.series.data",regionalSeries.IN.series.data)

      }

      // Chart for geo district
       //Graph Geo Map District
            // Create map instance
            let chartGeo = create("geoMap1", am4maps.MapChart);
            chartGeo.logo.disabled = true;
            chartGeo.maxZoomLevel = 64;
      
            chartGeo.geodata = am4geodata_indiaHigh;
            // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]
      
            // Set projection
            chartGeo.projection = new am4maps.projections.Projection();
      
            // Add button
            let zoomOut1 = chartGeo.tooltipContainer.createChild(ZoomOutButton);
            zoomOut1.align = "right";
            zoomOut1.valign = "top";
            zoomOut1.margin(20, 20, 20, 20);
            zoomOut1.events.on("hit", function () {
              if (currentSeries1) {
                currentSeries1.hide();
              }
              chartGeo.goHome();
              zoomOut1.hide();
              currentSeries1 = regionalSeries1.IN.series;
              currentSeries1.show();
            });
            zoomOut1.hide();
      
            // Create map polygon series
            let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
            polygonSeries1.useGeodata = true;
            polygonSeries1.calculateVisualCenter = true;
      
            // Configure series
            let polygonTemplate1 = polygonSeries1.mapPolygons.template;
            polygonTemplate1.tooltipText = "{district}";
            polygonTemplate1.fill = chartGeo.colors.getIndex(0);
            //shantam 
            polygonSeries1.include = ["IN-DL"];
            chartGeo.events.on("ready", loadStores1);
            //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
            this.geodata1 = chartGeo.series.push(new am4maps.MapImageSeries());
            // let imageSeriesTemplate = imageSeries.mapImages.template;
            let imageSeriesTemplate1 = this.geodata1.mapImages.template;
            let circle1 = imageSeriesTemplate1.createChild(Circle);
            circle1.radius = 5;
            // circle1.fill = color("#B27799");
             circle1.fill = color("#ed3833");
             circle1.stroke = color("#FFFFFF");
             circle1.strokeWidth = 2;
            circle1.nonScaling = true;
            circle1.tooltipText = "{district}";
            imageSeriesTemplate1.propertyFields.latitude = "Latitude";
            imageSeriesTemplate1.propertyFields.longitude = "Longitude";
      
            imageSeriesTemplate1.tooltipText = "{district}: {count}";
            // circle1.tooltipText = "{constituency}";
            // imageSeriesTemplate1.propertyFields.latitude = "latitude";
            // imageSeriesTemplate1.propertyFields.longitude = "longitude";
      
            // imageSeriesTemplate1.tooltipText = "{constituency}: {count}";

      
            function loadStores1() {
              let loader = new DataSource();
              loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
              loader.events.on("parseended", (ev: any) => {
                setupStores1(ev.target.data);
              });
              loader.load();
            }
      
            // Creates a series
            function createSeries1(heatfield) {
              let series = chartGeo.series.push(new am4maps.MapImageSeries());
              series.dataFields.value = heatfield;
      
              let template = series.mapImages.template;
              template.verticalCenter = "middle";
              template.horizontalCenter = "middle";
              template.propertyFields.latitude = "lat";
              template.propertyFields.longitude = "long";
              template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
              // template.dataItem
      
              let circle = template.createChild(Circle);
              circle.radius = 10;
              circle.fillOpacity = 0.7;
              circle.verticalCenter = "middle";
              circle.horizontalCenter = "middle";
              circle.nonScaling = true;
      
              let label = template.createChild(Label);
              label.text = "{stores}";
              label.fill = color("#fff");
              label.verticalCenter = "middle";
              label.horizontalCenter = "middle";
              label.nonScaling = true;
      
              let heat = series.heatRules.push({
                target: circle,
                property: "radius",
                min: 10,
                max: 30
              });
      
              // Set up drill-down
              series.mapImages.template.events.on("hit", (ev: any) => {
      
                // Determine what we've clicked on
                let data = ev.target.dataItem.dataContext;
      
                // No id? Individual store - nothing to drill down to further
                if (!data.target) {
                  return;
                }
      
                // Create actual series if it hasn't been yet created
                if (!regionalSeries1[data.target].series) {
                  regionalSeries1[data.target].series = createSeries1("count");
                  regionalSeries1[data.target].series.data = data.markerData;
                }
      
                // Hide current series
                if (currentSeries1) {
                  currentSeries1.hide();
                }
      
                // Control zoom
                if (data.type == "state") {
                  let statePolygon = polygonSeries1.getPolygonById("IN-PB");
                  chartGeo.zoomToMapObject(statePolygon);
                } else if (data.type == "city") {
                  chartGeo.zoomToGeoPoint({
                    latitude: data.lat,
                    longitude: data.long
                  }, 64, true);
                }
                zoomOut1.show();
      
                // Show new targert series
                currentSeries1 = regionalSeries1[data.target].series;
                currentSeries1.show();
              });
      
              return series;
            }
      
            let regionalSeries1: any = {};
            let currentSeries1;
      
            function setupStores1(data) {
      
              // Init country-level series
              regionalSeries1.IN = {
                markerData: [],
                series: createSeries1("stores")
              };
      
              // Set current series
              currentSeries1 = regionalSeries1.IN.series;
      
              // Process data
              array.each(data.query_results, (data: any) => {
      
      
                // Get store data
                let store = {
                  state: data.MAIL_ST_PROV_C,
                  long: type.toNumber(data.LNGTD_I),
                  lat: type.toNumber(data.LATTD_I),
                  location: data.co_loc_n,
                  city: data.mail_city_n,
                  count: type.toNumber(data.count)
                };
      
                // Process state-level data
                if (regionalSeries1[store.state] == undefined) {
                  let statePolygonForGeo: any = polygonSeries1.getPolygonById("IN-" + store.state);
                  if (statePolygonForGeo) {
                    // console.log("statePolygonForGeo",statePolygonForGeo)
                    // Add state data
                    regionalSeries1[store.state] = {
                      target: store.state,
                      type: "state",
                      name: statePolygonForGeo.dataItem.dataContext.name,
                      count: store.count,
                      stores: 1,
                      lat: statePolygonForGeo.visualLatitude,
                      long: statePolygonForGeo.visualLongitude,
                      state: store.state,
                      markerData: []
                    };
                    regionalSeries1.IN.markerData.push(regionalSeries1[store.state]);
      
                  } else {
                    // State not found
                    return;
                  }
                } else {
                  regionalSeries1[store.state].stores++;
                  regionalSeries1[store.state].count += store.count;
                }
      
                // Process city-level data
                if (regionalSeries1[store.city] == undefined) {
                  regionalSeries1[store.city] = {
                    target: store.city,
                    type: "city",
                    name: store.city,
                    count: store.count,
                    stores: 1,
                    lat: store.lat,
                    long: store.long,
                    state: store.state,
                    markerData: []
                  };
                  regionalSeries1[store.state].markerData.push(regionalSeries1[store.city]);
                } else {
                  regionalSeries1[store.city].stores++;
                  regionalSeries1[store.city].count += store.count;
                }
      
                // Process individual store
                regionalSeries1[store.city].markerData.push({
                  name: store.location,
                  count: store.count,
                  stores: 1,
                  lat: store.lat,
                  long: store.long,
                  state: store.state
                });
      
              });
      
              regionalSeries1.IN.series.data = regionalSeries1.IN.markerData;
            }
      

      // Chart for PURPOSE
      this.purposeGraph = create("purpose", am4charts.PieChart);
      this.purposeGraph.logo.disabled = true;
      // Add data
      this.purposeGraph.data = [];
      // Add and configure Series
      let pieSeries = this.purposeGraph.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "_id";
      pieSeries.innerRadius = percent(50);
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;


      this.purposeGraph.legend = new am4charts.Legend();
      this.purposeGraph.legend.position = "right";

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          this.purposeGraph.legend.labels.template.fill = color("#fff");
          this.purposeGraph.legend.valueLabels.template.fill = color(
            "#fff"
          );
        } else {
          this.purposeGraph.legend.labels.template.fill = color(
            "#2B2C2D"
          );
          this.purposeGraph.legend.valueLabels.template.fill = color(
            "#2B2C2D"
          );
        }
      });

      // Chart for gender
      this.genderGraph = create("gender", am4charts.PieChart);
      this.genderGraph.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.genderGraph.logo.disabled = true;
      this.genderGraph.data = [];
      this.genderGraph.radius = percent(70);
      this.genderGraph.innerRadius = percent(40);
      this.genderGraph.startAngle = 180;
      this.genderGraph.endAngle = 360;

      let genderSeries = this.genderGraph.series.push(
        new am4charts.PieSeries()
      );

      genderSeries.dataFields.value = "count";
      genderSeries.dataFields.category = "_id";

      genderSeries.slices.template.cornerRadius = 10;
      genderSeries.slices.template.innerCornerRadius = 7;
      genderSeries.slices.template.draggable = false;
      genderSeries.slices.template.inert = true;
      genderSeries.alignLabels = false;

      genderSeries.hiddenState.properties.startAngle = 90;
      genderSeries.hiddenState.properties.endAngle = 90;

      genderSeries.labels.template.disabled = true;

      genderSeries.colors.list = [
        color("#1f3ad1"),
        color("#439757"),
      ];

      this.genderGraph.legend = new am4charts.Legend();

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          this.genderGraph.legend.labels.template.fill = color("#fff");
          this.genderGraph.legend.valueLabels.template.fill = color(
            "#fff"
          );
        } else {
          this.genderGraph.legend.labels.template.fill = color(
            "#2B2C2D"
          );
          this.genderGraph.legend.valueLabels.template.fill = color(
            "#2B2C2D"
          );
        }
      });

      // Chart for TIME FRAME
      this.timeFrameGraphData = create("timeFrame", am4charts.XYChart);
      this.timeFrameGraphData.logo.disabled = true;
      // timeFrame.scrollbarX = new Scrollbar();

      // Add data
      this.timeFrameGraphData.data = [];

       this.timeFrameXText = this.timeFrameGraphData.xAxes.push(
        new am4charts.CategoryAxis()
      );
      this.timeFrameXText.dataFields.category = "_id";
      this.timeFrameXText.renderer.grid.template.location = 0;
      this.timeFrameXText.renderer.minGridDistance = 30;
      this.timeFrameXText.title.text = "NO. OF MONTHS";

      // this.timeFrameXText.renderer.labels.template.events.on("over", function(ev) {
      //   var point = this.timeFrameXText?.categoryToPoint(ev.target.dataItem.category);
      //   this.timeFrameGraphData.cursor.triggerMove(point, "soft");
      // });
      
      this.timeFrameXText?.renderer.labels.template.events.on("out", function(ev) {
        if(this.timeFrameXText){
          var point = this.timeFrameXText?.categoryToPoint(ev.target.dataItem.category);
          this.timeFrameGraphData.cursor.triggerMove(point, "none");
        }
      });
     

      let valueAxis = this.timeFrameGraphData.yAxes.push(
        new am4charts.ValueAxis()
      );
      valueAxis.title.text = "NO. OF PEOPLE VISITED";
      //valueAxis.integersOnly = true;
      valueAxis.tooltip.disabled = true;
      // Create series
      let timeFrameSeries = this.timeFrameGraphData.series.push(
        new am4charts.ColumnSeries()
      );
      timeFrameSeries.dataFields.valueY = "count";
      timeFrameSeries.dataFields.categoryX = "_id";
      timeFrameSeries.name = "count";
   
      
      timeFrameSeries.columns.template.tooltipText =
        "{categoryX}: [bold]{valueY}[/]";
      this.timeFrameGraphData.cursor = new am4charts.XYCursor();
      this.timeFrameGraphData.cursor.lineY.disabled = true;
      this.timeFrameGraphData.cursor.lineX.disabled = true;
      
       
      timeFrameSeries.columns.template.fill = color("#203ad1");

      let columnTemplate = timeFrameSeries.columns.template;
      columnTemplate.strokeWidth = 0;
      columnTemplate.strokeOpacity = 0;
   
      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          this.timeFrameXText.renderer.labels.template.fill = color("#fff");
          valueAxis.renderer.labels.template.fill = color("#fff");
          valueAxis.title.fill = color("#fff");
          this.timeFrameXText.title.fill = color("#fff");
        } else {
          this.timeFrameXText.renderer.labels.template.fill = color("#2B2C2D");
          valueAxis.renderer.labels.template.fill = color("#2B2C2D");
          valueAxis.title.fill = color("#2B2C2D");
          this.timeFrameXText.title.fill = color("#2B2C2D");
        }
      });
      // let label = this.timeFrameXText.renderer.labels.template;
      // label.truncate = true;
      // label.maxWidth = 120;

      // Create CAST chart instance
      this.casteGraph = create("caste", am4charts.XYChart);
      this.casteGraph.logo.disabled = true;
      // Add data
      this.casteGraph.data = [];

      // this.casteGraph.responsive.enabled = true;
      // Create axes

      let casteCategoryAxis = this.casteGraph.xAxes.push(
        new am4charts.CategoryAxis()
      );
      casteCategoryAxis.dataFields.category = "_id";
      casteCategoryAxis.renderer.grid.template.location = 0;
      casteCategoryAxis.renderer.minGridDistance = 30;
      casteCategoryAxis?.renderer.labels.template.events.on("out", function(ev) {
        if(casteCategoryAxis){
          var point = casteCategoryAxis?.categoryToPoint(ev.target.dataItem.category);
          casteCategoryAxis.cursor.triggerMove(point, "none");
        }
      });

      // let label = this.timeFrameXText.renderer.labels.template;
      // label.truncate = true;
      // label.maxWidth = 120;

      // casteCategoryAxis.renderer.labels.template.adapter.add(
      //   "dy",
      //   (dy, target) => {
      //     if (target.dataItem && target.dataItem.index && 2 == 2) {
      //       return dy + 25;
      //     }
      //     return dy;
      //   }
      // );
      casteCategoryAxis.title.text = "VISITOR CASTE CATEGORY";
      let casteValueAxis = this.casteGraph.yAxes.push(
        new am4charts.ValueAxis()
      );
      casteValueAxis.title.text = "NO. OF PEOPLE VISITED";
      casteValueAxis.tooltip.disabled = true;
      // Create series
      let casteSeries = this.casteGraph.series.push(
        new am4charts.ColumnSeries()
      );
      casteSeries.dataFields.valueY = "count";
      casteSeries.dataFields.categoryX = "_id";
      casteSeries.name = "count";
      casteSeries.columns.template.tooltipText =
        "{categoryX}: [bold]{valueY}[/]";
      casteSeries.columns.template.fill = color("#5C3DCE");

      casteSeries.columns.template.width = percent(10);

      this.casteGraph.cursor = new am4charts.XYCursor();
      this.casteGraph.cursor.lineY.disabled = true;
      this.casteGraph.cursor.lineX.disabled = true;

      let casteColumnTemplate = casteSeries.columns.template;
      casteColumnTemplate.strokeWidth = 0;
      casteColumnTemplate.strokeOpacity = 0;

      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          casteCategoryAxis.renderer.labels.template.fill = color(
            "#fff"
          );
          casteValueAxis.renderer.labels.template.fill = color("#fff");
          casteValueAxis.title.fill = color("#fff");
          casteCategoryAxis.title.fill = color("#fff");
        } else {
          casteCategoryAxis.renderer.labels.template.fill = color(
            "#2B2C2D"
          );
          casteValueAxis.renderer.labels.template.fill = color(
            "#2B2C2D"
          );
          casteValueAxis.title.fill = color("#2B2C2D");
          casteCategoryAxis.title.fill = color("#2B2C2D");
        }
      });
    });
  }

  

  getCasteOptionData() {
    this.userService.getCasteOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.castes = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
  getVisitorOccupationData(){
    this.userService.getVisitorOccupation().subscribe(
      (response: any) => {
        if (response.error === false) {
          console.log(response.data)
          this.visitorOccupationOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
  geoMapDistrict(){
    //Graph Geo Map District
            // Create map instance
            let chartGeo = create("geoMap1", am4maps.MapChart);
            chartGeo.logo.disabled = true;
            chartGeo.maxZoomLevel = 64;
            // console.log("dfgh")
            chartGeo.geodata = am4geodata_indiaHigh;
            // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]
      
            // Set projection
            chartGeo.projection = new am4maps.projections.Projection();
      
            // Add button
            let zoomOut1 = chartGeo.tooltipContainer.createChild(ZoomOutButton);
            zoomOut1.align = "right";
            zoomOut1.valign = "top";
            zoomOut1.margin(20, 20, 20, 20);
            zoomOut1.events.on("hit", function () {
              if (currentSeries1) {
                currentSeries1.hide();
              }
              chartGeo.goHome();
              zoomOut1.hide();
              currentSeries1 = regionalSeries1.IN.series;
              currentSeries1.show();
            });
            zoomOut1.hide();
      
            // Create map polygon series
            let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
            polygonSeries1.useGeodata = true;
            polygonSeries1.calculateVisualCenter = true;
      
            // Configure series
            let polygonTemplate1 = polygonSeries1.mapPolygons.template;
            polygonTemplate1.tooltipText = "{name}";
            polygonTemplate1.fill = chartGeo.colors.getIndex(0);
            //shantam 
            polygonSeries1.include = ["IN-DL"];
            chartGeo.events.on("ready", loadStores1);
            //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
            this.geodata = chartGeo.series.push(new am4maps.MapImageSeries());
            // let imageSeriesTemplate = imageSeries.mapImages.template;
            let imageSeriesTemplate1 = this.geodata.mapImages.template;
            let circle1 = imageSeriesTemplate1.createChild(Circle);
            circle1.radius = 4;
            circle1.fill = color("#B27799");
            circle1.stroke = color("#FFFFFF");
            circle1.strokeWidth = 2;
            circle1.nonScaling = true;
            circle1.tooltipText = "{constituency}";
            imageSeriesTemplate1.propertyFields.latitude = "latitude";
            imageSeriesTemplate1.propertyFields.longitude = "longitude";
      
            imageSeriesTemplate1.tooltipText = "{constituency}: {count}";
      
            function loadStores1() {
              let loader = new DataSource();
              loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
              loader.events.on("parseended", (ev: any) => {
                setupStores1(ev.target.data);
              });
              loader.load();
            }
      
            // Creates a series
            function createSeries1(heatfield) {
              let series = chartGeo.series.push(new am4maps.MapImageSeries());
              series.dataFields.value = heatfield;
      
              let template = series.mapImages.template;
              template.verticalCenter = "middle";
              template.horizontalCenter = "middle";
              template.propertyFields.latitude = "lat";
              template.propertyFields.longitude = "long";
              template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
              // template.dataItem
      
              let circle = template.createChild(Circle);
              circle.radius = 10;
              circle.fillOpacity = 0.7;
              circle.verticalCenter = "middle";
              circle.horizontalCenter = "middle";
              circle.nonScaling = true;
      
              let label = template.createChild(Label);
              label.text = "{stores}";
              label.fill = color("#fff");
              label.verticalCenter = "middle";
              label.horizontalCenter = "middle";
              label.nonScaling = true;
      
              let heat = series.heatRules.push({
                target: circle,
                property: "radius",
                min: 10,
                max: 30
              });
      
              // Set up drill-down
              series.mapImages.template.events.on("hit", (ev: any) => {
      
                // Determine what we've clicked on
                let data = ev.target.dataItem.dataContext;
      
                // No id? Individual store - nothing to drill down to further
                if (!data.target) {
                  return;
                }
      
                // Create actual series if it hasn't been yet created
                if (!regionalSeries1[data.target].series) {
                  regionalSeries1[data.target].series = createSeries1("count");
                  regionalSeries1[data.target].series.data = data.markerData;
                }
      
                // Hide current series
                if (currentSeries1) {
                  currentSeries1.hide();
                }
      
                // Control zoom
                if (data.type == "state") {
                  let statePolygon = polygonSeries1.getPolygonById("IN-PB");
                  chartGeo.zoomToMapObject(statePolygon);
                } else if (data.type == "city") {
                  chartGeo.zoomToGeoPoint({
                    latitude: data.lat,
                    longitude: data.long
                  }, 64, true);
                }
                zoomOut1.show();
      
                // Show new targert series
                currentSeries1 = regionalSeries1[data.target].series;
                currentSeries1.show();
              });
      
              return series;
            }
      
            let regionalSeries1: any = {};
            let currentSeries1;
      
            function setupStores1(data) {
      
              // Init country-level series
              regionalSeries1.IN = {
                markerData: [],
                series: createSeries1("stores")
              };
      
              // Set current series
              currentSeries1 = regionalSeries1.IN.series;
      
              // Process data
              array.each(data.query_results, (data: any) => {
      
      
                // Get store data
                let store = {
                  state: data.MAIL_ST_PROV_C,
                  long: type.toNumber(data.LNGTD_I),
                  lat: type.toNumber(data.LATTD_I),
                  location: data.co_loc_n,
                  city: data.mail_city_n,
                  count: type.toNumber(data.count)
                };
      
                // Process state-level data
                if (regionalSeries1[store.state] == undefined) {
                  let statePolygonForGeo: any = polygonSeries1.getPolygonById("IN-" + store.state);
                  if (statePolygonForGeo) {
      
                    // Add state data
                    regionalSeries1[store.state] = {
                      target: store.state,
                      type: "state",
                      name: statePolygonForGeo.dataItem.dataContext.name,
                      count: store.count,
                      stores: 1,
                      lat: statePolygonForGeo.visualLatitude,
                      long: statePolygonForGeo.visualLongitude,
                      state: store.state,
                      markerData: []
                    };
                    regionalSeries1.IN.markerData.push(regionalSeries1[store.state]);
      
                  } else {
                    // State not found
                    return;
                  }
                } else {
                  regionalSeries1[store.state].stores++;
                  regionalSeries1[store.state].count += store.count;
                }
      
                // Process city-level data
                if (regionalSeries1[store.city] == undefined) {
                  regionalSeries1[store.city] = {
                    target: store.city,
                    type: "city",
                    name: store.city,
                    count: store.count,
                    stores: 1,
                    lat: store.lat,
                    long: store.long,
                    state: store.state,
                    markerData: []
                  };
                  regionalSeries1[store.state].markerData.push(regionalSeries1[store.city]);
                } else {
                  regionalSeries1[store.city].stores++;
                  regionalSeries1[store.city].count += store.count;
                }
      
                // Process individual store
                regionalSeries1[store.city].markerData.push({
                  name: store.location,
                  count: store.count,
                  stores: 1,
                  lat: store.lat,
                  long: store.long,
                  state: store.state
                });
      
              });
      
              regionalSeries1.IN.series.data = regionalSeries1.IN.markerData;
            }
      

  }

  getVisitorPoliticalInclinationOptionData() {
    this.userService.getVisitorPoliticalInclinationOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.perceivedPoliticalInclinationsOption = response.data;

        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getVisitorCategoryOptionData() {
    this.userService.getVisitorCategoryOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.visitorCategoriesOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getWhomToMeetOptionData() {
    this.userService.getWhomToMeetOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.whomVisitorMeetsOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getVisitorLocationOfMeetingOptionData() {
    this.userService.getVisitorLocationOfMeetingOptionData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.meetingLocationsOption = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  yourPageChangeLogic(ev) {
    this.pageIndexOfListingTable = ev.pageIndex + 1
    // this.getVisitorList(this.pageIndexOfListingTable)


    this.isLoadingResults = true;
    var currentTime = new Date();
    var fromdate = new Date("Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)");
    const range = {fromDate:fromdate,toDate:currentTime}
    this.userService.getVisitorByFilter(
      this.filterKeyword ? this.filterKeyword.search : '',
      this.filterKeyword ? this.filterKeyword.purpose : '',
      this.filterKeyword ? this.filterKeyword.date : '',
      this.pageIndexOfListingTable).subscribe(
      (response: any) => {
        if (response.error === false) {
          this.visitorLists = response.data.response;
          this.exportList=[];
          for (var i = 0; i <= this.visitorLists.length - 1; i++) {
            var d = new Date(this.visitorLists[i].createdAt);

            var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            var Ed = new Date(this.visitorLists[i].enrollmentDate);

            var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            this.exportList.push({
              serial: i + 1,
              uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
              fullName: this.visitorLists[i].fullName,
              address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
              createdAt: day,
              enrollmentDate: Eday,
              mobile: this.visitorLists[i].mobile,
              revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
              revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
              visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
              totalVisits: this.visitorLists[i].totalVisits,
              remark: this.visitorLists[i].objectiveInfoRemark,
              politicalRemark: this.visitorLists[i].politicalInforRemark,

            })
           
          }
          this.dataSource = new MatTableDataSource < any > (this.visitorLists);
          // this.dataSource.paginator = this.paginator;
          this.pageLength = this.visitorListsTotalLength;
          this.isLoadingResults = false;
       
        }
      },
      (error) => {
        this.isLoadingResults = false;
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  getVisitorList(pageIndexOfListingTable?:any): void {
    this.isLoadingResults = true;
    var currentTime = new Date();
    var fromdate = new Date("Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)");
    const range = {fromDate:fromdate,toDate:currentTime}
    this.userService.getVisitorList(pageIndexOfListingTable).subscribe(
      (response: any) => {
        if (response.error === false) {
          this.visitorLists = response.data.response;
         
          this.visitorListsTotalLength = response.data.length;
          this.exportList=[];
          for (var i = 0; i <= this.visitorLists.length - 1; i++) {
            var d = new Date(this.visitorLists[i].createdAt);

            var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            var Ed = new Date(this.visitorLists[i].enrollmentDate);

            var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            this.exportList.push({
              serial: i + 1,
              uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
              fullName: this.visitorLists[i].fullName,
              address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
              createdAt: day,
              enrollmentDate: Eday,
              mobile: this.visitorLists[i].mobile,
              revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
              revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
              visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
              totalVisits: this.visitorLists[i].totalVisits,
              remark: this.visitorLists[i].objectiveInfoRemark,
              politicalRemark: this.visitorLists[i].politicalInforRemark,

            })
          }
          this.dataSource = new MatTableDataSource < any > (this.visitorLists);
          this.pageLength =response.data.length;
          // this.dataSource.paginator = this.paginator;
          this.paginator.pageIndex = 0;
          // this.pageLength = this.visitorListsTotalLength;
       
          this.isLoadingResults = false;
        }
      },
      (error) => {
        this.isLoadingResults = false;
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  exportTable() { 
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.exportList);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, this.exportVisitorListFileName);
  }

  exportTableAll(): void {

    const allData = this.exportAllDataVar.map((element) => {
      return {
        "Unique Visitor ID": element.uniqueVisitorId,
        "Visitor Name": element.fullName,
        "Address": element.houseNumber + element.line1,
        "Date": ("0" +  new Date(element.createdAt).getDate()).slice(-2)+ "-" + ("0"+(new Date(element.createdAt).getMonth()+1)).slice(-2) + "-" +
        new Date(element.createdAt).getFullYear(),
        "Enrollment Date":("0" +  new Date(element.enrollmentDate).getDate()).slice(-2)+ "-" + ("0"+(new Date(element.enrollmentDate).getMonth()+1)).slice(-2) + "-" +
        new Date(element.enrollmentDate).getFullYear() ,
        "Mobile": element.mobile,
        "Caste": element.caste,
        "DOB":  ("0" +  new Date(element.dob).getDate()).slice(-2)+ "-" + ("0"+(new Date(element.dob).getMonth()+1)).slice(-2) + "-" +
        new Date(element.dob).getFullYear(),
        "Gender": element.gender,
        "Father Name": element.father,
        "Mother Name": element.mother,
        "House Number": element.houseNumber,
        "Occupation":element.occupation,
        "Tehsil": element.tehsil,
        "District": element.district,
        "Area PIN": element.zipCode,
       // "Visitor Voter Id Number": element.address.voterId,
       "Visitor Voter Id Number": element.voterId,
        "Constituency": element.constituency,
        "Area":element.address.area,
        // "Booth Number": element.boothNumber,
        // "Booth Name": element.boothName,
        // "Booth Area": element.boothArea,
        "Location of Meeting": element.meetingLocation,
        "Location Name": element.locationName,
        "Perceived political inclination": element.perceivedPoliticalInclination,
        "Proximity of Visitor": element.proximityOfVisitor,
        "Total Number of Family Members": element.totalFamilyMembers,
        "Email Id": element.emailId,
        "Landline Number": element.landLineNumber,
        "Purpose of Visit": element.revisits[0] ? element.revisits[0].visitPurposeCategory : '',
        "Whom Visitor Meet": element.revisits[0] ? element.revisits[0].whomToMeet : '',
        "Purpose Of Visit Text": element.revisits[0] ? element.revisits[0].purposeOfVisitText : '',
        //"Booth Coordinator": element.politicalinfo.boothCoordinator,
        "Status": element.revisits[0] ? element.revisits[0].status : '',
        "Visitor Category": element.politicalinfo.visitorCategory,
        "Is Samajwadi Party Member":element.politicalinfo.isSamajwadiPartyMember,
        "Total no of Visits": element.totalVisits,
        "Remarks": element.objectiveInfoRemark,
        "Remarks (In case if the visitor comes with some reference)": element.politicalInforRemark,
        "Reference mobile number":element.refrenceMobile,
        "Capture details of any accomplice with the visitor": element.accomplicedDetails,
        // "Thank You Acknowledgment message sent": element.politicalinfo.isAcknowledgementSent ? 'Yes' : 'No',
        // "Information sent to the booth/Village coordinator of the visitor": element.politicalinfo.isInfoSentToBooth ? 'Yes' : 'No'
      }
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.exportVisitorListFileName);
  }

  exportTableInPDF(): void {

    const doc = new jsPDF("l");

    const pages = doc.getNumberOfPages();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;


    for (let j = 1; j < pages + 1; j++) {
      const horizontalPos = pageWidth / 2; //Can be fixed number
      const verticalPos = pageHeight - 10; //Can be fixed number



      doc.text(
        `Copyright © 2006-2021, NSIGHT Consulting. All rights reserved.`,
        horizontalPos,
        verticalPos,

        {
          align: "center",
        },
      );
      doc.setPage(j);
    }

    // doc.addPage("l");

    // const img = new Image();
    // img.src = '../../../assets/images/logo.png'
    // doc.addImage(img, 'png', 5, 5, 12, 12);

    doc.text("Visitors List", 65, 13, null, "center");
    doc.text(
      "Date & Time : " + new Date().toLocaleString().toString(),
      240,
      13,
      null,
      "center"
    );
    autoTable(doc, {
      margin: {
        top: 25,
      },
      body: this.exportList,
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 25},
          5: {cellWidth: 25},
          10:{cellWidth: 15},
        },
      columns: [{
          header: 'S.no',
          dataKey: 'serial'
        }, {
          header: 'Unique  ID',
          dataKey: 'uniqueVisitorId'
        }, {
          header: 'Name',
          dataKey: 'fullName'
        }, {
          header: 'Address',
          dataKey: 'address'
        }, {
          header: 'Date',
          dataKey: 'createdAt'
        },
        {
          header: 'Enroll.Date',
          dataKey: 'enrollmentDate'
        },
        {
          header: 'Mobile',
          dataKey: 'mobile'
        }, {
          header: 'Purpose of Visit',
          dataKey: 'revisit'
        }, {
          header: 'Status',
          dataKey: 'revisitStatus'
        }, {
          header: 'Visit Category',
          dataKey: 'visitCategory'
        },

        {
          header: 'Total Visit',
          dataKey: 'totalVisits'
        }, {
          header: 'Remark',
          dataKey: 'remark'
        }, {
          header: 'Political Remarks',
          dataKey: 'politicalRemark'
        },
        //  {
        //   header: 'Capture Details of accomplice ',
        //   dataKey: 'accomDetail'
        // }, {
        //   header: 'Thank you Acknowledgment message sent',
        //   dataKey: 'ack'
        // }, {
        //   header: 'Information of booth coordinator ',
        //   dataKey: 'boothCor'
        // },
      ],
    })
    doc.save("visitorList.pdf");
  }

  getVisitorPurposeOptionData() {
    this.userService.getVisitorPurposeOptionData().subscribe(
      (response: any) => {
          console.log("response.data",response.data)
          this.purposes = response.data;
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }
//   visitorListAllData(){
// //    this.isLoadingResults = true

//     this.userService
//     .getAllVisitorList(
    
//     )
//     .subscribe(
//       (response: any) => {
//         if (response.error === false) {
//           this.exportAllDataVar = response.data.response;
//          // this.visitorListsTotalLength = response.data.length;
        
      
//          console.log(" this.exportAllDataVar ",response.data.response)
          
//         //  this.isLoadingResults = false;
//         }
//       },
//       (error) => {
//         this.isLoadingResults = false;
//         console.log("error.message",error)

//         this._snackBar.open(error.message, "", {
//           duration: 5000,
//         });
//       }
//     );
//   }
filterByName(value){
  this.filterValue=value
  this.filterInitial=''
  this.range.reset()
  this.filterTable()
}
filterPurpose(value){
  this.filterInitial=value
  this.filterValue=''
  this.range.reset()
  this.filterTable()
}
filterDate(){
  this.filterInitial=''
  this.filterValue=''
  this.filterTable()
}
  filterTable(): void {
    this.isLoadingResults = true;
    this.userService.getVisitorByFilter(
        this.filterInitial,
        this.filterValue,
        this.range.value,
       1
      )
      .subscribe(
        (response: any) => {
          if (response.error === false) {
            this.filterKeyword = {
            search: this.filterInitial,
            purpose: this.filterValue,
            date: this.range.value,
            }
            this.visitorLists = response.data.response;
            this.visitorListsTotalLength = response.data.length;
            this.exportList=[];
            for (var i = 0; i <= this.visitorLists.length - 1; i++) {
              var d = new Date(this.visitorLists[i].createdAt);
  
              var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
              var Ed = new Date(this.visitorLists[i].enrollmentDate);
  
              var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
              this.exportList.push({
                serial: i + 1,
                uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
                fullName: this.visitorLists[i].fullName,
                address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
                createdAt: day,
                enrollmentDate: Eday,
                mobile: this.visitorLists[i].mobile,
                revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
                revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
                visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                totalVisits: this.visitorLists[i].totalVisits,
                remark: this.visitorLists[i].objectiveInfoRemark,
                politicalRemark: this.visitorLists[i].politicalInforRemark,
  
              })
  
            }
            this.dataSource = new MatTableDataSource < any > (this.visitorLists);
            // this.dataSource.paginator = this.paginator;
            this.paginator.pageIndex = 0;
            this.pageLength = this.visitorListsTotalLength;
            this.isLoadingResults = false;
          }
        },
        (error) => {
          this.isLoadingResults = false;
          this._snackBar.open(error.message, "", {
            duration: 5000,
          });
        }
      );
  }


  resetFilter() {
    this.appliedFilters = {}; 
    this.paginator.pageIndex = 0;
    this.visitorListsTotalLength = 1;
    this.filterInitial = "";
    this.filterValue = "";
    this.pageLength =0;
    this.range.controls.fromDate.setValue("");
    this.range.controls.toDate.setValue("");
    this.filterKeyword = {
      search: this.filterInitial,
      purpose: this.filterValue,
      date: this.range.value,
      }
      this.getFilterMeetStatus()
      this.filterTable()
      console.log(this.appliedFilters)
    //this.getVisitorList(1);
  }

  getVisitorDetail(visitorId): void {
    this.router.navigate(["/add-visitor", visitorId]);
  }

  getVisitAnalyticData() {
    this.userService.getVisitAnalyticData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.anlyticData = response.data;
        }
      },
      (error) => {
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  setToPollingTableView(): void {
    const ele = document.getElementById("exportVisitorListTable");
    ele.scrollIntoView({
      behavior: "smooth",
    });
  }

  ngOnChanges(): void {
    // this.ngAfterViewInit();
   
  }
  getVisitAnalyticGraphData(filterValue ? : any) {
    if (filterValue) {
      this.viewGraphresetBtn = true;
      this.isLoadingResults = true;
    }
   
    this.userService.graphDataLoader.next(true);
    this.userService.getVisitAnalyticGraphData(filterValue).subscribe(
      (response: any) => {
        if (response.error === false) {

          this.userService.graphDataLoader.next(false);
          this.purposeGraph.data = response.data.purpose;
          
         
          this.genderGraph.data = response.data.gender;
          this.casteGraph.data = response.data.caste;
          if(!filterValue){
            this.purposes = response.data.purpose;
          }

          if (this.casteGraph.data.length > 8) {
            this.casteGraph.scrollbarX = new Scrollbar();
            this.casteGraph.scrollbarX.parent = this.casteGraph.bottomAxesContainer;
          }
          if(response.data.timeFrame.length > 8)
          {
            this.timeFrameGraphData.scrollbarX = new Scrollbar();
            this.timeFrameGraphData.scrollbarX.parent = this.timeFrameGraphData.bottomAxesContainer;
          }
         
          if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Week') {
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text= "NO. OF WEEKS"
            // this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {

            //   var d = moment(element._id, 'MM-DD-YYYY');
            //   d.month(); // 1
            //   return {
            //     '_id': d.format('ddd'),
            //     'count': element.count
            //   }
            // })
          } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Month') {
            var sortedData:any= response.data.timeFrame.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();
           
            this.timeFrameGraphData.data = sortedData.map((element) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('MMM'),
                'count': element.count
              }
            })
            this.timeFrameXText.title.text= "NO. OF MONTH"
          } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Year') {
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text= "NO. OF YEARS"
            // this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {

            //   var d = moment(element._id, 'MM-DD-YYYY');
            //   d.month(); // 1
            //   return {
            //     '_id': d.format('YYYY'),
            //     'count': element.count
            //   }
            // })
          } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Date'){
            this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text= "NO. OF DATES"
            // this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {
            //   var d = moment(element._id, 'MM-DD-YYYY');
            //   d.month(); // 1
            //   return {
            //     '_id': d.format('MMM'),
            //     'count': element.count
            //   }
            // })
          }
          else { this.timeFrameGraphData.data = response.data.timeFrame;
            this.timeFrameXText.title.text= "NO. OF MONTHS"
            var sortedData:any= response.data.timeFrame.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();
        
            this.timeFrameGraphData.data = sortedData.map((element) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              d.month(); // 1
              return {
                '_id': d.format('MMM'),
                'count': element.count
              }
            })
          }

          this.geodata.data = response.data.boothArea;
          // this.geodata1.data = response.data.boothArea;
          this.geodata1.data = response.data.districtArea;
          this.visitorCategoryData = response.data.visitorCategory;
          this.visitorOccupatioData=response.data.occupation;
          this.ageGraphData = response.data.ageGroup;
          this.perceivedPoliticalInclinationData = response.data.ppi
          this.meetingLocationGraphData = response.data.meetingLocation;
          this.whomVisitorMeetGraphData = response.data.whomVisitorMeet;
          this.meetingStatusGraphData = response.data.meetingStatus;
          this.filteredVisitorCount = response.data.count;
          this.samajwadiPartyGraphData = response.data.isSamajwadiPartyMember;
         this.visitorAreaData = response.data.area
        }


    if (filterValue) {
      this.visitorLists = response.data.visitorData;
      this.exportList=[];
      for (var i = 0; i <= this.visitorLists.length - 1; i++) {
        var d = new Date(this.visitorLists[i].createdAt);

        var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
        var Ed = new Date(this.visitorLists[i].enrollmentDate);

        var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

        this.exportList.push({
          serial: i + 1,
          uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
          fullName: this.visitorLists[i].fullName,
          address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
          createdAt: day,
          enrollmentDate: Eday,
          mobile: this.visitorLists[i].mobile,
          revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
          revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
          visitCategory: this.visitorLists[i].politicalinfo.visitorCategory,
          totalVisits: this.visitorLists[i].totalVisits,
          remark: this.visitorLists[i].objectiveinfo.remark,
          politicalRemark: this.visitorLists[i].politicalinfo.remarks,

        })
        // if (this.visitorLists[i].politicalinfo.isAcknowledgementSent == true) {

        //   if (this.visitorLists[i].politicalinfo.isInfoSentToBooth == true) {
        //     this.exportList[i].acknowledge = 'Yes';
        //     this.exportList[i].boothCordinate = 'Yes';
        //   } else {
        //     this.exportList[i].acknowledge = 'Yes';
        //     this.exportList[i].boothCordinate = 'No';
        //   }
        // } else {
        //   if (this.visitorLists[i].politicalinfo.isInfoSentToBooth == true) {
        //     this.exportList[i].acknowledge = 'No';
        //     this.exportList[i].boothCordinate = 'Yes';
        //   } else {
        //     this.exportList[i].acknowledge = 'No';
        //     this.exportList[i].boothCordinate = 'No';
        //   }
        // }

      }
      this.dataSource = new MatTableDataSource < any > (this.visitorLists);
      this.dataSource.paginator = this.paginator;
      this.pageLength =response.data.visitorData.length;
     
      this.viewGraphresetBtn = true;
      this.isLoadingResults = false;
    } 
    else {
      this.getVisitorList(1);
      this.viewGraphresetBtn = false;
    } 
      },
      (error) => {
        this.userService.graphDataLoader.next(false);
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );

  }

  purposeFilter(value): void {
    const filterObj = {
      key: "purpose",
      value: value,
    };
    this.getFilterMeetStatus(filterObj)
   
  }

  visitorAreaFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)
 
  }

  genderFilter(value): void {
    const filterObj = {
      key: "gender",
      value: value,
    };

    this.appliedFilters['gender'] = value;

    this.getFilterMeetStatus(filterObj)
    
  }

  casteFilter(value): void {
    const filterObj = {
      key: "caste",
      value: value,
    };
    this.getFilterMeetStatus(filterObj)
  
  }

  ageFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)

  }

  perceiveFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)
   
  }

  samajwadiPartyFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)
  
  }

  visitorCategoryFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)

  }

  visitorOccupationFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)

  }
  whomVisitorMeetFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)
    
  }

  meetingStatusGraphFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)
  
  }

  meetingLocationGraphFilter(filterObj): void {
    this.getFilterMeetStatus(filterObj)

  }

  timeFrameFilter(value): void {
    const filterObj = {
      key: "timeFrame",
      value: value,
    };
    this.getFilterMeetStatus(filterObj)
    // this.getFilterArea(filterObj)
    // this.getFilterDistrictConstituency(filterObj)
    // this.getFilterAgeGroup(filterObj)
    // this.getFilterMeetLocation(filterObj)
    // this.getFilterIsSamjawadi(filterObj)
    // this.getFilterGender(filterObj)
    // this.getFilterCaste(filterObj)
    // this.getFilterOccupation(filterObj)
    // this.getFilterPpi(filterObj)
    // this.getFilterPurpose(filterObj)
    // this.getFilterTimeFrame(filterObj)
    // this.getFilterVisitorCategory(filterObj)
    // this.getFilterVisitorMeet(filterObj)
    // this.getVisitorGraphFilter(filterObj);
    // console.log("filterObj",filterObj)
   // this.getVisitAnalyticGraphData(filterObj);
  }

  //separate api

  getFilterMeetStatus(filterObj?:any): void{
    
    this.isLoadingResults = true;
    if (filterObj) {
      this.viewGraphresetBtn = true;
      this.isLoadingResults = true;
    }
    else{
      this.viewGraphresetBtn = false;
      this.appliedFilters = {};
    }
    //table
    this. isLoaderHappen = true;
    //All graph loader
    this.userService.graphDataLoader.next(true);
    this.userService.graphDataLoader5.next(true);
    this.userService.graphDataLoader1.next(true);
    this.userService.graphDataLoader2.next(true);
    this.userService.graphDataLoader4.next(true);
    this.graphDataLoader1=true;
    this.graphDataLoader3=true;
    this.userService.graphDataLoader7.next(true);
    this.userService.graphDataLoader3.next(true);
    this.graphDataLoader=true;
    this.graphDataLoader2=true;
    this.userService.graphDataLoader6.next(true);
    this.userService.graphDataLoader8.next(true);

    this.userService.getFilterMeetStatus(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'meetingStatus'){
            this.filteredVisitorCount=response.data[0].count;
          }
         
          this.meetingStatusGraphData = response.data;
          this.userService.graphDataLoader.next(false);
         this.getFilterArea(filterObj)
        }
      },
      (error) => {
    
      }
    );
  }
  getFilterArea(filterObj?:any): void{
 
    this.userService.getFilterArea(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'area'){
            this.filteredVisitorCount=response.data[0].count;
           // console.log("area", this.filteredVisitorCount)
          }
         this.visitorAreaData = response.data;
        
         this.getFilterDistrictConstituency(filterObj)
       
         this.userService.graphDataLoader5.next(false);
        }
      },
      (error) => {
       
      }
    );
  }
  getFilterDistrictConstituency(filterObj?:any): void{
   // this.isLoadingResults = true;
    this.userService.getFilterDistrictConstituency(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
      
          this.geodata1.data = response.data[0].district;
          this.geodata.data = response.data[0].constituency;
          this.getFilterAgeGroup(filterObj)
         
         // this.isLoadingResults = false;
        }
      },
      (error) => {
      
      }
    );
  }
  getFilterAgeGroup(filterObj?:any): void{
   
    this.userService.getFilterAgeGroup(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'ageGroup'){
            this.filteredVisitorCount=response.data[0].count;
            //console.log("ageGroup", this.filteredVisitorCount)
          }
          this.ageGraphData = response.data;
          this.getFilterMeetLocation(filterObj)
          
          this.userService.graphDataLoader1.next(false);
         
        }
      },
      (error) => {
    
      }
    );
  }
  getFilterMeetLocation(filterObj?:any): void{
   
    this.userService.getFilterMeetLocation(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'meetingLocation'){
            this.filteredVisitorCount=response.data[0].count;
            //console.log("meetingLocation", this.filteredVisitorCount)
          }
          this.meetingLocationGraphData = response.data;
          this.getFilterIsSamjawadi(filterObj)
          
          this.userService.graphDataLoader2.next(false);
        }
      },
      (error) => {
      
      }
    );
  }
  getFilterIsSamjawadi(filterObj?:any): void{
  
    this.userService.getFilterIsSamjawadi(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
      
          if(filterObj?.key == 'isSamajwadiPartyMember'){
            this.filteredVisitorCount=response.data[0].count;
          //  console.log("isSamajwadiPartyMember", this.filteredVisitorCount)
          }
          this.samajwadiPartyGraphData = response.data;
          this.getFilterGender(filterObj)
         
          this.userService.graphDataLoader4.next(false);
        }
      },
      (error) => {
     
      }
    );
  }
  getFilterGender(filterObj?:any): void{
    
    this.userService.getFilterGender(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'gender'){
            this.filteredVisitorCount=response.data[0].count;
            //console.log("gender", this.filteredVisitorCount)
          }
          this.genderGraph.data = response.data;
          this.getFilterCaste(filterObj)
        
          this.graphDataLoader1=false;
        }
      },
      (error) => {
     
      }
    );
  }
  getFilterCaste(filterObj?:any): void{
  
    this.userService.getFilterCaste(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'caste'){
            this.filteredVisitorCount=response.data[0].count;
           // console.log("caste", this.filteredVisitorCount)
          }
          this.casteGraph.data = response.data;
          if (this.casteGraph.data.length > 8) {
            this.casteGraph.scrollbarX = new Scrollbar();
            this.casteGraph.scrollbarX.parent = this.casteGraph.bottomAxesContainer;
          }
         this.graphDataLoader3= false;
         this.getFilterOccupation(filterObj)
      
        }
      },
      (error) => {
      
      }
    );
  }
  getFilterOccupation(filterObj?:any): void{
  
    this.userService.getFilterOccupation(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'occupation'){
            this.filteredVisitorCount=response.data[0].count;
            //console.log("occupation", this.filteredVisitorCount)
          }
          this.visitorOccupatioData=response.data;
          this.userService.graphDataLoader7.next(false);
         this.getFilterPpi(filterObj)
      
        }
      },
      (error) => {
   
      }
    );
  }
  getFilterPpi(filterObj?:any): void{
   
    this.userService.getFilterPpi(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
         
          if(filterObj?.key == 'ppi'){
            this.filteredVisitorCount=response.data[0].count;
            //console.log("ppi", this.filteredVisitorCount)
          }
          this.perceivedPoliticalInclinationData = response.data;
          this.getFilterPurpose(filterObj)
         
          this.userService.graphDataLoader3.next(false);
        }
      },
      (error) => {
    
      }
    );
  }
  getFilterPurpose(filterObj?:any): void{
    //this.isLoadingResults = true;
   
    this.userService.getFilterPurpose(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          this.purposeGraph.data = response.data;
          this.purposes = response.data;
          this.getFilterTimeFrame(filterObj)
          if(filterObj?.key == 'purpose'){
            console.log("purpose", this.filteredVisitorCount)
            this.filteredVisitorCount=response.data[0].count;
          }
          this.graphDataLoader= false;
        }
      },
      (error) => {
     
      }
    );
  }
  getFilterTimeFrame(filterValue?:any): void{
  
    this.userService.getFilterTimeFrame(filterValue).subscribe(
      (response: any) => {
        if (response.error === false) {
      
          this.getFilterVisitorCategory(filterValue)
          if(filterValue?.key == 'timeFrame'){
            this.filteredVisitorCount=response.data[0].count;
          //  console.log("timeFrame", this.filteredVisitorCount)
          }
          this.graphDataLoader2= false;
          if(response.data.length > 8)
          {
            this.timeFrameGraphData.scrollbarX = new Scrollbar();
            this.timeFrameGraphData.scrollbarX.parent = this.timeFrameGraphData.bottomAxesContainer;
          }
       
          // if(filterValue){
            if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Week') {
              this.timeFrameGraphData.data = response.data;
              this.timeFrameXText.title.text= "NO. OF WEEKS"
            
            } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Month') {
              var sortedData:any= response.data.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();
            
              this.timeFrameGraphData.data = sortedData.map((element) => {
  
                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('MMM'),
                  'count': element.count
                }
              })
              this.timeFrameXText.title.text= "NO. OF MONTH"
            } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Year') {
              this.timeFrameGraphData.data = response.data;
              this.timeFrameXText.title.text= "NO. OF YEARS"
            
            } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Date'){
              this.timeFrameGraphData.data = response.data;
              this.timeFrameXText.title.text= "NO. OF DATES"
            
            }
            else { this.timeFrameGraphData.data = response.data;
              this.timeFrameXText.title.text= "NO. OF MONTHS"
              var sortedData:any= response.data.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();
           
              this.timeFrameGraphData.data = sortedData.map((element) => {
  
                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('MMM'),
                  'count': element.count
                }
              })
            }
          // }
          // else{
          //   this.timeFrameGraphData.data = response.data;
          //   this.timeFrameXText.title.text= "NO. OF MONTHS"
          // }
        
        }
      },
      (error) => {
    
      }
    );
  }
  getFilterVisitorCategory(filterObj?:any): void{
   
    this.userService.getFilterVisitorCategory(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'visitorCategory'){
            this.filteredVisitorCount=response.data[0].count;
           // console.log("visitorCategory", this.filteredVisitorCount)
          }
          this.visitorCategoryData = response.data;
          this.userService.graphDataLoader6.next(false);
         this.getFilterVisitorMeet(filterObj)
       
        }
      },
      (error) => {
    
      }
    );
  }
  getFilterVisitorMeet(filterObj?:any): void{
    
    this.userService.getFilterVisitorMeet(filterObj).subscribe(
      (response: any) => {
        if (response.error === false) {
          if(filterObj?.key == 'whomVisitorMeet'){
            this.filteredVisitorCount=response.data[0].count;
           // console.log("whomVisitorMeet", this.filteredVisitorCount)
          }
          this.whomVisitorMeetGraphData = response.data;
          this.userService.graphDataLoader8.next(false);
          if(filterObj){
            this.getVisitorGraphFilter(filterObj);
          }
          else{
            this.getVisitorList(1);
          }
        
        }
      },
      (error) => {
   
      }
    );
  }
  getVisitorGraphFilter(filterObj?:any) {
   // this.isLoadingResults = true;
    this.userService.getVisitorGraphFilter(filterObj,'1').subscribe(
      (response: any) => {
        if (response.error === false) {
       
          this.visitorLists = response.data.response;
          this.visitorListsTotalLength = response.data.length;
          this.exportList=[];
          for (var i = 0; i <= this.visitorLists.length - 1; i++) {
            var d = new Date(this.visitorLists[i].createdAt);

            var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            var Ed = new Date(this.visitorLists[i].enrollmentDate);

            var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

            this.exportList.push({
              serial: i + 1,
              uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
              fullName: this.visitorLists[i].fullName,
              address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
              createdAt: day,
              enrollmentDate: Eday,
              mobile: this.visitorLists[i].mobile,
              revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
              revisitStatus: this.visitorLists[i].revisits[0] ?  this.visitorLists[i].revisits[0].status : '',
              visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
              totalVisits: this.visitorLists[i].totalVisits,
              remark: this.visitorLists[i].objectiveInfoRemark,
              politicalRemark: this.visitorLists[i].politicalInforRemark,

            })
          }
          this.dataSource = new MatTableDataSource < any > (this.visitorLists);
          this.paginator.pageIndex = 0;
          this.pageLength = this.visitorListsTotalLength;
          this.isLoadingResults = false;
          this. isLoaderHappen = false;
        }
      },
      (error) => {
      
      }
    );
  }
}