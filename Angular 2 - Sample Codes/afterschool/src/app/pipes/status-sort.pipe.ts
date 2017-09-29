import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusSort'
})
export class StatusSortPipe implements PipeTransform {

  transform(array: Array<any>, checkedPupils: Array<any>): any {
    if (checkedPupils.length === 0 || checkedPupils === undefined){
      return array;
    } else {
      let tmp_array = [];
      array.forEach(el => {
        checkedPupils.forEach(el_id => {
          if (el.id === el_id) {
            tmp_array.push(el);
          }
        });
      });
      return tmp_array;
    }
  }

}
