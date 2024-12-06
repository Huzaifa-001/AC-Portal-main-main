// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'customSort'
// })
// export class CustomSortPipe implements PipeTransform {
//   transform(array: any[], field: string, order: string = 'asc'): any[] {
//     if (!array || array.length === 0 || !field) {
//       return array;
//     }

//     const isAsc = order === 'asc';

//     return array.sort((a, b) => {
//       const valueA = this.getProperty(a, field);
//       const valueB = this.getProperty(b, field);

//       if (typeof valueA === 'string' && typeof valueB === 'string') {
//         return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
//       } else if (typeof valueA === 'number' && typeof valueB === 'number') {
//         return isAsc ? valueA - valueB : valueB - valueA;
//       } else {
//         return 0; // If types are different or not string/number, maintain the order.
//       }
//     });
//   }

//   private getProperty(object: any, path: string): any {
//     return path.split('.').reduce((o, p) => (o ? o[p] : undefined), object);
//   }
// }



import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customSort'
})
export class CustomSortPipe implements PipeTransform {
  transform(array: any[], field: string, order: string = 'asc'): any[] {
    if (!array || array.length === 0 || !field) {
      return array;
    }

    const isAsc = order === 'asc';

    return array.sort((a, b) => {
      const valueA = this.getProperty(a, field);
      const valueB = this.getProperty(b, field);

      // Handle numeric and string comparisons separately
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isAsc ? valueA - valueB : valueB - valueA;
      } else {
        return 0; // If types are different or not string/number, maintain the order.
      }
    });
  }

  // Utility function to access nested properties
  private getProperty(object: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), object);
  }
}

