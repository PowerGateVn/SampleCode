import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekdaysShortPipe } from './weekdays.pipe';


@NgModule({
  imports: [CommonModule],
  exports: [WeekdaysShortPipe],
  declarations: [WeekdaysShortPipe]
})
export class PipeCoreModule {}
