import { Component, OnInit, Input, EventEmitter, Output, Inject} from '@angular/core';
import { Event_t, EventsMiddlemanService } from 'src/app/services/events-middleman.service';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-card-b',
  templateUrl: './card-b.component.html',
  styleUrls: ['./card-b.component.css']
})
export class CardBComponent implements OnInit{
  gmap_options : google.maps.MapOptions
  markerOptions : google.maps.MarkerOptions

  @Output() closeCardBEvent: EventEmitter<void> = new EventEmitter()

  constructor(@Inject(MAT_DIALOG_DATA) public event: Event_t, public ems : EventsMiddlemanService) {}

  ngOnInit(): void {

    this.gmap_options = {
      center: {lat: this.event.lat, lng: this.event.lng},
      minZoom: 10,
      zoom: 14,
      draggable: false
    };

    this.markerOptions = {
      optimized: false,
      position: {lat: this.event.lat, lng: this.event.lng}
    }
  }

  onAttend() {
    if (this.ems.auth.user) {
      this.ems.createAttend(this.event)
    }
  }

  onUnattend() {
    if (this.ems.auth.user) {
      this.ems.deleteAttend(this.event)
    }
  }
}