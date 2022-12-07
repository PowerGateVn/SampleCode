import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'weekdaysShort' })
export class WeekdaysShortPipe implements PipeTransform {
  transform(input: string) {
    return input.slice(0, 3);
  }
}
