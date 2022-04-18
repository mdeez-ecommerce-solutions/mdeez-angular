import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UtilService } from 'src/app/core/services/util.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
logoVar: any;
themeVal: any;
private themeWrapper = document.querySelector('body');
@Input() showDashboardMenu: boolean;
@Input() fixHeader: boolean;

  constructor(private router: Router,
    private userService: UserService,
    private util: UtilService) { 
      this.themeVal = localStorage.getItem('themeValue');
      if (!this.themeVal) {
        localStorage.setItem('themeValue', 'dark');
        this.changeTheme('dark');
      } else {
        this.changeTheme(this.themeVal);
      }
  }

  ngOnInit(): void {
    this.logoVar = '../../../assets/images/sp-logo.jpg';
    
  }

  logOut() {
    this.util.removeLocalStorage('SignInUserData');
    this.router.navigate(['/authentication']);
  }

  changeTheme(themeValue) {
    this.userService.themeValueBehavior.next(themeValue);
    localStorage.setItem('themeValue', themeValue);
      if (themeValue === 'light') {
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#2B2C2D";
        this.themeWrapper.style.setProperty('--cardBorder', 'transparent');
        this.themeWrapper.style.setProperty('--colorLight', '#2B2C2D');
        this.themeWrapper.style.setProperty('--colorBackground', '#ffffff');
      } else {
        document.body.style.backgroundColor = "#1A1F2E";
        document.body.style.color = "#ffffff";
        this.themeWrapper.style.setProperty('--cardBorder', '#2E2F36');
        this.themeWrapper.style.setProperty('--colorLight', '#ffffff');
        this.themeWrapper.style.setProperty('--colorBackground', '#202639');
      }
  }

}
