import { Component, OnInit } from '@angular/core';
import { ModalController   } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-quarter-date',
  templateUrl: './modal-quarter-date.component.html',
  styleUrls: ['./modal-quarter-date.component.scss'],
})
export class ModalQuarterDateComponent implements OnInit {
  timePeriods;
  timePeriodSelected;

  constructor(
      public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  close() {
    // Dismiss the top modal returning some data object
    this.modalController.dismiss({
      timePeriodSelected : this.timePeriodSelected
    });
  }

  selectTimePeriod(timePeriodSelected) {
    this.timePeriodSelected = timePeriodSelected;
    this.close();
  }
}
