import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch'
})
export class SearchPipe implements PipeTransform {
    transform(items: any[], searchText: string, searchFields: string[] = []): any[] {
        if (!items || !searchText || !searchFields || searchFields.length === 0) {
          return items;
        }
      
        searchText = searchText.toLowerCase();
      
        return items.filter(item => this.searchItem(item, searchText, searchFields));
      }
      
      private searchItem(item: any, searchText: string, searchFields: string[]): boolean {
        for (const field of searchFields) {
          if (field.includes('.')) {
            const nestedFields = field.split('.');
            const nestedItem = item[nestedFields[0]];
            if (nestedItem && this.searchItem(nestedItem, searchText, [nestedFields.slice(1).join('.')])) {
              return true;
            }
          } else {
            const value = item[field];
            if (value && value.toString().toLowerCase().includes(searchText)) {
              return true;
            }
          }
        }
        return false;
      }
      
}
