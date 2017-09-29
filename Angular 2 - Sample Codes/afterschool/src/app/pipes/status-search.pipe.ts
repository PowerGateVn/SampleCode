import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusSearch'
})

export class StatusSearchPipe implements PipeTransform {

  transform(array: Array<any>, text: string): any {
    if (text === undefined || text === '') {
      array.sort(function (a, b) {
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
        return 0;
      });

      return array;
    } else {
      var first = [];
      var others = [];
      array.forEach(item => {
        if ((item.last_name.toLowerCase() + " " + item.first_name.toLowerCase()).indexOf(text.toLowerCase()) > -1) {
          first.push(item);
        } else {
          others.push(item);
        }
      });
      return first.sort().concat(others.sort());
    }
  }

}
