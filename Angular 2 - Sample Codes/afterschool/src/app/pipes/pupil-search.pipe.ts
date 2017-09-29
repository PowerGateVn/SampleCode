import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pupilSearch'
})

export class PupilSearchPipe implements PipeTransform {

  transform(arr: Array<any>, searchText: any) {
    if (searchText === null || searchText === "") {
      return arr;
    } else {
      let tmp_arr = [];
      arr.forEach(el => {
        if (typeof el.id === "undefined") {
          el.id = "";
        }
        if (typeof el.first_name === "undefined") {
          el.first_name = "";
        }
        if (typeof el.last_name === "undefined") {
          el.last_name = "";
        }
        if (typeof el.location === "undefined") {
          el.location = "";
        }
        if (typeof el.date_of_birth === "undefined") {
          el.date_of_birth = "";
        }
        if (typeof el.mother_mobile === "undefined") {
          el.mother_mobile = "";
        }
        if (
          el.id.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
          || (el.last_name + " " + el.first_name).toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
          || el.location.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
          || el.date_of_birth.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
          || el.father_mobile.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
          || el.mother_mobile.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
        ) {
          tmp_arr.push(el);
        }
      });
      return tmp_arr;
    }
  }

}
