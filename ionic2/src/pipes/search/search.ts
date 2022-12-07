import { Pipe, PipeTransform } from '@angular/core';
import { log } from 'util';
/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value : any, searchText : string ) : any {
    if (!searchText) {
      return value
    }
    return value.filter(function (user) {
      let texts = []
      texts = user.full_name.split(' ')
      for(let i=0; i<texts.length ; i++){
        if (texts[i].substring(0, searchText.length).toLowerCase().indexOf(searchText.toLowerCase()) > -1){
          return user
        }
      }
      //return user.full_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }
}
