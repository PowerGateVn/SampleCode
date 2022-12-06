
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchEntityPipe } from './search-entity.pipe';
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SearchEntityPipe
  ],
  exports: [
    SearchEntityPipe
  ]
})
export class SearchEntityModule {}
