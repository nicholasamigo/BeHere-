import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import { Event_t, EventsMiddlemanService } from '../services/events-middleman.service';
import { DataServiceService } from '../data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { HelloWorldService } from '../hello-world.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-map-n-feed',
  templateUrl: './map-and-feed.component.html',
  styleUrls: ['./map-and-feed.component.css']
})
export class MapAndFeedComponent implements OnInit{

  name = 'Angular';
  dataArr = [];

  title:string = "";

  @Input() allData: [];
  latData: any;

  // Allow direct reading of the big google map Angular component in "map"
  @ViewChild('primary_google_map', { static: false }) map: GoogleMap

  // Allow reading of the child object, InfoWindow
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  infoContent = '';

  // Fix this eventually. Works but can lead to memory leaks. Need to figure out a way to create events on initialization.
  //currevent = new Event_t(0, "", "", "", 0, 0, "", "", "");

  selectedEvent : Event_t = null
  alreadyInit : boolean

  highlightedCard : HTMLElement

  // instantiate the GMap
  display: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  center: google.maps.LatLngLiteral;
  zoom = 12;
  // markerPositions: google.maps.LatLngLiteral[] = [];

  // Define the list of events currently stored in the browser
  eventList: Event_t[]=[];

  // Stuff for the create event feature
  cE:string = "Create Event";
  d: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  lat:number = 0;
  lng:number = 0;

  // Event to be displayed for more info (Card Type B)
  //e = new Event_t(0,"","","",0,0,"","","");

  options: google.maps.MapOptions = {
    minZoom: 8
  };

  markerOptions: google.maps.MarkerOptions = {
    optimized: false
  }

  options2: google.maps.MapOptions = {
    minZoom: 8
  };

  markerOptions2: google.maps.MarkerOptions = {
    optimized: false
  }

  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(private hw: HelloWorldService, public ems: EventsMiddlemanService, private dataService: DataServiceService) {}



  ngOnInit() {
    /* load in events */
    /* TODO - update this to interface with backend */

    // Read from getTitle which is on backend API. Convert back from JSON into a struct
    this.hw.getTitle()
      .subscribe(data => this.title = JSON.parse(JSON.stringify(data)).title);
    console.log(this.title);

    this.dataService.dataUpdated.subscribe((data) => {
      this.latData = data;
    });

    this.eventList = [];
    this.alreadyInit = false

    this.center = {lat: 24, lng: 12}

    /* set position on user's location */
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

/* commenting out for safety
  updateData(){
    this.dataService.dataUpdated.subscribe((data) => {
      this.latData = data;
    });
  }

  initCenter() {
    // Wait for the 'tilesloaded' event to be fired before calling the getCenterOfMap() function
    google.maps.event.addListenerOnce(this.map, 'center_changed', () => {
      console.log('center_changed!')
      this.updateEventList()
    });
  }
*/

  // Called when card A info is clicked.
  // This sets "selectedEvent" so that the cardB will pop up (it is *ngif'ed in)
  // openCardB(eventdata : Event_t) {
  //   this.selectedEvent = eventdata
  // }

    // // Function to show Card B version of Event
    // showCardB(eID: number){
    //   for(let i = 0; i < this.eventList.length; i++){
    //     if(this.eventList[i].id == eID){
    //       this.e = this.eventList[i];
    //       var x = document.getElementById("cardB") as HTMLSelectElement;
    //       if (x.style.display === "none") {
    //         x.style.display = "flex";
    //       } else {
    //         x.style.display = "none";
    //       }
    //       document.getElementById("overlay").style.display = "block";
    //     }
    //   }
    // }

      // Function to close Card B version of Event
      // closeCardB(){
      //   var x = document.getElementById("cardB") as HTMLSelectElement;
      //   if (x.style.display === "none") {
      //     x.style.display = "flex";
      //     document.getElementById("overlay").style.display = "none";
      //   } else {
      //     x.style.display = "none";
      //     document.getElementById("overlay").style.display = "none";
      //   }
      // }
  
  // closeCardB() {
  //   //this.selectedEvent = null
  // }

  updateEventList() {
    let lat = this.center.lat;
    let lng = this.center.lng;

    let bounds : google.maps.LatLngBounds = this.map.getBounds();
    let radius : number = bounds.getNorthEast().lat() - lat + 0.1;

    console.log("Got lat=", lat, " and lng=", lng, "and radius=", radius);
    
    // TODO - reimplement with a call to getEventsWithinBounds
    // Will be simpler and probably faster
    this.ems.getEventsAroundLocation(lat, lng, radius)
    .subscribe(data => this.eventList = JSON.parse(JSON.stringify(data)));
    console.log("Event list updated");
  }

  initEventList() {
    if (!this.alreadyInit) {
      this.alreadyInit = true
      this.updateEventList()
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    //this.markerPositions.pop();
    //this.markerPositions.push(event.latLng.toJSON());
  }

  updateSelectedLocation(event: google.maps.MapMouseEvent){
    this.d = event.latLng.toJSON();
    this.lat = this.d.lat;
    this.lng = this.d.lng;
  }

  openInfoWindow(marker: MapMarker, currevent : Event_t) {
    // this.infoContent = currevent;
    // this.infoWindow.open(marker);
    //this.currevent = currevent;
    
    // does nothing lmao
    
    // TODO NEXT - Use getEventsAroundLocation
    // to refresh the map using dummy data
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null)
    {
      this.display = event.latLng.toJSON();
    }
  }

  /* Plot user position on Gmap */
  currentLat: any;
  currentLong: any;

//  showTrackingPosition(position) {
//     console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
//     this.currentLat = position.coords.latitude;
//     this.currentLong = position.coords.longitude;

//     let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//     this.panTo(location);

//     if (!this.marker) {
//       this.marker = new google.maps.Marker({
//         position: location,
//         map: this.map,
//         title: 'Got you!'
//       });
//     }
//     else {
//       this.marker.setPosition(location);
//     }
//   }

  /* Handle user GPS tracking */

  trackUser() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        //this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  onAddTimestamp() {
    this.dataArr.push(this.display.lat);
    this.dataService.setLatestData(this.display.lat);
  }

  @ViewChild('nameInput')
  nameInputReference!: ElementRef;

  // TODO - Rewrite the form, nameInputReference is DISGUSTING syntax
  // John you absolute buffoon
  // createEvent(){
  //   let e = new Event_t(0, this.nameInputReference.nativeElement.value, "Bio",
  //     "Placeholder",
  //     this.lat, 
  //     this.lng,
  //     "Balls avenue",
  //     "04/23/2022",
  //     "4PM")
  //   this.ems.createEvent(e)
  // }

  // openCreateEvent(){
  //   var x = document.getElementById("cE") as HTMLSelectElement;
  //   if (x.style.display === "none") {
  //     x.style.display = "block";
  //     this.cE = "Close";
  //   } else {
  //     x.style.display = "none";
  //     this.cE = "Create Event";
  //   }
  // }

  testLog() {
    console.log("Map-n-feed Received the Event that dialog C closed")
  }

  scrollToCard(event_t : Event_t) {
    this.selectedEvent = event_t
    const card = document.getElementById(event_t.id.toString());

    // Remove highlight on previous card
    // if (this.highlightedCard) {
    //   this.highlightedCard.classList.remove('selected');
    // }

    // if (card) {
    //   card.classList.add('selected')
    //   this.highlightedCard = card
    // }
    card.scrollIntoView()
  }
}
