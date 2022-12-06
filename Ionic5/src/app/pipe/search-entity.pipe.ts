import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchEntity'
})
export class SearchEntityPipe implements PipeTransform {

  transform(listEntities: any, nameToFilter: string, limit?: any): any {
    const limitArray = limit ? Number(limit) : null;
    if (!listEntities) { return []; }
    listEntities = listEntities.filter((item) => {
      if (item.name.toLowerCase().indexOf(nameToFilter.toLowerCase()) > -1) {
        return item;
      }
    });
    if (limitArray) {
      listEntities = listEntities.slice(0, 10);
    }
    if (!limitArray && listEntities && listEntities.length == 0) {
      return [{name: 'No matching teams', id: -1}];
    }
    return listEntities;
  }

}
