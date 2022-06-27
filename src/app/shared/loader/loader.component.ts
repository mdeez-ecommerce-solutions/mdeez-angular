import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'graph-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() loader: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
