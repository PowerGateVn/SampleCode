import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { DbService } from '../../services/db.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})

export class StatusComponent implements OnInit {

  ngOnInit() {
  }

  loading: boolean;

  constructor(public dbService: DbService) {
    this.getPupils();
    this.loading = true;
    this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + 86399999, this.checkedPupils);
    this.togglePopup();
  }

  togglePopup() {
    $(document).on('click', '.showPupil, .arrow', (e) => {
      e.stopPropagation();
      $('.form-search-pupils').toggleClass('active');
    });
    $(document).on('click', '.form-search-pupils', (e) => {
      e.stopPropagation();
    });
    $(document).on('click', '.btn-export, .arrow', (e) => {
      e.stopPropagation();
      $('.btn-export').toggleClass('active');
    });
    $(document).on('click', 'html', () => {
      if ($('.form-search-pupils, .btn-export').hasClass('active')) {
        $('.form-search-pupils, .btn-export').removeClass('active');
      }
    });
  }

  pupils = [];
  getPupils() {
    this.dbService.select('pupils').on('value', res => {
      var items = res.val();
      this.loading = false;
      for (let key in items) {
        this.pupils.push(items[key]);
      }
    });
  }

  status = [];
  header = [];
  getLogs(start: number, end: number, array_id: number[]) {
    // get header
    this.header = [];
    const date_milisecond = 24 * 60 * 60 * 1000;
    for (let from = start; from < end; from = from + date_milisecond) {
      this.header.push({
        day: this.convertMsToDay(from),
        date: new Date(from).getDate(),
        sup: this.getSup(from),
        month: this.convertMsToMonth(from)
      })
    }
    // get logs
    this.status = [];
    if (array_id === null || array_id.length === 0) {
      this.dbService.select('pupils').on('value', res => {
        for (let key in res.val()) {
          let item = {
            first_name: '',
            last_name: '',
            location: '',
            logs: [],
            total: 0,
            half_total: 0
          }
          for (let from = start; from < end; from += date_milisecond) {
            item.logs.push({
              agent_checkin: '',
              agent_checkout: '',
              time_checkin: null,
              time_checkout: null
            });
          }
          // pupil name + pupil location
          item.first_name = res.val()[key].first_name;
          item.last_name = res.val()[key].last_name;
          item.location = res.val()[key].location;
          this.dbService.getWhere('logs', 'id', res.val()[key].id).on('value', res => {
            this.loading = false;
            let total = 0;
            for (let key in res.val()) {
              let array_log = {
                agent_checkin: '',
                agent_checkout: '',
                time_checkin: null,
                time_checkout: null
              };
              array_log.agent_checkin = res.val()[key].time_checkin ? this.getFirstChar(res.val()[key].agent_name) : "";
              array_log.agent_checkout = res.val()[key].time_checkout ? this.getFirstChar(res.val()[key].agent_name) : "";
              array_log.time_checkin = res.val()[key].time_checkin === 0 ? null : res.val()[key].time_checkin;
              array_log.time_checkout = res.val()[key].time_checkout === 0 ? null : res.val()[key].time_checkout;
              for (let from = start, i = 0; from < end; from = from + date_milisecond, i++) {
                if (((array_log.time_checkin > from) && (array_log.time_checkin < (from + date_milisecond))) || ((array_log.time_checkout > from) && (array_log.time_checkout < (from + date_milisecond)))) {
                  item.logs[i] = array_log;
                  if (array_log.time_checkin < array_log.time_checkout) {
                    total += array_log.time_checkout - array_log.time_checkin;
                  }
                  break;
                }
              }
            }
            item.total = this.converMsToMinutes(total);
            item.half_total = this.converMsToMinutes(total / 30);
          });
          this.status.push(item);
        }
      });
    } else {
      this.dbService.select('pupils').on('value', res => {
        for (let key in res.val()) {
          array_id.forEach(arr_id => {
            if (arr_id === res.val()[key].id) {
              let item = {
                first_name: '',
                last_name: '',
                location: '',
                logs: [],
                total: 0,
                half_total: 0
              }
              for (let from = start; from < end; from = from + date_milisecond) {
                item.logs.push({
                  agent_checkin: '',
                  agent_checkout: '',
                  time_checkin: null,
                  time_checkout: null
                });
              }
              item.first_name = res.val()[key].first_name;
              item.last_name = res.val()[key].last_name;
              item.location = res.val()[key].location;
              this.dbService.getWhere('logs', 'id', res.val()[key].id).on('value', res => {
                this.loading = false;
                let total = 0;
                for (let key in res.val()) {
                  let array_log = {
                    agent_checkin: '',
                    agent_checkout: '',
                    time_checkin: null,
                    time_checkout: null
                  };
                  array_log.agent_checkin = res.val()[key].time_checkin ? this.getFirstChar(res.val()[key].agent_name) : "";
                  array_log.agent_checkout = res.val()[key].time_checkout ? this.getFirstChar(res.val()[key].agent_name) : "";
                  array_log.time_checkin = res.val()[key].time_checkin === 0 ? null : res.val()[key].time_checkin;
                  array_log.time_checkout = res.val()[key].time_checkout === 0 ? null : res.val()[key].time_checkout;
                  for (let from = start, i = 0; from < end; from = from + date_milisecond, i++) {
                    if (((array_log.time_checkin > from) && (array_log.time_checkin < (from + date_milisecond))) || ((array_log.time_checkout > from) && (array_log.time_checkout < (from + date_milisecond)))) {
                      item.logs[i] = array_log;
                      if (array_log.time_checkin < array_log.time_checkout) {
                        total += array_log.time_checkout - array_log.time_checkin;
                      }
                      break;
                    }
                  }
                }
                item.total = this.converMsToMinutes(total);
                item.half_total = this.converMsToMinutes(total / 30);
              });
              this.status.push(item);
            }
          });
        }
      });
    }
  }

  converMsToMinutes(milisecond: number) {
    return Math.ceil(milisecond / 1000 / 60);
  }

  convertMsToDay(milisecond: number) {
    let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return day[new Date(milisecond).getDay()];
  }

  convertMsToMonth(milisecond: number) {
    let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return month[new Date(milisecond).getMonth()];
  }

  getFirstChar(str: string) {
    let array = [];
    str.split(" ").forEach(el => {
      array.push(el.substring(0, 1));
    });
    return array.join("");
  }

  getSup(milisecond: number) {
    let date = new Date(milisecond).getDate();
    let sup: string;
    if (date === 1) {
      sup = 'st';
    } else if (date === 2) {
      sup = 'nd'
    } else if (date === 3) {
      sup = 'rd'
    } else {
      sup = 'th'
    }
    return sup;
  }

  dateFrom: Date = new Date(new Date().setHours(0, 0, 0, 0) - (86400000 * 6));
  dateTo: Date = new Date(new Date().setHours(0, 0, 0, 0));

  datepickerFromOpts = {
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    templates: {
      leftArrow: '<i class="ion-chevron-left"></i>',
      rightArrow: '<i class="ion-chevron-right"></i>'
    },
    icon: 'ion-calendar',
    format: 'dd/mm/yyyy'
  }

  datepickerToOpts = {
    minDate: new Date(),
    startDate: this.dateFrom,
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    templates: {
      leftArrow: '<i class="ion-chevron-left"></i>',
      rightArrow: '<i class="ion-chevron-right"></i>'
    },
    icon: 'ion-calendar',
    format: 'dd/mm/yyyy'
  }

  // FUNCTION CHANGE START TIME
  handleDateFromChange(e) {
    this.dateFrom = e;
    this.datepickerToOpts = {
      ...this.datepickerToOpts,
      startDate: e
    };
    this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + 86399999, this.checkedPupils);
  }

  // FUNCTION CHANGE END TIME
  handleDateToChange(e) {
    this.dateTo = e;
    this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + 86399999, this.checkedPupils);
  }

  searchText: string = '';
  clearText() {
    this.searchText = '';
  }

  // OPEN POPUP SEARCH PUPILS
  openFilter() {
    this.pupils.sort(function (a, b) {
      if (a.last_name < b.last_name) return -1;
      if (a.last_name > b.last_name) return 1;
      return 0;
    });
  }

  // convert number to character
  // 1: A, 2: B, 27: AA, 28: AB
  toLetters(num) {
    var mod = num % 26;
    var pow = num / 26 | 0;
    var out = mod ? String.fromCharCode(64 + mod) : (pow-- , 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

  exportExcel() {
    let date_length = this.header.length;
    var ws = {}, ws_left = {}, ws_center = {}, ws_right = {};
    let startCol = 1;
    // header of left
    ws_left[this.toLetters(startCol) + 1] = { t: "s", v: "Full Name" };
    ws_left[this.toLetters(startCol + 1) + 1] = { t: "s", v: "Location" };
    startCol = 3;
    // day header of logs
    const step = 4;
    ws_center["!merges"] = [];
    this.header.forEach((el, i) => {
      ws_center[this.toLetters(startCol) + 1] = {
        t: 's',
        v: el.day.substring(0, 3) + ', ' + el.date + '/' + el.month
      }
      startCol += step;
      ws_center["!merges"].push({
        s: { r: 0, c: (2 + step * i) }, e: { r: 0, c: (2 + step * (i + 1) - 1) }
      });
    });
    // right header
    ws_right[this.toLetters(startCol) + 1] = { t: 's', v: 'Total mn' }
    ws_right[this.toLetters(startCol + 1) + 1] = { t: 's', v: 'Total half-hours' }
    // content
    this.status.forEach((val, i) => {
      startCol = 1;
      ws_left[this.toLetters(startCol) + (2 + i)] = {
        t: 's',
        v: val.last_name + ' ' + val.first_name
      }
      ws_left[this.toLetters(startCol + 1) + (2 + i)] = {
        t: 's',
        v: val.location
      }
      let subStart;
      val.logs.forEach((item, index) => {
        subStart = 3 + index * 4;
        ws_center[this.toLetters(subStart) + (2 + i)] = {
          t: 's',
          v: this.convertMsToTime(item.time_checkin)
        }
        ws_center[this.toLetters(subStart + 1) + (2 + i)] = {
          t: 's',
          v: item.agent_checkin
        }
        ws_center[this.toLetters(subStart + 2) + (2 + i)] = {
          t: 's',
          v: this.convertMsToTime(item.time_checkout)
        }
        ws_center[this.toLetters(subStart + 3) + (2 + i)] = {
          t: 's',
          v: item.agent_checkout
        }
      });
      // right content      
      ws_right[this.toLetters(subStart + 4) + (i + 2)] = {
        t: 's',
        v: val.total
      }
      ws_right[this.toLetters(subStart + 5) + (i + 2)] = {
        t: 's',
        v: val.half_total
      }
    });

    ws['!ref'] = "A1:ZZ" + (this.status.length + 1);    // set table reference
    Object.assign(ws, ws_left, ws_center, ws_right);

    const excelBuffer: any = XLSX.write(
      {
        SheetNames: ['data'],
        Sheets: { 'data': ws }
      }, {
        bookType: 'xlsx',
        type: 'buffer'
      }
    );
    const blob: Blob = new Blob([excelBuffer], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, `export_${new Date().getTime()}.xlsx`);
  }

  convertMsToTime(milisecond) {
    if (milisecond === null || milisecond === undefined) {
      return "";
    } else {
      let hours = new Date(milisecond).getHours();
      let minutes = new Date(milisecond).getMinutes();
      let tmp_hours = "" + hours;
      let tmp_minutes = "" + minutes;
      if (hours < 10) {
        tmp_hours = "0" + hours
      }
      if (minutes < 10) {
        tmp_minutes = "0" + minutes
      }
      return tmp_hours + ":" + tmp_minutes;
    }
  }

  // FUNCTION CHECKED PUPILS IN POPUP
  checkedPupils = [];
  getCheckedPupils($event, id) {
    if ($event.target.checked) {
      this.checkedPupils.push(parseInt(id));
    } else {
      this.checkedPupils.forEach((value, index) => {
        if (value === parseInt(id)) {
          this.checkedPupils.splice(index, 1);
        }
      });
    }
    this.getLogs(this.dateFrom.getTime(), this.dateTo.getTime() + 86399999, this.checkedPupils);
  }

  fieldsort: "";
  isDesc: boolean = false;
  direction: number;
  orderBy(col) {
    this.fieldsort = col;
    this.isDesc = !this.isDesc; // direction : decrease | increase
    this.direction = this.isDesc ? 1 : -1; // direction flag
  }


}
