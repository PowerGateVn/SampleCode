import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortData'
})
export class SortDataPipe implements PipeTransform {

  transform(array: Array<string>, args: string, direction: number): Array<string> {
    return array.sort(
      (a: any, b: any) => {
        if (a[args] < b[args]) {
          return -1 * direction;
        } else if (a[args] > b[args]) {
          return 1 * direction;
        } else {
          return 0;
        }
      }
    );
  }

}
