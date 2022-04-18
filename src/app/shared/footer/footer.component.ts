import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() showDashboardMenu: boolean;
  @Input() fixHeader: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
