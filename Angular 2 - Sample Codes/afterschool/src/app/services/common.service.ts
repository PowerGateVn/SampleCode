
import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() {

  }

  filterData(data, id, time_start, time_end, num_id) {
    let number_loop = (time_end - time_start) / (24 * 60 * 60 * 1000) + 1;
    let arr = [];
    let arr_result = [];

    let count = 0;
    let count_1 = 0;
    let step = 24 * 60 * 60 * 1000;
    for (let i = 1; i <= number_loop; i++) {
      count++;
      arr.push({
        number_id: num_id,
        number_col: count,
        time_to_start: time_start + step * (count - 1),
        time_to_end: time_start + (step * count - 1000)
      });
    }
    if (count == number_loop) {
      for (let j = 0; j < arr.length; j++) {
        count_1++;
        for (let k = 0; k < data.length; k++) {
          if (data[k].time_checkin > arr[j].time_to_start && data[k].time_checkin < arr[j].time_to_end && data[k].time_checkout > 0) {
            let time_checkin_h = new Date(data[k].time_checkin).getHours();
            let time_checkin_m = new Date(data[k].time_checkin).getMinutes();
            let time_checkout_h = new Date(data[k].time_checkout).getHours();
            let time_checkout_m = new Date(data[k].time_checkout).getMinutes();
            arr[j].time_checkin = data[k].time_checkin;
            arr[j].time_checkout = data[k].time_checkout;
            arr[j].time_checkin_h = time_checkin_h;
            arr[j].time_checkin_m = time_checkin_m;
            arr[j].time_checkout_h = time_checkout_h;
            arr[j].time_checkout_m = time_checkout_m;
            arr[j].status = data[k].status;
            arr[j].location = data[k].location;
            arr[j].id = data[k].id;
            arr[j].agent_name = this.convertNameAgent(data[k].agent_name);
            arr[j].time_total = data[k].time_checkout - data[k].time_checkin;
          } else if (data[k].time_checkin > arr[j].time_to_start && data[k].time_checkin < arr[j].time_to_end && data[k].time_checkout == 0) {
            let time_checkin_h = new Date(data[k].time_checkin).getHours();
            let time_checkin_m = new Date(data[k].time_checkin).getMinutes();
            arr[j].time_checkin = data[k].time_checkin;
            arr[j].time_checkout = 0;
            arr[j].time_checkin_h = time_checkin_h;
            arr[j].time_checkin_m = time_checkin_m;
            arr[j].time_checkout_h = '-';
            arr[j].time_checkout_m = '-';
            arr[j].status = data[k].status;
            arr[j].location = data[k].location;
            arr[j].id = data[k].id;
            arr[j].agent_name = this.convertNameAgent(data[k].agent_name);
            arr[j].time_total = 0;
          } else {
            arr[j].time_checkin = null;
            arr[j].time_checkout = null;
            arr[j].time_checkin_h = null;
            arr[j].time_checkin_m = null;
            arr[j].time_checkout_h = null;
            arr[j].time_checkout_m = null;
            arr[j].status = null;
            arr[j].location = null;
            arr[j].id = null;
            arr[j].agent_name = null;
            arr[j].time_total = 0;
          }
        }

        arr_result.push(arr[j]);
      }

      if (count_1 == arr.length) {
        return arr_result;
      }
    }
  }

  convertNameAgent(name) {
    let firstname = name.split(' ')[0];
    let lastname = name.split(' ')[1];
    let firstname_sub = firstname.substring(0, 1);
    let lastname_sub = lastname.substring(0, 1);
    let name_sub = firstname_sub + lastname_sub;
    return name_sub;
  }

  getTotalTime(data, id, time_start, time_end, num_id) {
    let number_loop = (time_end - time_start) / (24 * 60 * 60 * 1000) + 1;
    let arr = [];
    let arr_result = [];

    let count = 0;
    let count_1 = 0;
    let step = 24 * 60 * 60 * 1000;
    for (let i = 1; i <= number_loop; i++) {
      count++;
      arr.push({
        number_id: num_id,
        number_col: count,
        time_to_start: time_start + step * (count - 1),
        time_to_end: time_start + (step * count - 1000)
      });
    }

    if (count == number_loop) {
      for (let j = 0; j < arr.length; j++) {
        count_1++;
        for (let k = 0; k < data.length; k++) {
          if (data[k].time_checkin > arr[j].time_to_start && data[k].time_checkin < arr[j].time_to_end && data[k].time_checkout > 0) {
            arr[j].time_total = data[k].time_checkout - data[k].time_checkin;
            arr[j].time_half_total = (data[k].time_checkout - data[k].time_checkin) / 2
          } else if (data[k].time_checkin > arr[j].time_to_start && data[k].time_checkin < arr[j].time_to_end && data[k].time_checkout == 0) {
            arr[j].time_total = 0;
            arr[j].time_half_total = 0;
          } else {
            arr[j].time_total = 0;
            arr[j].time_half_total = 0;
          }
        }
        arr_result.push(arr[j]);
      }

      let total_time = 0;
      for (let k = 0; k < arr_result.length; k++) {
        total_time += arr_result[k].time_total;
      }
      return {
        number_id: num_id,
        total_of_time: this.convertmsToTime(total_time),
        total_half_time: this.convertmsToHalfTime(total_time),
        // total_half_time: Math.round(total_time / 1000 / 60 / 30)
      }
    }
  }

  getStringMonth(m) {
    var month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[m];
  }


  filterDate(time_start, time_end) {
    let number_loop = (time_end - time_start) / (24 * 60 * 60 * 1000) + 1;
    let arr = [];
    let count = 0;
    let step = 24 * 60 * 60 * 1000;
    for (let i = 1; i <= number_loop; i++) {
      count++;
      let day_val;
      switch (new Date(time_start + step * (count - 1)).getDay()) {
        case 0:
          day_val = "Sunday";
          break;
        case 1:
          day_val = "Monday";
          break;
        case 2:
          day_val = "Tuesday";
          break;
        case 3:
          day_val = "Wednesday";
          break;
        case 4:
          day_val = "Thursday";
          break;
        case 5:
          day_val = "Friday";
          break;
        case 6:
          day_val = "Saturday";
      }
      let order;
      if (new Date(time_start + step * (count - 1)).getDate() === 1) {
        order = 'st'
      } else if (new Date(time_start + step * (count - 1)).getDate() === 2) {
        order = 'nd'
      } else if (new Date(time_start + step * (count - 1)).getDate() === 3) {
        order = 'rd'
      } else {
        order = 'th'
      }
      arr.push({
        number: count,
        date: new Date(time_start + step * (count - 1)).getDate(),
        month: this.getStringMonth(new Date(time_start + step * (count - 1)).getMonth()),
        year: new Date(time_start + step * (count - 1)).getFullYear(),
        order: order,
        day: day_val,
      });
    }

    if (count == number_loop) {
      return arr;
    }
  }

  // convert miliseconds to hour:minute | hh:mm
  convertmsToTime(duration) {
    if (isNaN(duration)) {
      return 0;
    } else if (duration !== 0) {
      let tmp_hour = Math.floor(duration / 1000 / 60 / 60);
      let tmp_minute = Math.floor(duration / 1000 / 60 % 60);
      let time_total = tmp_hour * 60 + tmp_minute;
      return time_total;
    } else {
      return 0;
    }
  }

  convertmsToHalfTime(duration) {
    if (isNaN(duration)) {
      return 0;
    } else if (duration == 0) {
      return 0;
    } else {
      let tmp_hour = Math.floor(duration / 1000 / 60 / 60);
      let tmp_minute = Math.floor(duration / 1000 / 60 % 60);
      let time_total = tmp_hour * 60 + tmp_minute;
      let half_time_total_number = Math.floor(time_total / 30);
      if (half_time_total_number * 30 == time_total) {
        return half_time_total_number;
      } else {
        return half_time_total_number + 1;
      }
    }
  }

}
