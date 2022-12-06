import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'owner-objective',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[]): any {
        if (!items) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // return items.filter(item => item.title.indexOf(filter.title) !== -1);
        return items.filter(e => e.depth === 0 || (e.ancestors[e.depth - 1].owner.id !== 4))
    }
}