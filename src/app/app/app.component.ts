import { Component, OnInit, HostListener } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { UtilService } from '../core/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Project YZ";
  routerParams: any;
  showDashboardMenu = false;
  fixHeader = false;
  isShow: boolean;
  topPosToStartShowing = 150;
  idleState = 'Not started.';
  isVis = false;
  authData
  adminRole=environment.ADMIN_ROLE
  superAdminRole=environment.SUPER_ADMIN_ROLE
  editorRole=environment.EDITOR_ROLE
  authenticated=false
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private idle: Idle,
    private keepalive: Keepalive,
    private util: UtilService) {
    this.activatedRoute.queryParams.subscribe((params) => {
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
      if (params) {
        this.routerParams = params.token;
        
      }
    });

    // idle.setIdle(3000);
    // idle.setTimeout(3000);
    // // idle.setIdle(300);
    // // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    // // idle.setTimeout(300);
    // // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);


    // idle.onIdleEnd.subscribe(() => { 
    //   // this.idleState = 'No longer idle.'
    
    //   this.reset();
    // });
    
    // idle.onTimeout.subscribe(() => {
    //   this.idleState = 'Timed out!';
    //   console.log(this.idleState);
    //   this.util.removeLocalStorage('SignInUserData');
    //   // this.router.navigate(['/authentication']);
    // });
    
    // idle.onIdleStart.subscribe(() => {
    //     this.idleState = 'You\'ve gone idle!'
    //     console.log(this.idleState);
    // });

    // sets the ping interval to 15 seconds
    //keepalive.interval(15);
    // keepalive.interval(50);
    // // keepalive.onPing.subscribe(() => this.lastPing = new Date());

    // this.reset();
  }
  
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    console.log(this.idleState);
  }

  logOut() {
    this.util.removeLocalStorage('SignInUserData');
     this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
   });

  }
  @HostListener('window:scroll')
  checkScroll() {

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

    // TODO: Cross browsing
    gotoTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoute =  this.router.url.split('/')[1];
      switch (currentRoute) {
        case 'authentication': {
          this.showDashboardMenu = false;
          this.fixHeader = true;
          break;
        }
        case 'signup': {
          this.showDashboardMenu = false;
          this.fixHeader = true;
          break;
        }
        case 'reset-password?token=' + this.routerParams: {
          this.showDashboardMenu = false;
          this.fixHeader = true;
          break;
        }
        case 'reset-password': {
          this.showDashboardMenu = false;
          this.fixHeader = true;
          break;
        }
        default: {
          this.showDashboardMenu = true;
          this.fixHeader = false;
          break;
        }
         
      }
  });

  }

  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
}
