import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialogRef
} from '@angular/material/dialog';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var google: any;

@Component({
  selector: 'app-pickup-location',
  templateUrl: './pickup-location.component.html',
  styleUrls: ['./pickup-location.component.css']
})
export class PickupLocationComponent implements OnInit {
  coordinatorAddress: any;
  locationFound = true;
  constructor(
    public dialogRef: MatDialogRef < PickupLocationComponent > ,
    private mapsAPILoader: MapsAPILoader,
    private _snackBar: MatSnackBar
  ) {
    this.mapsAPILoader.load().then(() => {
      new google.maps.LatLngBounds(
        new google.maps.LatLng(51.130739, -0.868052), // SW
        new google.maps.LatLng(51.891257, 0.559417) // NE
      );
      this.readyMap();
    });
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  readyMap(): void {
    // let map: google.maps.Map, infoWindow: google.maps.InfoWindow;
    let infoWindow;
     let map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: {
          lat: 20.5937,
          lng: 78.9629
        },
        zoom: 6,
        mapTypeControl: false
      });
      infoWindow = new google.maps.InfoWindow();

      const locationButton = document.createElement("button");
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

      locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: any) => {
              const path = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              infoWindow.setPosition(path);
              infoWindow.setContent("Location found.");
              infoWindow.open(map);
              map.setCenter(path);
              this.locationFound = false;

              let geocoder = new google.maps.Geocoder;
              let latlng = {lat: path.lat, lng: path.lng};
             
              geocoder.geocode({'location': latlng}, (results) => {
                  if (results[0]) {
                  this.coordinatorAddress = results[0].formatted_address;
                  } else {
                    this.locationFound = true;
                    this._snackBar.open('Unable to track location', '', {
                      duration: 5000,
                    });
                  }
              });
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter() !);
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter() !);
        }
      });
    

    function handleLocationError(
      browserHasGeolocation: boolean,
      infoWindow: google.maps.InfoWindow,
      pos: google.maps.LatLng
    ) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }
  }

}