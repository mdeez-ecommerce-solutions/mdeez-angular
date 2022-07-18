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
  ElementRef,
} from "@angular/core";
import {
  isPlatformBrowser
} from "@angular/common";
import moment from 'moment';
// amCharts imports

import { useTheme, options, create, math, ease, ResponsiveBreakpoints, DropShadowFilter, Tooltip, Button, RadialGradient, LinearGradient, Scrollbar, color, percent, type, array, PlayButton, Label, Circle, ZoomOutButton, DataSource, MouseCursorStyle } from '@amcharts/amcharts4/core';
import * as am4maps from "@amcharts/amcharts4/maps";
// import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4geodata_worldLow from "@amcharts/amcharts4-geodata/indiaHigh";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { environment } from '../../../environments/environment';

import _ from "lodash";

import screenfull from 'screenfull';

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

// import * as data from "./graphs/states-map/geojson.json";
import * as data from "./graphs/states-map/patiala.json";


/* Chart code */
// Themes begin
useTheme(am4themes_animated);
options.queue = false;
// // options.animationsEnabled = true;
// options.deferredDelay = 0;
options.onlyShowOnViewport = false;


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
  pageLength: any;
  visitorOccupationOption: any;

  range = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  geodatajson = data;

  visitorLists: any;
  exportList: any = [];
  psData = {};
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
  visitorAreaData: any;
  purposeGraph: any;
  liveyear: any;
  livepurposeGraph?: any;
  livepurposeGraphData?: any;
  firstlivekey: any;
  lastlivekey: any;
  heatmapGraph?: any;
  streamGraph?: any;
  genderGraph: any;
  casteGraph: any;
  visitorCategoryData: any;
  visitorOccupatioData: any;
  ageGraphData: any;
  perceivedPoliticalInclinationData: any;
  meetingLocationGraphData: any;
  timeFrameGraphData: any;
  proximityGraph: any;
  timeFrameXText?: any;
  whomVisitorMeetGraphData: any;
  meetingStatusGraphData: any;
  graphDataLoader: boolean;
  graphDataLoader1: boolean;
  graphDataLoader2: boolean;
  graphDataLoader3: boolean;
  viewGraphresetBtn: boolean;
  geodata: any;
  geodata1: any;
  filteredVisitorCount: any;
  visitorListsTotalLength: any;
  pageIndexOfListingTable: any;
  filterKeyword: any;
  isLoaderHappen: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  samajwadiPartyGraphData: any;
  exportAllDataVar: any;
  baseApiUrl: any;
  appliedFilters = {}
  authData
  adminRole = environment.ADMIN_ROLE
  superAdminRole = environment.SUPER_ADMIN_ROLE
  editorRole = environment.EDITOR_ROLE
  loader = false;
  authenticated = false
  networkSeries: any;
  pbPoints: any;
  kpi_total: any;
  kpi_today: any;
  kpi_week: any;
  kpi_month: any;
  kpi_total_percent: any;
  kpi_today_percent: any;
  kpi_week_percent: any;
  kpi_month_percent: any;
  districts: any;




  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.authData = JSON.parse(localStorage.getItem("SignInUserData"));

    switch (this.authData.role) {
      case 'SUPER_ADMIN': {
        this.authenticated = true
        break;
      }
      case 'ADMIN': {
        this.authenticated = true
        break;
      }
    }
    this.userService.isLoadingVisitorList.subscribe((res) => this.isLoaderHappen = res);
    this.baseApiUrl = environment.api_base_url + '/visitor/download-csv?limit=100000';

  }

  ngOnInit(): void {

    // this.livepurposeGraph = [];
    // this.genderGraph = [];
    // this.casteGraph = [];
    // this.paginator = null;

    this.purposeGraph = [];
    this.timeFrameGraphData = []
    this.timeFrameXText = []
    // this.getFilterMeetStatus()
    // this.getFilterArea()
    // // this.getFilterDistrictConstituency()
    // this.getFilterAgeGroup()
    // this.getFilterMeetLocation()
    // this.getFilterIsSamjawadi()
    // this.getFilterGender()
    // this.getFilterCaste()
    // this.getFilterOccupation()
    // this.getFilterPpi()
    // this.getFilterPurpose()
    // this.getFilterTimeFrame()
    // this.getFilterVisitorCategory()
    // this.getFilterVisitorMeet()
    // this.getVisitorList(1);
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
    this.genderGraph = [];
    this.casteGraph = [];


    this.getVisitAnalyticGraphData();


    //HELPER FUNCTION TO REVERSE MAP GEOJSON
    // this.geodatajson.features.map(el => {
    //   if (el.geometry.type == "Polygon") {
    //     return el.geometry.coordinates.forEach(d => {
    //       d.reverse();
    //     });
    //   }
    // });

    //  console.log(this.geodatajson.features);


    //  // this.rangeSelection();
    //  this.getVisitorPurposeOptionData();
    //  this.getCasteOptionData();
    //  this.getVisitorPoliticalInclinationOptionData();
    //  this.getVisitorCategoryOptionData();
    //  this.getWhomToMeetOptionData();
    //  this.getVisitorLocationOfMeetingOptionData();
    //  this.getVisitAnalyticData();
    //  this.getVisitorOccupationData();

    //  // Graph Data Calling
    //   this.getVisitAnalyticGraphData();

  }
  openInNewTab() {
    // this._snackBar.open("Please wait while we are downloading your data..");
    this.isLoaderHappen = false;
    this._snackBar.open("Please wait while we are downloading your data..", "", {
      duration: 5000,
    });
    // //console.log("this.isLoaderHappen", this.isLoaderHappen);
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
        // //console.log("series",series)
        return series;
      }

      let regionalSeries: any = {};
      let currentSeries;

      function setupStores(data) {
        // //console.log("data 1 ",data)
        // //console.log("regionalSeries ",regionalSeries)

        // Init country-level series
        regionalSeries.IN = {
          markerData: [],
          series: createSeries("stores")
        };

        // Set current series
        currentSeries = regionalSeries.IN.series;
        // //console.log("currentSeries ",currentSeries)

        // Process data
        array.each(data.query_results, (data: any) => {

          //  //console.log("data 2 ",data)
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
              // //console.log("statePolygonForGeo", statePolygonForGeo)
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
            // //console.log("regionalSeries[store.state].stores ",regionalSeries[store.state].stores)

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
            // //console.log("regionalSeries[store.city].stores ",regionalSeries[store.city].stores)

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
        // //console.log("regionalSeries.IN.series.data",regionalSeries.IN.series.data)

      }

      // Chart for geo district
      //Graph Geo Map District
      // Create map instance


      let chartGeo = create("geoMap1", am4maps.MapChart);
      chartGeo.logo.disabled = true;
      chartGeo.maxZoomLevel = 64;

      chartGeo.geodata = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                76.32854461669922,
                                30.30353917828011
                            ],
                            [
                                76.34296417236328,
                                30.318655057186803
                            ],
                            [
                                76.34090423583984,
                                30.33110167727276
                            ],
                            [
                                76.35429382324219,
                                30.330805347556105
                            ],
                            [
                                76.3546371459961,
                                30.337028083293944
                            ],
                            [
                                76.34227752685547,
                                30.336731771512106
                            ],
                            [
                                76.35841369628906,
                                30.35658267783339
                            ],
                            [
                                76.35738372802734,
                                30.369616903210154
                            ],
                            [
                                76.35120391845703,
                                30.378799064289495
                            ],
                            [
                                76.31549835205078,
                                30.38472258144958
                            ],
                            [
                                76.3113784790039,
                                30.391089961939272
                            ],
                            [
                                76.31309509277344,
                                30.397308863195068
                            ],
                            [
                                76.30674362182617,
                                30.392126472976624
                            ],
                            [
                                76.29987716674805,
                                30.394495599764554
                            ],
                            [
                                76.28992080688477,
                                30.393014902255455
                            ],
                            [
                                76.26228332519531,
                                30.37169036980603
                            ],
                            [
                                76.24614715576172,
                                30.387388047033095
                            ],
                            [
                                76.22692108154297,
                                30.378502879007097
                            ],
                            [
                                76.22520446777344,
                                30.37198657573015
                            ],
                            [
                                76.26434326171875,
                                30.353027587637076
                            ],
                            [
                                76.22589111328125,
                                30.33554651541684
                            ],
                            [
                                76.20872497558594,
                                30.365766062875743
                            ],
                            [
                                76.1953353881836,
                                30.36724717325868
                            ],
                            [
                                76.1788558959961,
                                30.354805148883177
                            ],
                            [
                                76.15379333496094,
                                30.368728261208474
                            ],
                            [
                                76.16409301757812,
                                30.375244781665323
                            ],
                            [
                                76.1630630493164,
                                30.383241735819148
                            ],
                            [
                                76.14383697509766,
                                30.391534182301918
                            ],
                            [
                                76.15619659423828,
                                30.401010402148156
                            ],
                            [
                                76.17851257324219,
                                30.401898750620667
                            ],
                            [
                                76.17713928222656,
                                30.411670050415307
                            ],
                            [
                                76.16031646728516,
                                30.432985854877845
                            ],
                            [
                                76.18881225585938,
                                30.449265623235018
                            ],
                            [
                                76.18640899658203,
                                30.46672635218658
                            ],
                            [
                                76.20838165283203,
                                30.478858236062322
                            ],
                            [
                                76.22005462646484,
                                30.467614102257855
                            ],
                            [
                                76.23653411865233,
                                30.469685487622733
                            ],
                            [
                                76.25232696533202,
                                30.495130340274713
                            ],
                            [
                                76.27970695495605,
                                30.460807811599466
                            ],
                            [
                                76.2934398651123,
                                30.469241623039075
                            ],
                            [
                                76.29687309265137,
                                30.468057974259104
                            ],
                            [
                                76.30133628845215,
                                30.479597936184486
                            ],
                            [
                                76.29592895507812,
                                30.48374015299826
                            ],
                            [
                                76.29816055297852,
                                30.48677273567802
                            ],
                            [
                                76.30983352661133,
                                30.482112874557547
                            ],
                            [
                                76.31524085998535,
                                30.487660302976938
                            ],
                            [
                                76.32159233093262,
                                30.48803012029571
                            ],
                            [
                                76.32073402404785,
                                30.483888086052925
                            ],
                            [
                                76.32940292358398,
                                30.473236331462076
                            ],
                            [
                                76.32373809814453,
                                30.46687431109371
                            ],
                            [
                                76.33472442626953,
                                30.45207730788989
                            ],
                            [
                                76.36064529418945,
                                30.467466144474578
                            ],
                            [
                                76.3611602783203,
                                30.475011704826596
                            ],
                            [
                                76.37025833129883,
                                30.47619526908544
                            ],
                            [
                                76.37935638427734,
                                30.4773788189566
                            ],
                            [
                                76.38708114624023,
                                30.461399681840188
                            ],
                            [
                                76.40253067016602,
                                30.45932812026586
                            ],
                            [
                                76.41094207763672,
                                30.465690633543204
                            ],
                            [
                                76.42450332641602,
                                30.45947609041055
                            ],
                            [
                                76.41780853271484,
                                30.450153532415474
                            ],
                            [
                                76.42227172851562,
                                30.446453857466917
                            ],
                            [
                                76.4095687866211,
                                30.43653803617455
                            ],
                            [
                                76.41626358032227,
                                30.431209715711173
                            ],
                            [
                                76.42724990844725,
                                30.430913689372137
                            ],
                            [
                                76.43377304077148,
                                30.426177145763027
                            ],
                            [
                                76.4457893371582,
                                30.43135772854377
                            ],
                            [
                                76.45746231079102,
                                30.425585061640994
                            ],
                            [
                                76.44527435302734,
                                30.417295506645424
                            ],
                            [
                                76.45145416259766,
                                30.412854383934402
                            ],
                            [
                                76.44304275512694,
                                30.409301340268463
                            ],
                            [
                                76.45008087158203,
                                30.40826501150554
                            ],
                            [
                                76.44115447998047,
                                30.397308863195068
                            ],
                            [
                                76.45608901977539,
                                30.389313060289677
                            ],
                            [
                                76.44201278686523,
                                30.3888688298276
                            ],
                            [
                                76.44132614135742,
                                30.384130245890272
                            ],
                            [
                                76.42827987670898,
                                30.37953952356879
                            ],
                            [
                                76.4322280883789,
                                30.372282780756848
                            ],
                            [
                                76.42724990844725,
                                30.364877385878344
                            ],
                            [
                                76.45196914672852,
                                30.36502549927204
                            ],
                            [
                                76.4593505859375,
                                30.35954515431212
                            ],
                            [
                                76.44149780273438,
                                30.34295413059721
                            ],
                            [
                                76.45694732666016,
                                30.335250199151083
                            ],
                            [
                                76.44235610961914,
                                30.32487856492592
                            ],
                            [
                                76.43840789794922,
                                30.310060039424812
                            ],
                            [
                                76.42416000366211,
                                30.302205312335193
                            ],
                            [
                                76.41815185546875,
                                30.318506873612385
                            ],
                            [
                                76.40802383422852,
                                30.315691343116896
                            ],
                            [
                                76.38914108276367,
                                30.300871428242587
                            ],
                            [
                                76.3930892944336,
                                30.305762247858855
                            ],
                            [
                                76.37991428375243,
                                30.312171816229824
                            ],
                            [
                                76.37197494506836,
                                30.295683928709654
                            ],
                            [
                                76.36253356933594,
                                30.29657323383411
                            ],
                            [
                                76.32854461669922,
                                30.30353917828011
                            ]
                        ]
                    ]
                }
            }
        ]
    };

    console.log("geodata",chartGeo.geodata);

      //reversed the geodatajson in ngoninit

      // Set projection
      chartGeo.projection = new am4maps.projections.Miller();

      // Create map polygon series
      let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
      polygonSeries1.useGeodata = true;

      let mapgradient = new RadialGradient();
      mapgradient.addColor(color("#192eac"), 0.05);
      mapgradient.addColor(color("#192eac"), 0.1);
      mapgradient.addColor(color("#192eac"), 0.2);
      mapgradient.addColor(color("#192eac"), 0.3);
      mapgradient.addColor(color('#192eac'), 0.5);


      // linecolor: color("#1f39d1"),
      // dotcolor: color("#2d4bfc"),
      // gradient: createGradient(color('#192eac'))

      // Configure series
      var polygonTemplate1 = polygonSeries1.mapPolygons.template;
      polygonTemplate1.tooltipText = "{geocoding.name}";
      polygonTemplate1.strokeWidth = 0.6;
      polygonTemplate1.stroke = color("#1f39d1");
      polygonTemplate1.fill = mapgradient;

      let shadow = polygonTemplate1.background.filters.push(new DropShadowFilter());
      shadow.dx = 10;
      shadow.dy = 10;
      shadow.blur = 5;
      shadow.color = color("#fff");

      // Create hover state and set alternative fill color
      // var hs = polygonTemplate1.states.create("hover");
      // hs.properties.fill = color("#8067dc");

      //polling station points
      this.pbPoints = chartGeo.series.push(new am4maps.MapImageSeries());
      this.pbPoints.dataFields.value = "count";
      // this.pbPoints.;
      let imageSeriesTemplate1 = this.pbPoints.mapImages.template;
      let circle1 = imageSeriesTemplate1.createChild(Circle);
      circle1.radius = 3;
      circle1.fill = color("#2d4bfc");
      // circle1.fill = color("#ff0000");


      circle1.stroke = color("#000");
      circle1.strokeWidth = 0.5;
      circle1.nonScaling = true;
      circle1.fillOpacity = 0.8;

      circle1.tooltip = new Tooltip();
      circle1.tooltipText = "{boothName} : {boothNumber} : {count}";
      circle1.tooltip.label.background.fill = color("#181d2a");
      circle1.tooltip.label.fontSize = 12;
      circle1.tooltip.label.fontWeight = "lighter";
      circle1.tooltip.background.strokeWidth = 0;
      circle1.tooltip.strokeWidth = 0;
      circle1.cursorOverStyle = MouseCursorStyle.pointer;


      // Creating a "heat rule" to modify "radius" of the bullet based
      // on value in data
      this.pbPoints.heatRules.push({
        "target": circle1,
        "property": "radius",
        "min": 3,
        "max": 20,
      });


      imageSeriesTemplate1.events.on("hit", (ev) => {

        this.psData = ev.target.dataItem.dataContext;

        //console.log("psdata", this.psData);

        if (this.psData) {

          let pshtml = '<div class="psno">PB No. <b>' + this.psData['boothNumber'] + '</b></div>'
            + '<div class="psloc">' + this.psData['boothName'] + '</div>'
            + '<div class="psaddr">' + this.psData['count'] + ' Visitor' + (this.psData['count'] > 1 ? "s" : "") + '</div>';

          $("#psData").html(pshtml);

        }

      });

      // //console.log("charditi",this.pbPoints.data);

      // imageSeriesTemplate1.propertyFields.latitude = "Latitude";
      // imageSeriesTemplate1.propertyFields.longitude = "Longitude";

      // imageSeriesTemplate1.tooltipText = "{district}: {count}";
      // circle1.tooltipText = "{constituency}";
      // imageSeriesTemplate1.dataItem.dataContext =  40;
      imageSeriesTemplate1.propertyFields.latitude = "latitude";
      imageSeriesTemplate1.propertyFields.longitude = "longitude";


      // imageSeriesTemplate1.tooltipText = "{constituency}: {count}";


      // Add zoom control
      // chartGeo.zoomControl = new am4maps.ZoomControl();
      // chartGeo.zoomControl.height = 100;

      var home = chartGeo.chartContainer.createChild(Button);
      home.label.text = "RESET";
      home.valign = "bottom";
      home.align = "right";
      //  home.height =  25;
      //  home.width = 200;
      home.background.fill = color("#3c3f4a");
      home.background.strokeWidth = 0;
      home.strokeWidth = 0.5;
      home.padding(5, 6, 5, 6);
      home.fontSize = 11;
      home.label.stroke = color("#fff");
      home.label.fontWeight = "lighter";
      home.events.on("hit", function (ev) {
        chartGeo.goHome();
      });

      chartGeo.events.on("zoomlevelchanged", resetbutton);

      function resetbutton() {

        if (chartGeo.zoomLevel > 1.3) {
          home.show();
        } else {
          home.hide();
        }

      }


      // chartGeo.geodataSource.url = "./graphs/states-map/geojson.json";
      // chartGeo.geodata = am4geodata_worldLow;

      // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]

      // Set projection
      // chartGeo.projection = new am4maps.projections.Projection();

      // // Add button
      // let zoomOut1 = chartGeo.tooltipContainer.createChild(ZoomOutButton);
      // zoomOut1.align = "right";
      // zoomOut1.valign = "top";
      // zoomOut1.margin(20, 20, 20, 20);
      // zoomOut1.events.on("hit", function () {
      //   if (currentSeries1) {
      //     currentSeries1.hide();
      //   }
      //   chartGeo.goHome();
      //   zoomOut1.hide();
      //   currentSeries1 = regionalSeries1.IN.series;
      //   currentSeries1.show();
      // });
      // zoomOut1.hide();

      //   // Create map polygon series
      //   let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
      //   polygonSeries1.useGeodata = true;
      //   polygonSeries1.calculateVisualCenter = true;

      //   // Configure series
      //   let polygonTemplate1 = polygonSeries1.mapPolygons.template;
      //   polygonTemplate1.tooltipText = "{district}";
      //   polygonTemplate1.fill = chartGeo.colors.getIndex(0);
      //   //shantam

      // let dd =  this.geodatajson;

      // for(var i = 0; i < dd.features.length; i++) {
      //   var feature = dd.features[i];
      //   for(var x = 0; x < feature.geometry.coordinates.length; x++) {
      //     if (feature.geometry.type == "MultiPolygon") {


      //       feature.geometry.coordinates.forEach(element => {
      //         // element[x][y].reverse();
      //         });
      //     }
      //     else {
      //       feature.geometry.coordinates.forEach(e=>{
      //         e.reverse();
      //       });
      //     }
      //   }
      // }


      // polygonSeries1.geodata = dd;
      // chartGeo.events.on("ready", loadStores1);
      //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      // this.geodata1 = chartGeo.series.push(new am4maps.MapImageSeries());
      // // let imageSeriesTemplate = imageSeries.mapImages.template;
      // let imageSeriesTemplate1 = this.geodata1.mapImages.template;
      // let circle1 = imageSeriesTemplate1.createChild(Circle);
      // circle1.radius = 5;
      // // circle1.fill = color("#B27799");
      //  circle1.fill = color("#ed3833");
      //  circle1.stroke = color("#FFFFFF");
      //  circle1.strokeWidth = 2;
      // circle1.nonScaling = true;
      // circle1.tooltipText = "{district}";
      // imageSeriesTemplate1.propertyFields.latitude = "Latitude";
      // imageSeriesTemplate1.propertyFields.longitude = "Longitude";

      // imageSeriesTemplate1.tooltipText = "{district}: {count}";
      // circle1.tooltipText = "{constituency}";
      // imageSeriesTemplate1.propertyFields.latitude = "latitude";
      // imageSeriesTemplate1.propertyFields.longitude = "longitude";

      // imageSeriesTemplate1.tooltipText = "{constituency}: {count}";


      // function loadStores1() {
      //   let loader = new DataSource();
      //   loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
      //   loader.events.on("parseended", (ev: any) => {
      //     setupStores1(ev.target.data);
      //   });
      //   loader.load();
      // }

      // Creates a series
      // function createSeries1(heatfield) {
      //   let series = chartGeo.series.push(new am4maps.MapImageSeries());
      //   series.dataFields.value = heatfield;

      //   let template = series.mapImages.template;
      //   template.verticalCenter = "middle";
      //   template.horizontalCenter = "middle";
      //   template.propertyFields.latitude = "lat";
      //   template.propertyFields.longitude = "long";
      //   template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
      //   // template.dataItem

      //   let circle = template.createChild(Circle);
      //   circle.radius = 10;
      //   circle.fillOpacity = 0.7;
      //   circle.verticalCenter = "middle";
      //   circle.horizontalCenter = "middle";
      //   circle.nonScaling = true;

      //   let label = template.createChild(Label);
      //   label.text = "{stores}";
      //   label.fill = color("#fff");
      //   label.verticalCenter = "middle";
      //   label.horizontalCenter = "middle";
      //   label.nonScaling = true;

      //   let heat = series.heatRules.push({
      //     target: circle,
      //     property: "radius",
      //     min: 10,
      //     max: 30
      //   });

      //   // Set up drill-down
      //   series.mapImages.template.events.on("hit", (ev: any) => {

      //     // Determine what we've clicked on
      //     let data = ev.target.dataItem.dataContext;

      //     // No id? Individual store - nothing to drill down to further
      //     if (!data.target) {
      //       return;
      //     }

      //     // Create actual series if it hasn't been yet created
      //     if (!regionalSeries1[data.target].series) {
      //       regionalSeries1[data.target].series = createSeries1("count");
      //       regionalSeries1[data.target].series.data = data.markerData;
      //     }

      //     // Hide current series
      //     if (currentSeries1) {
      //       currentSeries1.hide();
      //     }

      //     // Control zoom
      //     if (data.type == "state") {
      //       let statePolygon = polygonSeries1.getPolygonById("IN-PB");
      //       chartGeo.zoomToMapObject(statePolygon);
      //     } else if (data.type == "city") {
      //       chartGeo.zoomToGeoPoint({
      //         latitude: data.lat,
      //         longitude: data.long
      //       }, 64, true);
      //     }
      //     zoomOut1.show();

      //     // Show new targert series
      //     currentSeries1 = regionalSeries1[data.target].series;
      //     currentSeries1.show();
      //   });

      //   return series;
      // }

      // let regionalSeries1: any = {};
      // let currentSeries1;

      // function setupStores1(data) {

      //   // Init country-level series
      //   regionalSeries1.IN = {
      //     markerData: [],
      //     series: createSeries1("stores")
      //   };

      //   // Set current series
      //   currentSeries1 = regionalSeries1.IN.series;

      //   // Process data
      //   array.each(data.query_results, (data: any) => {


      //     // Get store data
      //     let store = {
      //       state: data.MAIL_ST_PROV_C,
      //       long: type.toNumber(data.LNGTD_I),
      //       lat: type.toNumber(data.LATTD_I),
      //       location: data.co_loc_n,
      //       city: data.mail_city_n,
      //       count: 1000 + type.toNumber(data.count)
      //     };

      //     // Process state-level data
      //     if (regionalSeries1[store.state] == undefined) {
      //       let statePolygonForGeo: any = polygonSeries1.getPolygonById("IN-" + store.state);
      //       if (statePolygonForGeo) {
      //         // //console.log("statePolygonForGeo",statePolygonForGeo)
      //         // Add state data
      //         regionalSeries1[store.state] = {
      //           target: store.state,
      //           type: "state",
      //           name: statePolygonForGeo.dataItem.dataContext.name,
      //           count: 1000 + store.count,
      //           stores: 1,
      //           lat: statePolygonForGeo.visualLatitude,
      //           long: statePolygonForGeo.visualLongitude,
      //           state: store.state,
      //           markerData: []
      //         };
      //         regionalSeries1.IN.markerData.push(regionalSeries1[store.state]);

      //       } else {
      //         // State not found
      //         return;
      //       }
      //     } else {
      //       regionalSeries1[store.state].stores++;
      //       regionalSeries1[store.state].count += store.count;
      //     }

      //     // Process city-level data
      //     if (regionalSeries1[store.city] == undefined) {
      //       regionalSeries1[store.city] = {
      //         target: store.city,
      //         type: "city",
      //         name: store.city,
      //         count: 1000 + store.count,
      //         stores: 1,
      //         lat: store.lat,
      //         long: store.long,
      //         state: store.state,
      //         markerData: []
      //       };
      //       regionalSeries1[store.state].markerData.push(regionalSeries1[store.city]);
      //     } else {
      //       regionalSeries1[store.city].stores++;
      //       regionalSeries1[store.city].count += store.count;
      //     }

      //     // Process individual store
      //     regionalSeries1[store.city].markerData.push({
      //       name: store.location,
      //       count: 1000 + store.count,
      //       stores: 1,
      //       lat: store.lat,
      //       long: store.long,
      //       state: store.state
      //     });

      //   });

      //   regionalSeries1.IN.series.data = regionalSeries1.IN.markerData;
      // }


      // // Create chart instance
      // let chartanoth = create("anoth", am4charts.RadarChart);
      // chartanoth.scrollbarX = new Scrollbar();

      // let data = [];

      // for(var i = 0; i < 20; i++){
      //   data.push({category: i, value:Math.round(Math.random() * 100)});
      // }

      // chartanoth.data = data;
      // chartanoth.radius = percent(100);
      // chartanoth.innerRadius = percent(50);

      // // Create axes
      // let categoryAxis0 = chartanoth.xAxes.push(new am4charts.CategoryAxis());
      // categoryAxis0.dataFields.category = "category";
      // categoryAxis0.renderer.grid.template.location = 0;
      // categoryAxis0.renderer.minGridDistance = 30;
      // categoryAxis0.tooltip.disabled = true;
      // categoryAxis0.renderer.minHeight = 110;
      // categoryAxis0.renderer.grid.template.disabled = true;
      // //categoryAxis.renderer.labels.template.disabled = true;
      // let labelTemplate = categoryAxis0.renderer.labels.template;
      // labelTemplate.radius = percent(-60);
      // labelTemplate.location = 0.5;
      // labelTemplate.relativeRotation = 90;

      // let valueAxis0 = chartanoth.yAxes.push(new am4charts.ValueAxis());
      // valueAxis0.renderer.grid.template.disabled = true;
      // valueAxis0.renderer.labels.template.disabled = true;
      // valueAxis0.tooltip.disabled = true;

      // // Create series
      // let series0 = chart.series.push(new am4charts.RadarColumnSeries());
      // series0.sequencedInterpolation = true;
      // series0.dataFields.valueY = "value";
      // series0.dataFields.categoryX = "category";
      // series0.columns.template.strokeWidth = 0;
      // series0.tooltipText = "{valueY}";
      // series0.columns.template.radarColumn.cornerRadius = 10;
      // series0.columns.template.radarColumn.innerCornerRadius = 0;

      // series0.tooltip.pointerOrientation = "vertical";

      // // on hover, make corner radiuses bigger
      // let hoverState = series0.columns.template.radarColumn.states.create("hover");
      // hoverState.properties.cornerRadius = 0;
      // hoverState.properties.fillOpacity = 1;


      // series0.columns.template.adapter.add("fill", function(fill, target) {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      // // Cursor
      // chartanoth.cursor = new am4charts.RadarCursor();
      // chartanoth.cursor.innerRadius = percent(50);
      // chartanoth.cursor.lineY.disabled = true;








      // let data1 = [{
      //   "year": "1989",
      //   "value": 0.140
      // }, {
      //   "year": "1990",
      //   "value": 0.200
      // }, {
      //   "year": "1991",
      //   "value": 0.220
      // }, {
      //   "year": "1992",
      //   "value": 0.150
      // }, {
      //   "year": "1993",
      //   "value": 0.145
      // }, {
      //   "year": "1994",
      //   "value": 0.172
      // }, {
      //   "year": "1995",
      //   "value": 0.239
      // }, {
      //   "year": "1996",
      //   "value": 0.230
      // }, {
      //   "year": "1997",
      //   "value": 0.253
      // }, {
      //   "year": "1998",
      //   "value": 0.348,
      //   "disabled": false
      // }];


      // let data2 = [{
      //   "year": "1989",
      //   "value": 0.030
      // }, {
      //   "year": "1990",
      //   "value": 0.255
      // }, {
      //   "year": "1991",
      //   "value": 0.21
      // }, {
      //   "year": "1992",
      //   "value": 0.065
      // }, {
      //   "year": "1993",
      //   "value": 0.11
      // }, {
      //   "year": "1994",
      //   "value": 0.172
      // }, {
      //   "year": "1995",
      //   "value": 0.269
      // }, {
      //   "year": "1996",
      //   "value": 0.141
      // }, {
      //   "year": "1997",
      //   "value": 0.353
      // }, {
      //   "year": "1998",
      //   "value": 0.548,
      //   "disabled": false
      // }];


      // let data3 = [{
      //   "year": "1989",
      //   "value": 0.530
      // }, {
      //   "year": "1990",
      //   "value": 0.455
      // }, {
      //   "year": "1991",
      //   "value": 0.21
      // }, {
      //   "year": "1992",
      //   "value": 0.065
      // }, {
      //   "year": "1993",
      //   "value": 0.11
      // }, {
      //   "year": "1994",
      //   "value": 0.172
      // }, {
      //   "year": "1995",
      //   "value": 0.200
      // }, {
      //   "year": "1996",
      //   "value": 0.141
      // }, {
      //   "year": "1997",
      //   "value": 0.153
      // }, {
      //   "year": "1998",
      //   "value": 0.008,
      //   "disabled": false
      // }];


      // let data4 = [{
      //   "year": "1989",
      //   "value": 0.030
      // }, {
      //   "year": "1990",
      //   "value": 0.255
      // }, {
      //   "year": "1991",
      //   "value": 0.21
      // }, {
      //   "year": "1992",
      //   "value": 0.205
      // }, {
      //   "year": "1993",
      //   "value": 0.11
      // }, {
      //   "year": "1994",
      //   "value": 0.270
      // }, {
      //   "year": "1995",
      //   "value": 0.169
      // }, {
      //   "year": "1996",
      //   "value": 0.300
      // }, {
      //   "year": "1997",
      //   "value": 0.353
      // }, {
      //   "year": "1998",
      //   "value": 0.548,
      //   "disabled": false
      // }];




      // this.createKPI("kpi-today", data2, 1);
      // this.createKPI("kpi-week", data3, 2);
      // this.createKPI("kpi-month", data4, 3);






      // let chartRH = create("anoth", am4charts.RadarChart);
      // // chartRH.scrollbarX = new Scrollbar();

      // let data = [];

      // for (var i = 0; i < 15; i++) {
      //   data.push({ category: i, value: Math.round(Math.random() * 100) });
      // }

      // chartRH.data = data;
      // chartRH.radius = percent(100);
      // chartRH.innerRadius = percent(25);

      // let categoryAxisH = chartRH.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      // categoryAxisH.dataFields.category = "category";
      // categoryAxisH.renderer.grid.template.location = 0;

      // categoryAxisH.tooltip.disabled = true;
      // // categoryAxisH.renderer.minHeight = 110;
      // categoryAxisH.renderer.grid.template.disabled = true;



      // categoryAxisH.renderer.minGridDistance = 60;
      // categoryAxisH.renderer.inversed = true;
      // categoryAxisH.renderer.labels.template.location = 40;
      // categoryAxisH.renderer.grid.template.strokeOpacity = 0.08;


      // //categoryAxis.renderer.labels.template.disabled = true;
      // let labelTemplate = categoryAxisH.renderer.labels.template;
      // labelTemplate.radius = percent(-25);
      // labelTemplate.location = 0.5;
      // // labelTemplate.relativeRotation = 90;
      // labelTemplate.stroke = color("#fff");

      // let valueAxisH = chartRH.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());
      // valueAxisH.renderer.grid.template.disabled = true;
      // valueAxisH.renderer.labels.template.disabled = true;
      // valueAxisH.tooltip.disabled = true;


      // valueAxisH.min = 0;
      // valueAxisH.extraMax = 0.1;
      // valueAxisH.renderer.grid.template.strokeOpacity = 0.08;

      // chartRH.seriesContainer.zIndex = -10;


      // // Create series
      // let seriesH = chartRH.series.push(new am4charts.RadarColumnSeries());
      // // seriesH.sequencedInterpolation = true;
      // seriesH.dataFields.valueY = "value";
      // seriesH.dataFields.categoryX = "category";
      // seriesH.columns.template.strokeWidth = 0;
      // seriesH.columns.template.stroke = color("#fff");
      // seriesH.tooltipText = "{valueY}";
      // seriesH.columns.template.radarColumn.cornerRadius = 10;
      // seriesH.columns.template.radarColumn.innerCornerRadius = 0;

      // seriesH.tooltip.pointerOrientation = "vertical";
      // seriesH.columns.template.strokeOpacity = 0;





      // // on hover, make corner radiuses bigger
      // let hoverState = seriesH.columns.template.radarColumn.states.create("hover");
      // hoverState.properties.cornerRadius = 0;
      // hoverState.properties.fillOpacity = 1;


      // seriesH.columns.template.adapter.add("fill", function (fill, target) {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      // // Cursor
      // chartRH.cursor = new am4charts.RadarCursor();
      // chartRH.cursor.innerRadius = percent(50);
      // chartRH.cursor.lineY.disabled = true;







      let chartRH = create("anoth", am4charts.RadarChart);

      chartRH.data = [{
        "country": "USA",
        "visits": 2025
      }, {
        "country": "China",
        "visits": 1882
      }, {
        "country": "Japan",
        "visits": 1809
      }, {
        "country": "Germany",
        "visits": 1322
      }, {
        "country": "UK",
        "visits": 1122
      }, {
        "country": "France",
        "visits": 1114
      }, {
        "country": "India",
        "visits": 984
      }, {
        "country": "Spain",
        "visits": 711
      }, {
        "country": "Netherlands",
        "visits": 665
      }, {
        "country": "Russia",
        "visits": 580
      }, {
        "country": "South Korea",
        "visits": 443
      }, {
        "country": "Canada",
        "visits": 441
      }];

      chartRH.innerRadius = percent(40)

      let categoryAxisH = chartRH.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      categoryAxisH.renderer.grid.template.location = 0;
      categoryAxisH.dataFields.category = "country";
      categoryAxisH.renderer.minGridDistance = 60;
      categoryAxisH.renderer.inversed = true;
      categoryAxisH.renderer.labels.template.location = 0.5;
      categoryAxisH.renderer.grid.template.strokeOpacity = 0.08;
      categoryAxisH.renderer.grid.template.stroke = color("#fff");
      categoryAxisH.renderer.tooltip.disabled = true;


      let valueAxisH = chartRH.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererRadial>());
      valueAxisH.min = 0;
      valueAxisH.extraMax = 0.1;
      valueAxisH.renderer.grid.template.strokeOpacity = 0.08;
      valueAxisH.renderer.grid.template.stroke = color("#fff");
      valueAxisH.renderer.labels.template.disabled = true;


      chartRH.seriesContainer.zIndex = -10;

      let labelTemplate = categoryAxisH.renderer.labels.template;

      labelTemplate.fill = color("#fff");
      labelTemplate.fontSize = 12;

      let seriesH = chartRH.series.push(new am4charts.RadarColumnSeries());
      seriesH.dataFields.categoryX = "country";
      seriesH.dataFields.valueY = "visits";
      seriesH.tooltipText = "{valueY.value}"
      seriesH.columns.template.strokeOpacity = 0;
      seriesH.columns.template.radarColumn.cornerRadius = 5;
      seriesH.columns.template.radarColumn.innerCornerRadius = 0;
      seriesH.columns.template.stroke = color("#fff");

      // chartRH.zoomOutButton.disabled = true;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      seriesH.columns.template.adapter.add("fill", (fill, target) => {
        return chart.colors.getIndex(target.dataItem.index);
      });

      categoryAxisH.sortBySeries = seriesH;

      chartRH.cursor = new am4charts.RadarCursor();
      // chartRH.cursor.behavior = "none";
      // chartRH.cursor.lineX.disabled = true;
      // chartRH.cursor.lineY.disabled = true;




      this.heatmapGraph = create("heatmap", am4charts.RadarChart);
      this.heatmapGraph.innerRadius = percent(30);
      this.heatmapGraph.fontSize = 11;

      this.heatmapGraph.logo.disabled = true;

      let xAxis = this.heatmapGraph.xAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererCircular>());
      let yAxis = this.heatmapGraph.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
      yAxis.renderer.minGridDistance = 5;

      xAxis.renderer.labels.template.location = 0.5;
      xAxis.renderer.labels.template.bent = true;
      xAxis.renderer.labels.template.radius = 5;
      xAxis.renderer.labels.template.fill = color("#fff");


      xAxis.dataFields.category = "day";
      yAxis.dataFields.category = "month";

      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.minGridDistance = 10;

      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.inversed = true;

      // this makes the y axis labels to be bent. By default y Axis labels are regular AxisLabels, so we replace them with AxisLabelCircular
      // and call fixPosition for them to be bent
      let yAxisLabel = new am4charts.AxisLabelCircular();
      yAxisLabel.bent = true;
      yAxisLabel.events.on("validated", function (event) {
        event.target.fixPosition(-90, math.getDistance({ x: event.target.pixelX, y: event.target.pixelY }) - 5);
        event.target.dx = -event.target.pixelX;
        event.target.dy = -event.target.pixelY;
      })
      yAxis.renderer.labels.template = yAxisLabel;
      yAxis.renderer.labels.template.fill = color("#fff");

      let heatseries = this.heatmapGraph.series.push(new am4charts.RadarColumnSeries());
      heatseries.dataFields.categoryX = "day";
      heatseries.dataFields.categoryY = "month";
      heatseries.dataFields.value = "count";
      heatseries.sequencedInterpolation = true;

      let heatcolumnTemplate = heatseries.columns.template;
      heatcolumnTemplate.strokeWidth = 2;
      heatcolumnTemplate.strokeOpacity = 1;
      heatcolumnTemplate.stroke = color("#1c2233");
      heatcolumnTemplate.tooltipText = "{_id} : [bold]{value.workingValue.formatNumber('#.')}[/]";
      heatcolumnTemplate.width = percent(100);
      heatcolumnTemplate.height = percent(100);

      this.heatmapGraph.seriesContainer.zIndex = -5;

      heatcolumnTemplate.hiddenState.properties.opacity = 0;

      // heat rule, this makes columns to change color depending on value
      // color: #011f5e;
      // color: #7fabff;
      heatseries.heatRules.push({ target: heatcolumnTemplate, property: "fill", min: color("#7fabff"), max: color("#011f5e") });

      // heat legend

      let heatLegend = this.heatmapGraph.bottomAxesContainer.createChild(am4charts.HeatLegend);
      heatLegend.width = percent(100);
      heatLegend.series = heatseries;
      heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
      heatLegend.valueAxis.renderer.labels.template.fill = color("#fff");

      heatLegend.valueAxis.renderer.minGridDistance = 30;

      // heat legend behavior
      heatseries.columns.template.events.on("over", function (event) {
        handleHover(event.target);
      })

      heatseries.columns.template.events.on("hit", function (event) {
        handleHover(event.target);
      })

      function handleHover(column) {
        if (!isNaN(column.dataItem.value)) {
          heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
        }
        else {
          heatLegend.valueAxis.hideTooltip();
        }
      }

      heatseries.columns.template.events.on("out", function (event) {
        heatLegend.valueAxis.hideTooltip();
      })

      // this.heatmapGraph.data = [
      //   {
      //     "_id": "2-28",
      //     "month": 2,
      //     "day": 28,
      //     "count": 1
      //   },
      //   {
      //     "_id": "3-17",
      //     "month": 3,
      //     "day": 17,
      //     "count": 4
      //   },
      //   {
      //     "_id": "3-18",
      //     "month": 3,
      //     "day": 18,
      //     "count": 4
      //   },
      //   {
      //     "_id": "3-23",
      //     "month": 3,
      //     "day": 23,
      //     "count": 32
      //   },
      //   {
      //     "_id": "3-24",
      //     "month": 3,
      //     "day": 24,
      //     "count": 1
      //   },
      //   {
      //     "_id": "3-25",
      //     "month": 3,
      //     "day": 25,
      //     "count": 14
      //   },
      //   {
      //     "_id": "3-26",
      //     "month": 3,
      //     "day": 26,
      //     "count": 1
      //   },
      //   {
      //     "_id": "3-27",
      //     "month": 3,
      //     "day": 27,
      //     "count": 39
      //   },
      //   {
      //     "_id": "3-29",
      //     "month": 3,
      //     "day": 29,
      //     "count": 2
      //   },
      //   {
      //     "_id": "3-30",
      //     "month": 3,
      //     "day": 30,
      //     "count": 2
      //   },
      //   {
      //     "_id": "3-31",
      //     "month": 3,
      //     "day": 31,
      //     "count": 2
      //   },
      //   {
      //     "_id": "4-1",
      //     "month": 4,
      //     "day": 1,
      //     "count": 31
      //   },
      //   {
      //     "_id": "4-2",
      //     "month": 4,
      //     "day": 2,
      //     "count": 9
      //   },
      //   {
      //     "_id": "4-3",
      //     "month": 4,
      //     "day": 3,
      //     "count": 11
      //   },
      //   {
      //     "_id": "4-4",
      //     "month": 4,
      //     "day": 4,
      //     "count": 3
      //   },
      //   {
      //     "_id": "4-6",
      //     "month": 4,
      //     "day": 6,
      //     "count": 30
      //   },
      //   {
      //     "_id": "4-7",
      //     "month": 4,
      //     "day": 7,
      //     "count": 24
      //   },
      //   {
      //     "_id": "4-9",
      //     "month": 4,
      //     "day": 9,
      //     "count": 15
      //   },
      //   {
      //     "_id": "4-12",
      //     "month": 4,
      //     "day": 12,
      //     "count": 2
      //   },
      //   {
      //     "_id": "4-13",
      //     "month": 4,
      //     "day": 13,
      //     "count": 5
      //   },
      //   {
      //     "_id": "4-14",
      //     "month": 4,
      //     "day": 14,
      //     "count": 3
      //   },
      //   {
      //     "_id": "4-16",
      //     "month": 4,
      //     "day": 16,
      //     "count": 9
      //   },
      //   {
      //     "_id": "4-19",
      //     "month": 4,
      //     "day": 19,
      //     "count": 6
      //   },
      //   {
      //     "_id": "4-20",
      //     "month": 4,
      //     "day": 20,
      //     "count": 3
      //   },
      //   {
      //     "_id": "4-22",
      //     "month": 4,
      //     "day": 22,
      //     "count": 6
      //   },
      //   {
      //     "_id": "4-23",
      //     "month": 4,
      //     "day": 23,
      //     "count": 2
      //   },
      //   {
      //     "_id": "4-26",
      //     "month": 4,
      //     "day": 26,
      //     "count": 1
      //   },
      //   {
      //     "_id": "4-30",
      //     "month": 4,
      //     "day": 30,
      //     "count": 1
      //   },
      //   {
      //     "_id": "5-2",
      //     "month": 5,
      //     "day": 2,
      //     "count": 2
      //   },
      //   {
      //     "_id": "5-4",
      //     "month": 5,
      //     "day": 4,
      //     "count": 1
      //   },
      //   {
      //     "_id": "5-7",
      //     "month": 5,
      //     "day": 7,
      //     "count": 1
      //   },
      //   {
      //     "_id": "5-20",
      //     "month": 5,
      //     "day": 20,
      //     "count": 1
      //   },
      //   {
      //     "_id": "5-21",
      //     "month": 5,
      //     "day": 21,
      //     "count": 3
      //   },
      //   {
      //     "_id": "5-25",
      //     "month": 5,
      //     "day": 25,
      //     "count": 1
      //   },
      //   {
      //     "_id": "5-26",
      //     "month": 5,
      //     "day": 26,
      //     "count": 1
      //   },
      //   {
      //     "_id": "5-27",
      //     "month": 5,
      //     "day": 27,
      //     "count": 2
      //   },
      //   {
      //     "_id": "5-28",
      //     "month": 5,
      //     "day": 28,
      //     "count": 1
      //   },
      //   {
      //     "_id": "6-2",
      //     "month": 6,
      //     "day": 2,
      //     "count": 1
      //   },
      //   {
      //     "_id": "6-4",
      //     "month": 6,
      //     "day": 4,
      //     "count": 1
      //   },
      //   {
      //     "_id": "6-7",
      //     "month": 6,
      //     "day": 7,
      //     "count": 4
      //   },
      //   {
      //     "_id": "6-11",
      //     "month": 6,
      //     "day": 11,
      //     "count": 1
      //   },
      //   {
      //     "_id": "6-17",
      //     "month": 6,
      //     "day": 17,
      //     "count": 1
      //   },
      //   {
      //     "_id": "6-18",
      //     "month": 6,
      //     "day": 18,
      //     "count": 3
      //   },
      //   {
      //     "_id": "7-2",
      //     "month": 7,
      //     "day": 2,
      //     "count": 2
      //   },
      //   {
      //     "_id": "7-22",
      //     "month": 7,
      //     "day": 22,
      //     "count": 1
      //   },
      //   {
      //     "_id": "7-23",
      //     "month": 7,
      //     "day": 23,
      //     "count": 2
      //   },
      //   {
      //     "_id": "7-24",
      //     "month": 7,
      //     "day": 24,
      //     "count": 1
      //   },
      //   {
      //     "_id": "7-29",
      //     "month": 7,
      //     "day": 29,
      //     "count": 1
      //   },
      //   {
      //     "_id": "8-2",
      //     "month": 8,
      //     "day": 2,
      //     "count": 1
      //   },
      //   {
      //     "_id": "8-4",
      //     "month": 8,
      //     "day": 4,
      //     "count": 1
      //   },
      //   {
      //     "_id": "8-5",
      //     "month": 8,
      //     "day": 5,
      //     "count": 31
      //   },
      //   {
      //     "_id": "8-6",
      //     "month": 8,
      //     "day": 6,
      //     "count": 7
      //   }
      // ];





      // Create chart instance
      this.streamGraph = create("streamchart", am4charts.XYChart);

      this.streamGraph.logo.disabled = true;

      // Create axes
      let categoryAxisStream = this.streamGraph.xAxes.push(new am4charts.CategoryAxis());
      categoryAxisStream.dataFields.category = "_id";
      categoryAxisStream.renderer.grid.template.location = 0;
      categoryAxisStream.renderer.minGridDistance = 0;
      categoryAxisStream.renderer.labels.template.fill = color("#fff");
      categoryAxisStream.renderer.grid.template.stroke = color("#fff");
      categoryAxisStream.startLocation = 0.5;
      categoryAxisStream.endLocation = 0.5;

      let valueAxisstream = this.streamGraph.yAxes.push(new am4charts.ValueAxis());

      // valueAxisstream.renderer.labels.template.fill = color("#fff");
      // valueAxisstream.renderer.grid.template.stroke = color("#fff");
      valueAxisstream.renderer.grid.template.disabled = true;
      valueAxisstream.renderer.labels.template.disabled = true;
      valueAxisstream.cursorTooltipEnabled = false;




      var _this = this;


      // Legend
      this.streamGraph.legend = new am4charts.Legend();
      this.streamGraph.legend.itemContainers.template.togglable = true;
      this.streamGraph.legend.position = "right"
      this.streamGraph.legend.valign = "top";
      this.streamGraph.legend.reverseOrder = true;
      this.streamGraph.legend.labels.template.fill = color("#fff");
      this.streamGraph.legend.labels.template.fontSize = 13;

      let markerTemplate = this.streamGraph.legend.markers.template;
      markerTemplate.width = 16;
      markerTemplate.height = 16;



      // Cursor
      this.streamGraph.cursor = new am4charts.XYCursor();
      this.streamGraph.cursor.maxTooltipDistance = 0;


      this.streamGraph.legend.itemContainers.template.events.on("over", function (ev) {
        console.log("DDODN");
        // var point = categoryAxisStream.categoryToPoint(ev.target.dataItem.category);
        // _this.streamGraph.cursor.triggerMove(point, "soft");
        var series = ev.target.dataItem.dataContext;
        series.tooltip.show();
      });

      this.streamGraph.legend.itemContainers.template.events.on("out", function (ev) {
        // var point = categoryAxisStream.categoryToPoint(ev.target.dataItem.category);
        // _this.streamGraph.cursor.triggerMove(point, "none");
        var series = ev.target.dataItem.dataContext;
        series.tooltip.hide();
      });



      // Responsive
      this.streamGraph.responsive.enabled = true;
      this.streamGraph.responsive.useDefault = false;
      this.streamGraph.responsive.rules.push({
        relevant: ResponsiveBreakpoints.widthL,
        state: function (target, stateId) {
          if (target instanceof am4charts.Legend) {
            let state = target.states.create(stateId);
            state.properties.position = "bottom";
            return state;
          }
          return null;
        }
      });

      // Prepare data for the river-stacked series
      this.streamGraph.events.on("beforedatavalidated", updateData);

      function updateData() {

        let data = _this.streamGraph.data;
        if (data.length == 0) {
          return;
        }

        for (var i = 0; i < data.length; i++) {
          let row = data[i];
          let sum = 0;

          // Calculate open and close values
          _this.streamGraph.series.each(function (series) {
            let field = series.dummyData.field;
            let val = Number(row[field]);
            row[field + "_low"] = sum;
            row[field + "_hi"] = sum + val;
            sum += val;
          });

          // Adjust values so they are centered
          let offset = sum / 2;
          _this.streamGraph.series.each(function (series) {
            let field = series.dummyData.field;
            row[field + "_low"] -= offset;
            row[field + "_hi"] -= offset;
          });

        }

      }








      /* Create chart instance */
      this.proximityGraph = create("spiderchart", am4charts.RadarChart);

      this.proximityGraph.logo.disabled = true;

      /* Create axes */
      let categoryAxisSpider = this.proximityGraph.xAxes.push(new am4charts.CategoryAxis<any>());

      categoryAxisSpider.dataFields.category = "_id";
      categoryAxisSpider.renderer.labels.template.fill = color("#fff");
      categoryAxisSpider.renderer.labels.template.fontSize = 12;
      categoryAxisSpider.renderer.grid.template.stroke = color("#fff");

      let valueAxisSpider = this.proximityGraph.yAxes.push(new am4charts.ValueAxis<any>());
      // valueAxisSpider.extraMin = 0.2;
      // valueAxisSpider.extraMax = 0.2;
      valueAxisSpider.tooltip.disabled = true;

      valueAxisSpider.renderer.labels.template.fill = color("#fff");
      valueAxisSpider.renderer.grid.template.stroke = color("#fff");

      /* Create and configure series */
      let series1 = this.proximityGraph.series.push(new am4charts.RadarSeries());
      this.proximityGraph.colors.list = [
        color("#a367dc"),
        color("#6794dc"),
      ];
      series1.dataFields.valueY = "Male";
      series1.dataFields.categoryX = "_id";
      // series1.yAxis = valueAxisSpider;
      // series.xAxis = categoryAxisSpider;
      series1.strokeWidth = 2;
      series1.tooltipText = "{valueY}";
      series1.name = "Male";
      series1.bullets.create(am4charts.CircleBullet);
      series1.dataItems.template.locations.valueX = 0.5;

      let series2 = this.proximityGraph.series.push(new am4charts.RadarSeries());
      // series2.colors.list = [
      //   // color("#a367dc"),
      //   color("#6794dc"),
      // ];
      series2.dataFields.valueY = "Female";
      series2.dataFields.categoryX = "_id";
      // series2.yAxis = valueAxisSpider;
      // series2.xAxis = categoryAxisSpider;
      series2.strokeWidth = 2;
      series2.tooltipText = "{valueY}";
      series2.name = "Female";
      series2.bullets.create(am4charts.CircleBullet);
      series2.dataItems.template.locations.valueX = 2;


      this.proximityGraph.cursor = new am4charts.RadarCursor();

      this.proximityGraph.legend = new am4charts.Legend();

      this.proximityGraph.legend.labels.template.fill = color("#fff");






      // Chart for PURPOSE
      this.purposeGraph = create("purpose", am4charts.PieChart);
      this.purposeGraph.logo.disabled = true;
      // Add data
      // this.purposeGraph.data = [];
      // Add and configure Series
      //console.log("PGDATA_", this.purposeGraph.data);
      let pieSeries = this.purposeGraph.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "_id";
      pieSeries.innerRadius = percent(50);
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      pieSeries.colors.list = [
        color("#2039d1"),
        color("#207cd1"),
        color("#67b7dc"),
        color("#6894dd"),
        color("#8067dc"),
        color("#a267db"),
        color("#c667db"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#dc8c67")
      ].reverse();




      // this.purposeGraph.legend = new am4charts.Legend();
      // this.purposeGraph.legend.position = "right";

      // this.userService.themeValueBehavior.subscribe((value) => {
      //   if (value === "dark") {
      //     // this.purposeGraph.legend.labels.template.fill = color("#fff");
      //     this.purposeGraph.legend.valueLabels.template.fill = color(
      //       "#fff"
      //     );
      //   } else {
      //     this.purposeGraph.legend.labels.template.fill = color(
      //       "#2B2C2D"
      //     );
      //     this.purposeGraph.legend.valueLabels.template.fill = color(
      //       "#2B2C2D"
      //     );
      //   }
      // });







      //live purpose chart


      // let livedata = [
      //   {
      //     "2": [
      //       {
      //         "purpose": "Other",
      //         "count": 1
      //       }
      //     ]
      //   },
      //   {
      //     "3": [
      //       {
      //         "purpose": "Road Problem",
      //         "count": 3
      //       },
      //       {
      //         "purpose": "Invitation",
      //         "count": 3
      //       },
      //       {
      //         "purpose": "Electricity Problem",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Regarding Job",
      //         "count": 6
      //       },
      //       {
      //         "purpose": "Meeting",
      //         "count": 38
      //       },
      //       {
      //         "purpose": "Sewer Problem",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Other",
      //         "count": 47
      //       }
      //     ]
      //   },
      //   {
      //     "4": [
      //       {
      //         "purpose": "Road Problem",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Other",
      //         "count": 18
      //       },
      //       {
      //         "purpose": "Electricity Problem",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Water Problem",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Regarding Job",
      //         "count": 9
      //       },
      //       {
      //         "purpose": "Invitation",
      //         "count": 11
      //       },
      //       {
      //         "purpose": "Political Purpose",
      //         "count": 4
      //       },
      //       {
      //         "purpose": "Meeting",
      //         "count": 116
      //       }
      //     ]
      //   },
      //   {
      //     "5": [
      //       {
      //         "purpose": "Other",
      //         "count": 5
      //       },
      //       {
      //         "purpose": "Road Problem",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Electricity Problem",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Meeting",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Regarding Job",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Water Problem",
      //         "count": 1
      //       }
      //     ]
      //   },
      //   {
      //     "6": [
      //       {
      //         "purpose": "Regarding Job",
      //         "count": 4
      //       },
      //       {
      //         "purpose": "Invitation",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Other",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Political Purpose",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Meeting",
      //         "count": 2
      //       },
      //       {
      //         "purpose": "Political Function",
      //         "count": 1
      //       }
      //     ]
      //   },
      //   {
      //     "7": [
      //       {
      //         "purpose": "Regarding Job",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Meeting",
      //         "count": 3
      //       },
      //       {
      //         "purpose": "Other",
      //         "count": 1
      //       },
      //       {
      //         "purpose": "Road Problem",
      //         "count": 2
      //       }
      //     ]
      //   },
      //   {
      //     "8": [
      //       {
      //         "purpose": "Meeting",
      //         "count": 7
      //       },
      //       {
      //         "purpose": "Other",
      //         "count": 33
      //       }
      //     ]
      //   }
      // ]
      // let allPurposes = ["Regarding Job", "Invitation", "Meeting", "Electricity Problem", "Water Problem", "Road Problem", "Sewer Problem", "Political Purpose", "Political Function", "Meeting Leadership", "Other"];


      this.livepurposeGraph = create("livepurpose", am4charts.XYChart);
      this.livepurposeGraph.padding(40, 40, 40, 40);
      this.livepurposeGraph.logo.disabled = true;

      // this.livepurposeGraph.numberFormatter.bigNumberPrefixes = [
      //   { "number": 1e+3, "suffix": "K" },
      //   { "number": 1e+6, "suffix": "M" },
      //   { "number": 1e+9, "suffix": "B" }
      // ];

      this.livepurposeGraph.label = this.livepurposeGraph.plotContainer.createChild(Label);
      this.livepurposeGraph.label.x = percent(97);
      this.livepurposeGraph.label.y = percent(95);
      this.livepurposeGraph.label.horizontalCenter = "right";
      this.livepurposeGraph.label.verticalCenter = "middle";
      this.livepurposeGraph.label.dx = -15;
      this.livepurposeGraph.label.fontSize = 50;

      let playButton = this.livepurposeGraph.plotContainer.createChild(PlayButton);
      playButton.x = percent(97);
      playButton.y = percent(95);
      playButton.dy = -2;
      playButton.verticalCenter = "middle";
      playButton.events.on("toggled", function (event) {
        if (event.target.isActive) {
          play();
        }
        else {
          stop();
        }
      })


      let stepDuration = 4000;

      let categoryAxis = this.livepurposeGraph.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "purpose";
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      var valuex = this.livepurposeGraph.xAxes.push(new am4charts.ValueAxis());
      // valuex.min = 1;
      valuex.rangeChangeEasing = ease.linear;
      valuex.rangeChangeDuration = stepDuration;
      // valuex.renderer.minGridDistance = 100;
      valuex.renderer.grid.template.disabled = true;
      valuex.renderer.labels.template.disabled = true;


      valuex.extraMax = 0.2;

      let series = this.livepurposeGraph.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "purpose";
      series.dataFields.valueX = "count";
      series.tooltipText = "{valueX.value}"
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.interpolationDuration = stepDuration;
      series.interpolationEasing = ease.linear;

      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "right";
      labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.as')}";
      labelBullet.label.textAlign = "end";
      labelBullet.label.fill = color("#fff");
      labelBullet.label.fontSize = 13;
      labelBullet.label.dx = -10;

      this.livepurposeGraph.zoomOutButton.disabled = true;


      this.userService.themeValueBehavior.subscribe((value) => {
        if (value === "dark") {
          valuex.renderer.labels.template.fill = color("#fff");
          categoryAxis.renderer.labels.template.fill = color("#fff");
          valuex.title.fill = color("#fff");
          this.livepurposeGraph.label.fill = color("#fff");
          categoryAxis.title.fill = color("#fff");
        } else {
          valuex.renderer.labels.template.fill = color("#2B2C2D");
          categoryAxis.renderer.labels.template.fill = color("#2B2C2D");
          valuex.title.fill = color("#2B2C2D");
          this.livepurposeGraph.label.fill = color("#2B2C2D");
          categoryAxis.title.fill = color("#2B2C2D");
        }
      });


      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", (fill, target) => {
        return this.livepurposeGraph.colors.getIndex(target.dataItem.index);
      });

      // this.liveyear = 2;
      // label.text = this.liveyear.toString();
      this.livepurposeGraph.label.text = "";


      let interval;

      function play() {
        interval = setInterval(function () {
          nextYear();
        }, stepDuration)
        nextYear();
      }

      function stop() {
        if (interval) {
          clearInterval(interval);
        }
      }


      let nextYear = () => {

        this.liveyear++;

        //console.log('FIRDTLAT:', this.firstlivekey, this.lastlivekey);

        if (this.liveyear > this.lastlivekey) {
          this.liveyear = this.firstlivekey;
        }
        let newData;
        if (this.livepurposeGraphData[this.liveyear])
          newData = this.livepurposeGraphData[this.liveyear];


        //console.log(newData);

        let itemsWithNonZero = 0;

        // //console.log("mainlive:", newData);

        // this.livepurposeGraph.data = newData;

        for (var i = 0; i < this.livepurposeGraph.data.length; i++) {
          // //console.log("newDATAi:", i, newData[i]);
          // if(newData[i].count){
          this.livepurposeGraph.data[i].count = newData[i].count;

          if (this.livepurposeGraph.data[i].count > 0) {
            itemsWithNonZero++;
          }
          // }
        }

        // if (this.liveyear == this.livepurposeGraphData) {
        //   series.interpolationDuration = stepDuration / 4;
        //   valueAxis.rangeChangeDuration = stepDuration / 4;
        // }
        // else {
        //   series.interpolationDuration = stepDuration;
        //   valueAxis.rangeChangeDuration = stepDuration;
        // }

        this.livepurposeGraph.invalidateRawData();

        var livemonth = moment(this.liveyear, 'MM-DD-YYYY');

        this.livepurposeGraph.label.text = livemonth.isValid() ? livemonth.format('MMM') : this.liveyear.toString();

        categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });


      }

      // this.livepurposeGraph.label.text = this.firstlivekey;


      categoryAxis.sortBySeries = series;

      // //console.log("LIVEDATA::", this.livepurposeGraph.data);
      this.livepurposeGraph.categoryAxis = categoryAxis;
      this.livepurposeGraph.sortseries = series;


      // this.livepurposeGraph.data = this.livepurposeGraphData[this.liveyear];


      series.events.on("inited", () => {
        // categoryAxis.zoom({ start: 0, end: 1 / this.livepurposeGraph.data.length });
        setTimeout(() => {
          playButton.isActive = true; // this starts interval
          //console.log("new");
        }, 2000)
      })



      //endlive purpose chart


      //bubblecastchart

      let bubblechart = create("bubblechart", am4plugins_forceDirected.ForceDirectedTree);

      bubblechart.logo.disabled = true;

      this.networkSeries = bubblechart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())




      this.networkSeries.colors.list = [
        color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"),
        color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"), color("#2039d1"),
        color("#305ae3"),
        color("#207cd1"),
        color("#409bdb"),
        color("#43a8d6"),
        color("#55add5"),
        color("#67b7dc"),
        color("#598adb"),
        color("#6894dd"),
        color("#6767dc"),
        color("#8067dc"),
        color("#935bd9"),
        color("#a267db"),
        color("#af5dd1"),
        color("#c667db"),
        color("#d95ad5"),
        color("#dc67cf"),
        color("#dc67ab"),
        color("#dd6789"),
        color("#e56d8f"),
        color("#dc67ab"),
        color("#ef707c"),
        color("#dc8c67"),

      ];

      this.networkSeries.dataFields.linkWith = "linkWith";
      this.networkSeries.dataFields.name = "_id";
      this.networkSeries.dataFields.id = "_id";
      this.networkSeries.dataFields.value = "count";
      this.networkSeries.dataFields.children = "children";
      this.networkSeries.links.template.distance = 1;
      this.networkSeries.nodes.template.tooltipText = "{id} {count}";
      this.networkSeries.nodes.template.fillOpacity = 1;
      this.networkSeries.nodes.template.outerCircle.scale = 1;
      this.networkSeries.strokeWidth = 0;
      this.networkSeries.nodes.template.strokeWidth = 0;

      this.networkSeries.nodes.template.outerCircle.disabled = true;

      this.networkSeries.nodes.template.outerCircle.strokeDasharray = "0";


      this.networkSeries.nodes.template.label.text = "{id}"
      this.networkSeries.fontSize = 11;
      this.networkSeries.nodes.template.label.fill = color("#000");
      this.networkSeries.nodes.template.label.hideOversized = false;
      this.networkSeries.nodes.template.label.truncate = true;
      this.networkSeries.minRadius = percent(3.7);
      this.networkSeries.manyBodyStrength = -6;
      this.networkSeries.links.template.strokeOpacity = 0;

      //endbubblechart


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


      genderSeries.dataFields.value = 0;
      genderSeries.dataFields.category = "Female";

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
        color("#67b7dc"),
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
      this.timeFrameXText.title.text = "MONTHS";

      // this.timeFrameXText.renderer.labels.template.events.on("over", function(ev) {
      //   var point = this.timeFrameXText?.categoryToPoint(ev.target.dataItem.category);
      //   this.timeFrameGraphData.cursor.triggerMove(point, "soft");
      // });

      this.timeFrameXText?.renderer.labels.template.events.on("out", function (ev) {
        if (this.timeFrameXText) {
          var point = this.timeFrameXText?.categoryToPoint(ev.target.dataItem.category);
          this.timeFrameGraphData.cursor.triggerMove(point, "none");
        }
      });


      let valueAxis = this.timeFrameGraphData.yAxes.push(
        new am4charts.ValueAxis()
      );
      valueAxis.title.text = "VISITORS";
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
      casteCategoryAxis?.renderer.labels.template.events.on("out", function (ev) {
        if (casteCategoryAxis) {
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
      casteCategoryAxis.title.text = "CASTE CATEGORY";
      let casteValueAxis = this.casteGraph.yAxes.push(
        new am4charts.ValueAxis()
      );
      casteValueAxis.title.text = "VISITORS";
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


  setLivepurposeGraph = (livedata: any[], allPurposes) => {
    // utility function to sum to object values (without the id)
    const sumItem = ({ purpose, ...a }, b) => ({
      purpose,
      ...Object.keys(a)
        .reduce((r, k) => ({ ...r, [k]: a[k] + b[k] }), {})
    });

    const sumObjectsByKey = (...arrs) => [...
      [].concat(...arrs) // combine the arrays
        .reduce((m, o) => // retuce the combined arrays to a Map
          m.set(o.purpose, // if add the item to the Map
            m.has(o.purpose) ? sumItem(m.get(o.purpose), o) : { ...o } // if the item exists in Map, sum the current item with the one in the Map. If not, add a clone of the current item to the Map
          )
          , new Map).values()];

    var sum = [];
    // //console.log("livedata",livedata);
    let finallivedata = livedata.reduce((obj, d) => {
      const key = Object.keys(d)[0];
      let ary: Array<any> = d[key];
      // //console.log("star", d, key);
      allPurposes.forEach(purpose => {
        // if purpose not in ary then push and count
        const found = ary.some(el => el.purpose === purpose);
        if (!found) ary.push({ "purpose": purpose, count: 0 });
      });
      ary.sort((a, b) => a.purpose.localeCompare(b.purpose));
      // //console.log("ary:", ary);
      // //console.log("SUM", sum);
      sum = sumObjectsByKey(sum, ary);
      obj[key] = sum;
      // //console.log("obj:", obj);
      return obj;
    }, sum);

    // //console.log(finallivedata);

    return finallivedata;

  }

  setDistrictStreamGraph = () => {
    // Create series
    if (this.streamGraph.data) {
      //   while(this.streamGraph.series.length) {
      //     this.streamGraph.series.removeIndex(0).dispose();
      //     this.streamGraph.series.dummyData = nyll
      // }

      this.streamGraph.invalidateData();
      // this.streamGraph.series.dispose();
      var keys = Object.keys(this.streamGraph.data[0]);
      //splice _id which is 0 index
      keys.splice(0, 1);
      keys.forEach(el => {
        this.createSeriesStream(el, el.toUpperCase());
      });
    }

  }

  createSeriesStream(field, name) {
    let series = this.streamGraph.series.push(new am4charts.LineSeries());
    series.dummyData = {
      field: field
    }
    series.dataFields.valueY = field + "_hi";
    series.dataFields.openValueY = field + "_low";
    series.dataFields.categoryX = "_id";
    series.name = name;
    series.tooltipText = "[font-size: 18]{name}[/]\n{categoryX}: [bold]{" + field + "}[/]";
    series.strokeWidth = 1;
    series.fillOpacity = 1;
    series.tensionX = 0.8;

    return series;
  }

  prepend(value, array) {
    var newArray = array.slice();
    newArray.unshift(value);
    return newArray;
  }

  createKPI(div, kpiData: any[], theme) {


    var themes = [
      {
        linecolor: color("#1f39d1"),
        dotcolor: color("#2d4bfc"),
        gradient: this.createGradient(color('#192eac'))
      },
      {
        linecolor: color("#6ac2ea"),
        dotcolor: color("#9ce0ff"),
        gradient: this.createGradient(color('#67b7dc'))
      },
      {
        linecolor: color("#8c72ef"),
        dotcolor: color("#a992ff"),
        gradient: this.createGradient(color('#8067dc'))
      },
      {
        linecolor: color("#f16ee2"),
        dotcolor: color("#ff85f1"),
        gradient: this.createGradient(color('#dc67ce'))
      }
    ];

    // Create chart instance
    var kpichart1 = create(div, am4charts.XYChart);

    kpichart1.logo.disabled = true;
    kpichart1.padding(5, 20, 15, 0);

    if (kpiData.length) {
      let last = kpiData[kpiData.length - 1];
      if (kpiData.length < 2)
        kpiData = this.prepend({ _id: "0", count: (0.3 * last.count) }, kpiData);
      last.disabled = false;

    }
    // Add data
    kpichart1.data = kpiData;
    // Create axes
    let dateAxis1 = kpichart1.xAxes.push(new am4charts.CategoryAxis());
    dateAxis1.dataFields.category = "_id";
    dateAxis1.renderer.minGridDistance = 100;
    dateAxis1.renderer.grid.template.location = 1;
    // dateAxis1.baseInterval = {
    //   count: 1,
    //   timeUnit: "year"
    // }

    dateAxis1.renderer.grid.template.strokeWidth = 0;

    let kpivalueAxis = kpichart1.yAxes.push(new am4charts.ValueAxis());

    kpivalueAxis.renderer.grid.template.strokeWidth = 0;
    // kpivalueAxis.min = 0;
    kpivalueAxis.extraMax = 0.3;

    kpivalueAxis.logarithmic = true;

    dateAxis1.renderer.labels.template.disabled = true;
    kpivalueAxis.renderer.labels.template.disabled = true;

    // Create series
    let kpiseries = kpichart1.series.push(new am4charts.LineSeries());
    kpiseries.dataFields.valueY = "count";
    kpiseries.dataFields.categoryX = "_id";
    kpiseries.strokeWidth = 2;
    kpiseries.connect = true;
    kpiseries.tensionX = 0.8;
    kpiseries.fillOpacity = 1;


    kpiseries.fill = themes[theme].gradient;


    let bullet = kpiseries.bullets.push(new am4charts.CircleBullet());
    // bullet.stroke =  InterfaceColorSet().getFor("background");
    bullet.disabled = true;
    bullet.propertyFields.disabled = "disabled";

    bullet.strokeWidth = 4;
    bullet.tooltipText = "{valueY}";
    bullet.circle.radius = 2;
    bullet.circle.stroke = themes[theme].dotcolor;

    bullet.adapter.add("fill", function (fill, target) {

      return fill;
    })

    let range = kpivalueAxis.createSeriesRange(kpiseries);
    range.value = 0;
    range.endValue = 200;
    range.contents.stroke = themes[theme].linecolor;
    range.contents.fill = themes[theme].gradient;
    range.contents.fillOpacity = 1;



  }

  createGradient = (color) => {

    let gradient = new LinearGradient();
    gradient.addColor(color, 0.6);
    gradient.addColor(color, 0.3);
    gradient.addColor(color, 0.1);
    gradient.addColor(color, 0);
    gradient.rotation = 90;

    return gradient;

  }


  removeFilter(filter) {
    if (this.appliedFilters.hasOwnProperty(filter)) {
      const filterObj = {
        key: filter,
        value: "remove",
      };


      delete this.appliedFilters[filter];

      // //console.log(this.appliedFilters);
      if (Object.keys(this.appliedFilters).length === 0)
        this.resetFilter();
      else
        this.getVisitAnalyticGraphData(filterObj);

    }



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
  getVisitorOccupationData() {
    this.userService.getVisitorOccupation().subscribe(
      (response: any) => {
        if (response.error === false) {
          //console.log(response.data)
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
  // geoMapDistrict(){
  //   //Graph Geo Map District
  //           // Create map instance
  //           let chartGeo = create("geoMap1", am4maps.MapChart);
  //           chartGeo.logo.disabled = true;
  //           chartGeo.maxZoomLevel = 64;
  //           // //console.log("dfgh")
  //           chartGeo.geodata = am4geodata_worldLow;
  //           // chart.geodata =[{type: "FeatureCollection",features:[{geometry:{coordinates:[-134.6803, 58.1617]}}]}]

  //           // Set projection
  //           chartGeo.projection = new am4maps.projections.Projection();

  //           // Add button
  //           let zoomOut1 = chartGeo.tooltipContainer.createChild(ZoomOutButton);
  //           zoomOut1.align = "right";
  //           zoomOut1.valign = "top";
  //           zoomOut1.margin(20, 20, 20, 20);
  //           zoomOut1.events.on("hit", function () {
  //             if (currentSeries1) {
  //               currentSeries1.hide();
  //             }
  //             chartGeo.goHome();
  //             zoomOut1.hide();
  //             currentSeries1 = regionalSeries1.IN.series;
  //             currentSeries1.show();
  //           });
  //           zoomOut1.hide();

  //           // Create map polygon series
  //           let polygonSeries1 = chartGeo.series.push(new am4maps.MapPolygonSeries());
  //           polygonSeries1.useGeodata = true;
  //           polygonSeries1.calculateVisualCenter = true;

  //           // Configure series
  //           let polygonTemplate1 = polygonSeries1.mapPolygons.template;
  //           polygonTemplate1.tooltipText = "{name}";
  //           polygonTemplate1.fill = chartGeo.colors.getIndex(0);
  //           //shantam
  //           polygonSeries1.include = ["IN-DL"];
  //           chartGeo.events.on("ready", loadStores1);
  //           //let imageSeries = chart.series.push(new am4maps.MapImageSeries());
  //           this.geodata = chartGeo.series.push(new am4maps.MapImageSeries());
  //           // let imageSeriesTemplate = imageSeries.mapImages.template;
  //           let imageSeriesTemplate1 = this.geodata.mapImages.template;
  //           let circle1 = imageSeriesTemplate1.createChild(Circle);
  //           circle1.radius = 4;
  //           circle1.fill = color("#B27799");
  //           circle1.stroke = color("#FFFFFF");
  //           circle1.strokeWidth = 2;
  //           circle1.nonScaling = true;
  //           circle1.tooltipText = "{constituency}";
  //           imageSeriesTemplate1.propertyFields.latitude = "latitude";
  //           imageSeriesTemplate1.propertyFields.longitude = "longitude";

  //           imageSeriesTemplate1.tooltipText = "{constituency}: {count}";

  //           function loadStores1() {
  //             let loader = new DataSource();
  //             loader.url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json";
  //             loader.events.on("parseended", (ev: any) => {
  //               setupStores1(ev.target.data);
  //             });
  //             loader.load();
  //           }

  //           // Creates a series
  //           function createSeries1(heatfield) {
  //             let series = chartGeo.series.push(new am4maps.MapImageSeries());
  //             series.dataFields.value = heatfield;

  //             let template = series.mapImages.template;
  //             template.verticalCenter = "middle";
  //             template.horizontalCenter = "middle";
  //             template.propertyFields.latitude = "lat";
  //             template.propertyFields.longitude = "long";
  //             template.tooltipText = "{name}:\n[bold]{stores} stores[/]";
  //             // template.dataItem

  //             let circle = template.createChild(Circle);
  //             circle.radius = 10;
  //             circle.fillOpacity = 0.7;
  //             circle.verticalCenter = "middle";
  //             circle.horizontalCenter = "middle";
  //             circle.nonScaling = true;

  //             let label = template.createChild(Label);
  //             label.text = "{stores}";
  //             label.fill = color("#fff");
  //             label.verticalCenter = "middle";
  //             label.horizontalCenter = "middle";
  //             label.nonScaling = true;

  //             let heat = series.heatRules.push({
  //               target: circle,
  //               property: "radius",
  //               min: 10,
  //               max: 30
  //             });

  //             // Set up drill-down
  //             series.mapImages.template.events.on("hit", (ev: any) => {

  //               // Determine what we've clicked on
  //               let data = ev.target.dataItem.dataContext;

  //               // No id? Individual store - nothing to drill down to further
  //               if (!data.target) {
  //                 return;
  //               }

  //               // Create actual series if it hasn't been yet created
  //               if (!regionalSeries1[data.target].series) {
  //                 regionalSeries1[data.target].series = createSeries1("count");
  //                 regionalSeries1[data.target].series.data = data.markerData;
  //               }

  //               // Hide current series
  //               if (currentSeries1) {
  //                 currentSeries1.hide();
  //               }

  //               // Control zoom
  //               if (data.type == "state") {
  //                 let statePolygon = polygonSeries1.getPolygonById("IN-PB");
  //                 chartGeo.zoomToMapObject(statePolygon);
  //               } else if (data.type == "city") {
  //                 chartGeo.zoomToGeoPoint({
  //                   latitude: data.lat,
  //                   longitude: data.long
  //                 }, 64, true);
  //               }
  //               zoomOut1.show();

  //               // Show new targert series
  //               currentSeries1 = regionalSeries1[data.target].series;
  //               currentSeries1.show();
  //             });

  //             return series;
  //           }

  //           let regionalSeries1: any = {};
  //           let currentSeries1;

  //           function setupStores1(data) {

  //             // Init country-level series
  //             regionalSeries1.IN = {
  //               markerData: [],
  //               series: createSeries1("stores")
  //             };

  //             // Set current series
  //             currentSeries1 = regionalSeries1.IN.series;

  //             // Process data
  //             array.each(data.query_results, (data: any) => {


  //               // Get store data
  //               let store = {
  //                 state: data.MAIL_ST_PROV_C,
  //                 long: type.toNumber(data.LNGTD_I),
  //                 lat: type.toNumber(data.LATTD_I),
  //                 location: data.co_loc_n,
  //                 city: data.mail_city_n,
  //                 count: type.toNumber(data.count)
  //               };

  //               // Process state-level data
  //               if (regionalSeries1[store.state] == undefined) {
  //                 let statePolygonForGeo: any = polygonSeries1.getPolygonById("IN-" + store.state);
  //                 if (statePolygonForGeo) {

  //                   // Add state data
  //                   regionalSeries1[store.state] = {
  //                     target: store.state,
  //                     type: "state",
  //                     name: statePolygonForGeo.dataItem.dataContext.name,
  //                     count: store.count,
  //                     stores: 1,
  //                     lat: statePolygonForGeo.visualLatitude,
  //                     long: statePolygonForGeo.visualLongitude,
  //                     state: store.state,
  //                     markerData: []
  //                   };
  //                   regionalSeries1.IN.markerData.push(regionalSeries1[store.state]);

  //                 } else {
  //                   // State not found
  //                   return;
  //                 }
  //               } else {
  //                 regionalSeries1[store.state].stores++;
  //                 regionalSeries1[store.state].count += store.count;
  //               }

  //               // Process city-level data
  //               if (regionalSeries1[store.city] == undefined) {
  //                 regionalSeries1[store.city] = {
  //                   target: store.city,
  //                   type: "city",
  //                   name: store.city,
  //                   count: store.count,
  //                   stores: 1,
  //                   lat: store.lat,
  //                   long: store.long,
  //                   state: store.state,
  //                   markerData: []
  //                 };
  //                 regionalSeries1[store.state].markerData.push(regionalSeries1[store.city]);
  //               } else {
  //                 regionalSeries1[store.city].stores++;
  //                 regionalSeries1[store.city].count += store.count;
  //               }

  //               // Process individual store
  //               regionalSeries1[store.city].markerData.push({
  //                 name: store.location,
  //                 count: store.count,
  //                 stores: 1,
  //                 lat: store.lat,
  //                 long: store.long,
  //                 state: store.state
  //               });

  //             });

  //             regionalSeries1.IN.series.data = regionalSeries1.IN.markerData;
  //           }


  // }

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
    const range = { fromDate: fromdate, toDate: currentTime }
    this.userService.getVisitorByFilter(
      this.filterKeyword ? this.filterKeyword.search : '',
      this.filterKeyword ? this.filterKeyword.purpose : '',
      this.filterKeyword ? this.filterKeyword.date : '',
      this.pageIndexOfListingTable).subscribe(
        (response: any) => {
          if (response.error === false) {
            this.visitorLists = response.data.response;
            this.exportList = [];
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
                revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
                visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                totalVisits: this.visitorLists[i].totalVisits,
                remark: this.visitorLists[i].objectiveInfoRemark,
                politicalRemark: this.visitorLists[i].politicalInforRemark,

              })

            }
            this.dataSource = new MatTableDataSource<any>(this.visitorLists);
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

  getVisitorList(pageIndexOfListingTable?: any): void {
    // this.isLoadingResults = true;
    var currentTime = new Date();
    var fromdate = new Date("Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)");
    const range = { fromDate: fromdate, toDate: currentTime }
    this.userService.getVisitorList(pageIndexOfListingTable).subscribe(
      (response: any) => {
        if (response.error === false) {
          this.visitorLists = response.data.response;

          this.visitorListsTotalLength = response.data.length;
          this.exportList = [];
          for (var i = 0; i <= this.visitorLists.length - 1; i++) {
            var d = new Date(this.visitorLists[i].createdAt);

            var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            var Ed = new Date(this.visitorLists[i].enrollmentDate);

            var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
            this.exportList.push({
              serial: i + 1,
              uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
              fullName: this.visitorLists[i].fullName,
              // address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
              address: "data dummy address",
              createdAt: day,
              enrollmentDate: Eday,
              mobile: this.visitorLists[i].mobile,
              revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
              revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
              visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
              totalVisits: this.visitorLists[i].totalVisits,
              remark: this.visitorLists[i].objectiveInfoRemark,
              politicalRemark: this.visitorLists[i].politicalInforRemark,

            })
          }

          // //console.log(this.dataSource)
          // //console.log(this.visitorLists)
          this.dataSource = new MatTableDataSource<any>(this.visitorLists);
          this.pageLength = response.data.length;
          // this.dataSource.paginator = this.paginator;
          // this.paginator.pageIndex = 0;
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
        "Date": ("0" + new Date(element.createdAt).getDate()).slice(-2) + "-" + ("0" + (new Date(element.createdAt).getMonth() + 1)).slice(-2) + "-" +
          new Date(element.createdAt).getFullYear(),
        "Enrollment Date": ("0" + new Date(element.enrollmentDate).getDate()).slice(-2) + "-" + ("0" + (new Date(element.enrollmentDate).getMonth() + 1)).slice(-2) + "-" +
          new Date(element.enrollmentDate).getFullYear(),
        "Mobile": element.mobile,
        "Caste": element.caste,
        "DOB": ("0" + new Date(element.dob).getDate()).slice(-2) + "-" + ("0" + (new Date(element.dob).getMonth() + 1)).slice(-2) + "-" +
          new Date(element.dob).getFullYear(),
        "Gender": element.gender,
        "Father Name": element.father,
        "Mother Name": element.mother,
        "House Number": element.houseNumber,
        "Occupation": element.occupation,
        "Tehsil": element.tehsil,
        "District": element.district,
        "Area PIN": element.zipCode,
        // "Visitor Voter Id Number": element.address.voterId,
        "Visitor Voter Id Number": element.voterId,
        "Constituency": element.constituency,
        "Area": element.address.area,
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
        "Is Party Member": element.politicalinfo.isSamajwadiPartyMember,
        "Total no of Visits": element.totalVisits,
        "Remarks": element.objectiveInfoRemark,
        "Remarks (In case if the visitor comes with some reference)": element.politicalInforRemark,
        "Reference mobile number": element.refrenceMobile,
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
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        5: { cellWidth: 25 },
        10: { cellWidth: 15 },
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

  // getVisitorPurposeOptionData() {
  //   this.userService.getVisitorPurposeOptionData().subscribe(
  //     (response: any) => {
  //       //console.log("response.data", response.data)
  //       this.purposes = response.data;
  //     },
  //     (error) => {
  //       this._snackBar.open(error.message, "", {
  //         duration: 5000,
  //       });
  //     }
  //   );
  // }
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


  //          //console.log(" this.exportAllDataVar ",response.data.response)

  //         //  this.isLoadingResults = false;
  //         }
  //       },
  //       (error) => {
  //         this.isLoadingResults = false;
  //         //console.log("error.message",error)

  //         this._snackBar.open(error.message, "", {
  //           duration: 5000,
  //         });
  //       }
  //     );
  //   }
  filterByName(value) {
    this.filterValue = value
    this.filterInitial = ''
    this.range.reset()
    this.filterTable()
  }
  filterPurpose(value) {
    this.filterInitial = value
    this.filterValue = ''
    this.range.reset()
    this.filterTable()
  }
  filterDate() {
    this.filterInitial = ''
    this.filterValue = ''
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
            this.exportList = [];
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
                revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
                visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
                totalVisits: this.visitorLists[i].totalVisits,
                remark: this.visitorLists[i].objectiveInfoRemark,
                politicalRemark: this.visitorLists[i].politicalInforRemark,

              })

            }
            this.dataSource = new MatTableDataSource<any>(this.visitorLists);
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
    // this.paginator.pageIndex = 0;
    // this.visitorListsTotalLength = 1;
    // this.filterInitial = "";
    // this.filterValue = "";

    this.filteredVisitorCount = "";
    this.getVisitAnalyticGraphData();
    this.viewGraphresetBtn = false;

    this.range.reset();
    // this.pageLength = 0;
    // this.range.controls.fromDate.setValue("");
    // this.range.controls.toDate.setValue("");
    // this.filterKeyword = {
    //   search: this.filterInitial,
    //   purpose: this.filterValue,
    //   date: this.range.value,
    // }
    // // this.getFilterMeetStatus()
    // this.filterTable()
    // //console.log(this.appliedFilters)
    //this.getVisitorList(1);
  }

  getVisitorDetail(visitorId): void {
    this.router.navigate(["/add-visitor", visitorId]);
  }

  getVisitAnalyticData() {
    this.loader = true;

    this.userService.getVisitAnalyticData().subscribe(
      (response: any) => {
        if (response.error === false) {
          this.loader = false;
          this.anlyticData = response.data;
          this.kpi_total = response.data.kpi_total;
          this.kpi_today = response.data.kpi_today;
          this.kpi_week = response.data.kpi_week;
          this.kpi_month = response.data.kpi_month;


          var starting = moment(this.kpi_total[0]._id, 'MM-DD-YYYY');

          this.kpi_total_percent = starting.isValid() ? starting.format('MMMM YYYY') : "";
          this.kpi_today_percent = this.percentage(response.data.lastWeekVisits, _.sumBy(this.kpi_today , function(o:any) { return o.count;}));
          this.kpi_week_percent = this.percentage(response.data.lastMonthVisits, _.sumBy(this.kpi_week , function(o:any) { return o.count;}));
          this.kpi_month_percent = this.percentage(response.data.lastYearVisits, response.data.thisYearVisits);
          // 50
           


          this.createKPI("kpi-total", this.kpi_total, 0);
          this.createKPI("kpi-today", this.kpi_today, 1);
          this.createKPI("kpi-week", this.kpi_week, 2);
          this.createKPI("kpi-month", this.kpi_month, 3);

          console.log("kpi_lastweek:", response.data.lastMonthVisits);
          console.log("kpi_lastMONTH:") ;

          console.log("percentage:", this.percentage(2, 11));




          console.log("KPITOT:", response.data.kpi_total);
          console.log("KPITODAY:", response.data.kpi_today);
          console.log("KPIWEEK:", response.data.kpi_week);
          console.log("KPIMONTH:", response.data.kpi_month);

        }
      },
      (error) => {
        this.loader = false;
        this._snackBar.open(error.message, "", {
          duration: 5000,
        });
      }
    );
  }

  percentage(old, curr) {
    if (old < 1 && curr < 1)
      return 0;
    if (old < 1 && curr > 0)
      return 100;

    return Math.round((curr / old) * 100);
  }

  setToPollingTableView(): void {
    const ele = document.getElementById("exportVisitorListTable");
    ele.scrollIntoView({
      behavior: "smooth",
    });
  }

  absolute(num) {
    return Math.abs(num);
  }

  ngOnChanges(): void {
    // this.ngAfterViewInit();

  }
  getVisitAnalyticGraphData(filterValue?: any) {

    //getanaly

    //console.log('filterdedd', filterValue);

    if (filterValue) {
      this.viewGraphresetBtn = true;
      this.isLoadingResults = true;
    }

    this.graphDataLoader = true;

    this.userService.graphDataLoader.next(true);



    this.userService.getVisitAnalyticGraphData(filterValue).subscribe(
      (response: any) => {
        if (response.error === false) {

          //console.log("SUCCESSFULL ARRIVED");
          this.userService.graphDataLoader.next(false);
          if (!filterValue) {
            this.purposes = response.data.purpose;
            //console.log("purposes", this.purposes);
          }

          // //console.log('Purpose:', this.purposeGraph.data);
          // //console.log("castedat:", this.casteGraph.data);
          // //console.log("timeframe:", response.data.timeFrame);



          if (response.data.purpose)
            this.purposeGraph.data = response.data.purpose;
          if (response.data.gender) {
            this.genderGraph.data = response.data.gender;
            if (this.genderGraph.data.length < 2)
              this.genderGraph.data = _.unionBy(this.genderGraph.data, [{ _id: "Male", count: 0 }, { _id: "Female", count: 0 }], "_id");
          }
          if (response.data.caste)
            this.casteGraph.data = response.data.caste;
          if (this.casteGraph.data)
            this.networkSeries.data = this.casteGraph.data;
          if (response.data.proximity)
            this.proximityGraph.data = response.data.proximity;


          //  this.genderGraph.data = [...new Set([..., ...])];





          //console.log("PROEXIM", this.proximityGraph.data);
          // let castGrf = [];
          // for (let i = 0; i < this.casteGraph.data.length; i++) {
          //   let tt = {name: this.casteGraph.data[i]._id, value: 1,}
          //   castGrf.push(tt)
          // }

          let livepurpose = response.data.livePurposes;

          if (livepurpose && livepurpose.livedata && livepurpose.livedata.length > 0) {
            // //console.log("liveD:",livepurpose);
            this.livepurposeGraphData = this.setLivepurposeGraph(livepurpose.livedata, livepurpose.allpurposes);
            let livekeys = Object.keys(this.livepurposeGraphData)
            // //console.log("KEYS",Object.keys(this.livepurposeGraphData));
            this.firstlivekey = livekeys[0];
            this.lastlivekey = livekeys[livekeys.length - 1];
            this.liveyear = parseInt(this.firstlivekey);
            this.livepurposeGraph.data = this.livepurposeGraphData[this.liveyear];

            var livemonth = moment(this.firstlivekey, 'MM-DD-YYYY');


            this.livepurposeGraph.label.text = livemonth.isValid() ? livemonth.format('MMM') : this.liveyear;


            this.livepurposeGraph.categoryAxis.sortBySeries = this.livepurposeGraph.sortseries;

            console.log("LIVEPIRP", response.data.livePurposes);
            // //console.log("LIVEP,",livepurpose.livedata[0]);
            // this.livepurposeGraph.categoryAxis.zoom({ start: 0, end: 1 / livepurpose.livedata[0].length });;
            // //console.log("zpp,",this.livepurposeGraph.data.length);
            // this.livepurposeGraph.zoom.zoom({ start: 0, end: 1 / this.livepurposeGraph.data.length })
            // //console.log("LIVESETDONE:", this.livepurposeGraph.data);
          }


          //console.log("districtStream:", response.data.districtStream);

          if (response.data.heatMap) {
            this.heatmapGraph.data = response.data.heatMap;

            //console.log("this.heatmapGraph.data:", this.heatmapGraph.data);

            let uniqueDays = [...new Set(this.heatmapGraph.data.map(item => item.day))].sort((a, b) => a > b && 1 || -1);

            //console.log("uniqdays", uniqueDays);

            this.heatmapGraph.data.forEach((e, i) => {

              let current = e.month;

              uniqueDays.map((day, i) => {

                let thing = this.heatmapGraph.data.find(element => element.day === day && element.month === current);
                if (!thing) {
                  this.heatmapGraph.data.push({ _id: (current + "-" + day), month: current, day: day, count: 0 });
                }

              });


              return e;
            })

            //console.log("this.2222a:", this.heatmapGraph.data.sort((a, b) => a.month - b.month || a.day - b.day));


            this.heatmapGraph.data = this.heatmapGraph.data.map((element: any) => {

              var d = moment(element._id, 'MM-DD-YYYY');
              var m = moment(element.month, 'MM-DD-YYYY');
              // d.month(); // 1
              if (d.isValid()) {
                return {
                  '_id': d.format('MMMM Do'),
                  'month': d.format('MMMM'),
                  'day': element.day,
                  'count': element.count
                }
              } else {
                return {
                  '_id': "NA",
                  'month': m.format('MMMM'),
                  'day': element.day,
                  'count': element.count
                }

              }

            })

          }
          if (response.data.districtStream) {
            if (this.streamGraph.data.length > 0) {
              this.streamGraph.data = response.data.districtStream;
              //console.log("yes");
            }
            else {
              this.districts = response.data.all_districts;
              this.streamGraph.data = response.data.districtStream;
              this.setDistrictStreamGraph();
              //console.log("no,", this.districts);

            }


            this.streamGraph.data = this.streamGraph.data.map((element: any) => {
              var d = moment(element._id, 'MM-DD-YYYY');
              if (d.isValid()) {
                return {
                  ...element,
                  '_id': d.format('MMM'),
                }
              }
            });

          }
          //console.log("heatmap:", response.data.heatMap);

          // //console.log("proximity:", response.data.proximity);


          // //console.log(response.data.heatMap.reduce((a,b)=> a+=b.count ,0));

          // if (this.casteGraph.data.length > 8) {
          //   this.casteGraph.scrollbarX = new Scrollbar();
          //   this.casteGraph.scrollbarX.parent = this.casteGraph.bottomAxesContainer;
          // }

          if (response.data.timeFrame) {
            if (response.data.timeFrame.length > 8) {
              this.timeFrameGraphData.scrollbarX = new Scrollbar();
              this.timeFrameGraphData.scrollbarX.parent = this.timeFrameGraphData.bottomAxesContainer;
            }

            if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Week') {
              this.timeFrameGraphData.data = response.data.timeFrame;
              this.timeFrameXText.title.text = "WEEKS"
              this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {

                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('ddd'),
                  'count': element.count
                }
              })
            } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Month') {
              var sortedData: any = response.data.timeFrame.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

              this.timeFrameGraphData.data = sortedData.map((element) => {



                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('MMM'),
                  'count': element.count
                }
              })
              this.timeFrameXText.title.text = "MONTH"
            } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Year') {
              this.timeFrameGraphData.data = response.data.timeFrame;
              this.timeFrameXText.title.text = "YEARS"
              this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {

                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('YYYY'),
                  'count': element.count
                }
              })
            } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Date') {
              this.timeFrameGraphData.data = response.data.timeFrame;
              this.timeFrameXText.title.text = "DATES"
              this.timeFrameGraphData.data = response.data.timeFrame.map((element) => {
                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('MMM'),
                  'count': element.count
                }
              })
            }
            else {
              this.timeFrameGraphData.data = response.data.timeFrame;
              this.timeFrameXText.title.text = "MONTHS"
              var sortedData: any = response.data.timeFrame.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

              this.timeFrameGraphData.data = sortedData.map((element) => {

                //console.log("elem", element);

                var d = moment(element._id, 'MM-DD-YYYY');
                d.month(); // 1
                return {
                  '_id': d.format('MMM'),
                  'count': element.count
                }
              })
            }

          }

          // //console.log("timeframeMAPED:", this.timeFrameGraphData.data);
          // this.geodata.data = response.data.boothArea;
          // this.geodata1.data = response.data.boothArea;
          // this.geodata1.data = response.data.districtArea;

          //map ka data in this function below
          if (response.data.boothArea)
            this.pbPoints.data = response.data.boothArea;

          // this.pbPoints.data = this.geodatajson.features.filter(data => {
          //   return (data.geometry.type == "Point");
          // }).map(points => {
          //   return { ...points, "latitude": points.geometry.coordinates[1], "longitude": points.geometry.coordinates[0]}
          // });

          // pbnos.map()
          if (response.data.visitorCategory)
            this.visitorCategoryData = response.data.visitorCategory;
          if (response.data.occupation)
            this.visitorOccupatioData = response.data.occupation;
          if (response.data.ageGroup)
            this.ageGraphData = response.data.ageGroup;
          if (response.data.ppi)
            this.perceivedPoliticalInclinationData = response.data.ppi
          if (response.data.meetingLocation)
            this.meetingLocationGraphData = response.data.meetingLocation;
          if (response.data.whomVisitorMeet)
            this.whomVisitorMeetGraphData = response.data.whomVisitorMeet;
          if (response.data.meetingStatus)
            this.meetingStatusGraphData = response.data.meetingStatus;
          if (response.data.count)
            this.filteredVisitorCount = response.data.count;
          if (response.data.isSamajwadiPartyMember){
            this.samajwadiPartyGraphData = response.data.isSamajwadiPartyMember;
            if (this.samajwadiPartyGraphData.length < 2)
            this.samajwadiPartyGraphData = _.unionBy(this.samajwadiPartyGraphData, [{ _id: "Yes", count: 0 }, { _id: "No", count: 0 }], "_id");
          }
          if (response.data.area){
            this.visitorAreaData = response.data.area;
            if (this.visitorAreaData.length < 2)
            this.visitorAreaData = _.unionBy(this.visitorAreaData, [{ _id: "Urban", count: 0 }, { _id: "Rural", count: 0 }], "_id");
          }

          this.graphDataLoader = false;
        }

        

        console.log("response.data.ppi", response.data.ppi);


        let sortingArr = ["Under 18","18 - 25","26 - 40","41 - 60","Over 60"];
        

        this.ageGraphData.sort((a, b) => sortingArr.indexOf(a.age) - sortingArr.indexOf(b.age));


        if (filterValue && response.data.visitorData) {
          this.visitorLists = response.data.visitorData;
          this.exportList = [];
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
              revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
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
          this.dataSource = new MatTableDataSource<any>(this.visitorLists);
          this.dataSource.paginator = this.paginator;
          this.pageLength = response.data.visitorData.length;

          this.viewGraphresetBtn = true;
          this.isLoadingResults = false;
        }
        else {
          this.getVisitorList(1);
          // this.viewGraphresetBtn = false;
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


  toggleFullScreen(codePart: HTMLElement) {
    if (screenfull.isEnabled) {
      screenfull.toggle(codePart);
    }
  }


  rangeFilter(newObj) {

    if (newObj) {
      let FilterByDate = this.range.value;

      if ((FilterByDate.fromDate) && (FilterByDate.toDate)) {
        console.log(FilterByDate)
        const formatDate = {
          fromDate: new Date(FilterByDate.fromDate.getTime() - FilterByDate.fromDate.getTimezoneOffset() * 60000),
          toDate: new Date(FilterByDate.toDate.getTime() - FilterByDate.toDate.getTimezoneOffset() * 60000),
        }

        const filterObj = {
          key: "range",
          value: formatDate.fromDate.toISOString() + "=" + formatDate.toDate.toISOString(),
        };

        let range = this.appliedFilters['range'];
        if(range.key && range.key != "By Week" && range.key != "By Month" && range.key != "By Year"){
          this.appliedFilters['range'] = {key:"By Date"};
        }

        this.appliedFilters['range'].value = moment(formatDate.fromDate).format('D MMM YY') + " to " + moment(formatDate.toDate).format('D MMM YY');

        this.getVisitAnalyticGraphData(filterObj);

      }

    }
  }

  timeFrameFilter(value): void {
    // const filterObj = {
    //   key: "timeFrame",
    //   value: value,
    // };

    var now = moment().startOf('day').toDate();

    this.appliedFilters['range'] = {};

    switch (value) {
      case "By Week":
          this.appliedFilters['range'].key = "By Week";
          this.range.patchValue({fromDate:moment(now).subtract(1, 'week').toDate(),toDate:moment(now).toDate()}); 

        break;
      case "By Month":
        this.appliedFilters['range'].key = "By Month";
        this.range.patchValue({fromDate:moment(now).subtract(1, 'month').toDate(),toDate:moment(now).toDate()}); 

        break;
      case "By Year":
        this.appliedFilters['range'].key = "By Year";
        this.range.patchValue({fromDate:moment(now).subtract(1, 'year').toDate(),toDate:moment(now).toDate()}); 

        break;
      default:
        this.appliedFilters['range'].key = "By Date";
        break;
    }

    // this.getFilterMeetStatus(filterObj)

    // this.getVisitAnalyticGraphData(filterObj);

  }

  purposeFilter(value): void {
    const filterObj = {
      key: "purpose",
      value: value,
    };

    this.appliedFilters['purpose'] = value;

    this.getVisitAnalyticGraphData(filterObj);
    // this.getFilterMeetStatus(filterObj)

  }

  proximityFilter(value): void {
    const filterObj = {
      key: "proximity",
      value: value,
    };

    this.appliedFilters['proximity'] = value;

    this.getVisitAnalyticGraphData(filterObj);

  }

  districtFilter(value): void {
    const filterObj = {
      key: "district",
      value: value,
    };

    this.appliedFilters['district'] = value;

    this.getVisitAnalyticGraphData(filterObj);

  }


  visitorAreaFilter(filterObj): void {

    // this.getFilterMeetStatus(filterObj)

    this.getVisitAnalyticGraphData(filterObj);

    this.appliedFilters['area'] = filterObj;

  }

  genderFilter(value): void {
    const filterObj = {
      key: "gender",
      value: value,
    };

    this.appliedFilters['gender'] = value;

    //console.log(this.appliedFilters);
    // this.getFilterMeetStatus(filterObj)
    this.getVisitAnalyticGraphData(filterObj);
    // this.getFilterGender(filterObj);


  }

  casteFilter(value): void {
    const filterObj = {
      key: "caste",
      value: value,
    };
    this.appliedFilters['caste'] = value;
    // this.getFilterMeetStatus(filterObj)
    this.getVisitAnalyticGraphData(filterObj);

  }

  ageFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj)
    this.appliedFilters['ageGroup'] = filterObj;
    //console.log(this.appliedFilters);
    this.getVisitAnalyticGraphData(filterObj);

  }

  perceiveFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['ppi'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }

  samajwadiPartyFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['isSamajwadiPartyMember'] = filterObj;
    this.getVisitAnalyticGraphData(filterObj);
  }

  visitorCategoryFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['visitorCategory'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }

  visitorOccupationFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['occupation'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }
  whomVisitorMeetFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['whomVisitorMeet'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);


  }

  meetingStatusGraphFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['meetingStatus'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);
  }

  meetingLocationGraphFilter(filterObj): void {
    // this.getFilterMeetStatus(filterObj);
    this.appliedFilters['meetingLocation'] = filterObj;

    this.getVisitAnalyticGraphData(filterObj);

  }



  //separate api

  // getFilterMeetStatus(filterObj?: any): void {

  //   this.isLoadingResults = true;
  //   if (filterObj) {
  //     this.viewGraphresetBtn = true;
  //     this.isLoadingResults = true;
  //   }
  //   else {
  //     this.viewGraphresetBtn = false;
  //     this.appliedFilters = {};
  //   }
  //   //table
  //   this.isLoaderHappen = true;
  //   //All graph loader
  //   this.userService.graphDataLoader.next(true);
  //   this.userService.graphDataLoader5.next(true);
  //   this.userService.graphDataLoader1.next(true);
  //   this.userService.graphDataLoader2.next(true);
  //   this.userService.graphDataLoader4.next(true);
  //   this.graphDataLoader1 = true;
  //   this.graphDataLoader3 = true;
  //   this.userService.graphDataLoader7.next(true);
  //   this.userService.graphDataLoader3.next(true);
  //   this.graphDataLoader = true;
  //   this.graphDataLoader2 = true;
  //   this.userService.graphDataLoader6.next(true);
  //   this.userService.graphDataLoader8.next(true);

  //   this.userService.getFilterMeetStatus(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'meetingStatus') {
  //           this.filteredVisitorCount = response.data[0].count;
  //         }

  //         this.meetingStatusGraphData = response.data;
  //         this.userService.graphDataLoader.next(false);
  //         this.getFilterArea(filterObj)
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterArea(filterObj?: any): void {

  //   this.userService.getFilterArea(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'area') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // //console.log("area", this.filteredVisitorCount)
  //         }
  //         this.visitorAreaData = response.data;

  //         this.getFilterDistrictConstituency(filterObj)

  //         this.userService.graphDataLoader5.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterDistrictConstituency(filterObj?: any): void {
  //   // this.isLoadingResults = true;
  //   this.userService.getFilterDistrictConstituency(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         this.geodata1 = response.data[0].district;
  //         this.geodata.data = response.data[0].constituency;
  //         this.getFilterAgeGroup(filterObj)

  //         // this.isLoadingResults = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterAgeGroup(filterObj?: any): void {

  //   this.userService.getFilterAgeGroup(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'ageGroup') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           ////console.log("ageGroup", this.filteredVisitorCount)
  //         }
  //         this.ageGraphData = response.data;
  //         this.getFilterMeetLocation(filterObj)

  //         this.userService.graphDataLoader1.next(false);

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterMeetLocation(filterObj?: any): void {

  //   this.userService.getFilterMeetLocation(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'meetingLocation') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           ////console.log("meetingLocation", this.filteredVisitorCount)
  //         }
  //         this.meetingLocationGraphData = response.data;
  //         this.getFilterIsSamjawadi(filterObj)

  //         this.userService.graphDataLoader2.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterIsSamjawadi(filterObj?: any): void {

  //   this.userService.getFilterIsSamjawadi(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         if (filterObj?.key == 'isSamajwadiPartyMember') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //  //console.log("isSamajwadiPartyMember", this.filteredVisitorCount)
  //         }
  //         this.samajwadiPartyGraphData = response.data;
  //         setTimeout(() => {
  //           this.getFilterGender(filterObj)
  //         }, 500);

  //         this.userService.graphDataLoader4.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterGender(filterObj?: any): void {

  //   this.userService.getFilterGender(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'gender') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           ////console.log("gender", this.filteredVisitorCount)
  //         }
  //         this.genderGraph.data = response.data;
  //         setTimeout(() => {
  //           this.getFilterCaste(filterObj)
  //         }, 500);

  //         this.graphDataLoader1 = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterCaste(filterObj?: any): void {

  //   this.userService.getFilterCaste(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'caste') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // //console.log("caste", this.filteredVisitorCount)
  //         }
  //         this.casteGraph.data = response.data;
  //         let castGrf = [];
  //         for (let i = 0; i < this.casteGraph.data.length; i++) {
  //           let tt = {name: this.casteGraph.data[i]._id, value: 1,}
  //           castGrf.push(tt)
  //         }
  //         this.networkSeries.data = castGrf;
  //         // this.networkSeries.data = [
  //         //   {name: this.casteGraph.data[0]._id, value: 1,},
  //         //   // {name: this.casteGraph.data[1]._id, value: 1,},
  //         //   // name: 'Singh', value: 1,
  //         //   // name: 'Singh', value: 1,
  //         //   // children: [{
  //         //   //   name: 'Black Tea', value: 1
  //         //   // }, {
  //         //   //   name: 'Floral',
  //         //   //   children: [{
  //         //   //     name: 'Chamomile', value: 1
  //         //   //   }, {
  //         //   //     name: 'Rose', value: 1
  //         //   //   }, {
  //         //   //     name: 'Jasmine', value: 1
  //         //   //   }]
  //         //   // }]
  //         // ]
  //         if (this.casteGraph.data.length > 8) {
  //           this.casteGraph.scrollbarX = new Scrollbar();
  //           this.casteGraph.scrollbarX.parent = this.casteGraph.bottomAxesContainer;
  //         }
  //         this.graphDataLoader3 = false;
  //         this.getFilterOccupation(filterObj)

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterOccupation(filterObj?: any): void {

  //   this.userService.getFilterOccupation(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'occupation') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           ////console.log("occupation", this.filteredVisitorCount)
  //         }
  //         this.visitorOccupatioData = response.data;
  //         this.userService.graphDataLoader7.next(false);
  //         this.getFilterPpi(filterObj)

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterPpi(filterObj?: any): void {

  //   this.userService.getFilterPpi(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         if (filterObj?.key == 'ppi') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           ////console.log("ppi", this.filteredVisitorCount)
  //         }
  //         this.perceivedPoliticalInclinationData = response.data;
  //         // this.getFilterPurpose(filterObj)

  //         this.userService.graphDataLoader3.next(false);
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterPurpose(filterObj?: any): void {
  //   //this.isLoadingResults = true;

  //   this.userService.getFilterPurpose(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //      var data = [
  //           {
  //               "_id": "Other",
  //               "count": 2994
  //           },
  //           {
  //               "_id": "Meeting Leadership",
  //               "count": 22028
  //           },
  //           {
  //               "_id": "Political Purpose",
  //               "count": 2146
  //           },
  //           {
  //               "_id": "Political Function",
  //               "count": 6617
  //           }
  //       ];
  //         this.purposeGraph.data = response.data;
  //         this.purposes = response.data;
  //         // this.purposeGraph.data = data;
  //         // this.purposes = data;

  //         //console.log("purposePG", response.data);

  //         this.getFilterTimeFrame(filterObj)
  //         if (filterObj?.key == 'purpose') {
  //           //console.log("purpose", this.filteredVisitorCount)
  //           this.filteredVisitorCount = response.data[0].count;
  //         }
  //         this.graphDataLoader = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterTimeFrame(filterValue?: any): void {

  //   this.userService.getFilterTimeFrame(filterValue).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         this.getFilterVisitorCategory(filterValue)
  //         if (filterValue?.key == 'timeFrame') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           //  //console.log("timeFrame", this.filteredVisitorCount)
  //         }
  //         this.graphDataLoader2 = false;
  //         if (response.data.length > 8) {
  //           this.timeFrameGraphData.scrollbarX = new Scrollbar();
  //           this.timeFrameGraphData.scrollbarX.parent = this.timeFrameGraphData.bottomAxesContainer;
  //         }

  //         // if(filterValue){
  //         if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Week') {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "WEEKS"

  //         } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Month') {
  //           var sortedData: any = response.data.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

  //           this.timeFrameGraphData.data = sortedData.map((element) => {

  //             var d = moment(element._id, 'MM-DD-YYYY');
  //             d.month(); // 1
  //             return {
  //               '_id': d.format('MMM'),
  //               'count': element.count
  //             }
  //           })
  //           this.timeFrameXText.title.text = "MONTH"
  //         } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Year') {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "YEARS"

  //         } else if (filterValue && filterValue.key === "timeFrame" && filterValue.value === 'By Date') {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "DATES"

  //         }
  //         else {
  //           this.timeFrameGraphData.data = response.data;
  //           this.timeFrameXText.title.text = "MONTHS"
  //           var sortedData: any = response.data.sort((a, b) => a._id > b._id && 1 || -1);//response.data.timeFrame.sort();

  //           this.timeFrameGraphData.data = sortedData.map((element) => {

  //             var d = moment(element._id, 'MM-DD-YYYY');
  //             d.month(); // 1
  //             return {
  //               '_id': d.format('MMM'),
  //               'count': element.count
  //             }
  //           })
  //         }
  //         // }
  //         // else{
  //         //   this.timeFrameGraphData.data = response.data;
  //         //   this.timeFrameXText.title.text= "MONTHS"
  //         // }

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterVisitorCategory(filterObj?: any): void {

  //   this.userService.getFilterVisitorCategory(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'visitorCategory') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // //console.log("visitorCategory", this.filteredVisitorCount)
  //         }
  //         this.visitorCategoryData = response.data;
  //         this.userService.graphDataLoader6.next(false);
  //         this.getFilterVisitorMeet(filterObj)

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getFilterVisitorMeet(filterObj?: any): void {

  //   this.userService.getFilterVisitorMeet(filterObj).subscribe(
  //     (response: any) => {
  //       if (response.error === false) {
  //         if (filterObj?.key == 'whomVisitorMeet') {
  //           this.filteredVisitorCount = response.data[0].count;
  //           // //console.log("whomVisitorMeet", this.filteredVisitorCount)
  //         }
  //         this.whomVisitorMeetGraphData = response.data;
  //         this.userService.graphDataLoader8.next(false);
  //         if (filterObj) {
  //           this.getVisitorGraphFilter(filterObj);
  //         }
  //         else {
  //           this.getVisitorList(1);
  //         }

  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
  // getVisitorGraphFilter(filterObj?: any) {
  //   // this.isLoadingResults = true;
  //   this.userService.getVisitorGraphFilter(filterObj, '1').subscribe(
  //     (response: any) => {
  //       if (response.error === false) {

  //         this.visitorLists = response.data.response;
  //         this.visitorListsTotalLength = response.data.length;
  //         this.exportList = [];
  //         for (var i = 0; i <= this.visitorLists.length - 1; i++) {
  //           var d = new Date(this.visitorLists[i].createdAt);

  //           var day = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  //           var Ed = new Date(this.visitorLists[i].enrollmentDate);

  //           var Eday = Ed.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

  //           this.exportList.push({
  //             serial: i + 1,
  //             uniqueVisitorId: this.visitorLists[i].uniqueVisitorId,
  //             fullName: this.visitorLists[i].fullName,
  //             address: this.visitorLists[i].address.houseNumber + ' ' + this.visitorLists[i].address.line1,
  //             createdAt: day,
  //             enrollmentDate: Eday,
  //             mobile: this.visitorLists[i].mobile,
  //             revisit: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].visitPurposeCategory : '',
  //             revisitStatus: this.visitorLists[i].revisits[0] ? this.visitorLists[i].revisits[0].status : '',
  //             visitCategory: this.visitorLists[i].politicalinfo?.visitorCategory,
  //             totalVisits: this.visitorLists[i].totalVisits,
  //             remark: this.visitorLists[i].objectiveInfoRemark,
  //             politicalRemark: this.visitorLists[i].politicalInforRemark,

  //           })
  //         }
  //         this.dataSource = new MatTableDataSource<any>(this.visitorLists);
  //         this.paginator.pageIndex = 0;
  //         this.pageLength = this.visitorListsTotalLength;
  //         this.isLoadingResults = false;
  //         this.isLoaderHappen = false;
  //       }
  //     },
  //     (error) => {

  //     }
  //   );
  // }
}
