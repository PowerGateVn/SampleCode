import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pupilSort'
})

export class PupilSortPipe implements PipeTransform {

  transform(array: Array<string>, args: any, direction: number): any {
    return array.sort(
      (a: any, b: any) => {
        if (a[args] < b[args]) return -1 * direction;
        else if (a[args] > b[args]) return 1 * direction;
        else return 0;
      }
    );
  }
}
