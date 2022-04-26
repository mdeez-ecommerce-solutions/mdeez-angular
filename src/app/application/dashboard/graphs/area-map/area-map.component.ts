import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { ActivatedRoute, Params } from "@angular/router";
import * as topojson from "topojson";
import * as $ from "jquery"
import * as data from "../states-map/Delhi.json"
import * as arcData1 from "../states-map/map.json"

@Component({
  selector: 'app-area-map',
  templateUrl: './area-map.component.html',
  styleUrls: ['./area-map.component.css']
})
export class AreaMapComponent implements OnInit {
 
  public name: string = "d3";
  delhData = data 
  // delhData = arcData 
  arcDataCont = arcData1
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    console.log(this.delhData);
    console.log(this.arcDataCont);
    var result= "Delhi";
    console.log(result);
    var svgContainer = $("#svg");
    var width = svgContainer.width();
    var height = svgContainer.height();
    var aspect = width / height;
    var container = svgContainer.parent();
    var targetWidth = container.width();
    let svg = d3.select("#svg");
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
    let g = svg.append("g");
    console.log("outside json calling1");

    const colors = ["#2e2b28", "#3b3734", "#474440", "#54504c", "#6b506b", "#ab3da9", "#de25da", "#eb44e8", "#ff80ff"]

     var color = d3.scaleOrdinal(d3.schemeCategory10)
      var topology1 = topojson.feature(this.delhData, this.delhData.objects.districts);
      let projection = d3.geoMercator().fitSize([width, height], topology1);
      let path = d3.geoPath().projection(projection);
      console.log("----topology1-->", topology1);
      console.log("------>", this.delhData);
      console.log(
        ...topojson.feature(this.delhData, this.delhData.objects.districts).features
      );
      g.selectAll("path")
        .data(topojson.feature(this.delhData, this.delhData.objects.districts).features)
        .join((enter):any => {
          var sel = enter
            .append("path")
            .attr("d", path)
            .attr("id", function (d:any, i):any {
              var id = d.properties.district.split(" ").join("");
              console.log(id);
              return id;
            })
            .attr("stroke-opacity", 0.8)
            // .attr("fill", () => colors[Math.floor(Math.random()*8)])
            .attr("fill", (d:any) => color(d))
            .attr("stroke", "#055a17")
            .attr("stroke-width", 1)
            .style("cursor", "pointer")
            // .on("mouseenter", (d) => {
            //   console.log(d);
            //   console.log(d.srcElement.id)
            //   var id = d.srcElement.id;
            //   console.log(id);
            //   // d3.select();
            //   d3.select("#" + id)
            //     .attr("stroke-width", 2)
            //     .attr("stroke", "#ffff");
            //   console.log("#" + id);
            // })
            // .on("mouseleave", (d) => {
            //   console.log(d);
            //   var id = d.srcElement.id;
            //   d3.select("#" + id)
            //     .attr("stroke-width", 0)
            //     .attr("stroke", "#fffff");
            //   // d3.select("#" + id).attr("fill", "#ee7c7c");
            // })
            // .on("touchstart", (d) => {})
            // .on("click", (d, i) => {
            //   console.log(d);
            // });
          sel.append("title").text((d:any, i) => {
            return d.properties.district;
          });
        });
              var topology = topojson.feature(this.arcDataCont, this.arcDataCont.objects.airports);
              console.log('--- topo--->', topology);
              g.selectAll('path')
                .data(topojson.feature(this.arcDataCont,this.arcDataCont.objects.airports).features)
                //.data(t.feature(topology, topology.objects.countries)
                //  .geometries)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'airport');
              console.log('ending json calling1');
            // });
  }
 

}
