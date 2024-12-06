import { Inject, Injectable } from '@angular/core';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root' // or specify the module where you want to provide the service
})
export class CsvExportService {
  constructor(@Inject('Papa') private papa: typeof Papa) { }

  exportTableToCsvIncludingLastCol(table: any, filename: string) {
    const headers: string[] = [];
    const data: any[] = [];
  
    // Extract table headers
    const headerRows = table.nativeElement.tHead.rows;
    for (let i = 0; i < headerRows.length; i++) {
      const headerCells = headerRows[i].cells;
      for (let j = 0; j < headerCells.length; j++) {
        const headerCellText = headerCells[j].textContent;
        const formattedHeader = `${headerCellText}`; 
        headers.push(formattedHeader);
      }
    }
  
    // Extract table data
    const bodyRows = table.nativeElement.tBodies[0].rows;
    for (let i = 0; i < bodyRows.length; i++) {
      const dataRow: any[] = [];
      const dataCells = bodyRows[i].cells;
      for (let j = 0; j < dataCells.length; j++) {
        const cellContent = dataCells[j].textContent.trim();
        // If the cell contains an icon, retrieve the true or false value from the cell's children
        if (cellContent) {
          const icon = dataCells[j].querySelector('mat-icon');
          if (icon) {
            const iconClass = icon.innerText;
            const isTrue = iconClass.includes('check_circle');
            dataRow.push(isTrue ? 'true' : 'false');
          } else {
            dataRow.push(cellContent);
          }
        } else {
          dataRow.push(cellContent);
        }
      }
      data.push(dataRow);
    }
  
    // Generate CSV content
    const csv = this.papa.unparse({ fields: headers, data });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    URL.revokeObjectURL(url);
  }
  

  exportTableToCsv(table: any, filename: string) {
    const headers: string[] = [];
    const data: any[] = [];

    // Extract table headers
    const headerRows = table.nativeElement.tHead.rows;
    for (let i = 0; i < headerRows.length; i++) {
      const headerCells = headerRows[i].cells;
      for (let j = 0; j < headerCells.length - 1; j++) { // Exclude last column
        const headerCellText = headerCells[j].textContent;
        const formattedHeader = `${headerCellText}`;
        headers.push(formattedHeader);
      }
    }

    // Extract table data
    const bodyRows = table.nativeElement.tBodies[0].rows;
    for (let i = 0; i < bodyRows.length; i++) {
      const dataRow: any[] = [];
      const dataCells = bodyRows[i].cells;
      for (let j = 0; j < dataCells.length - 1; j++) { // Exclude last column
        dataRow.push(dataCells[j].textContent);
      }
      data.push(dataRow);
    }

    // Generate CSV content
    const csv = this.papa.unparse({ fields: headers, data });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    URL.revokeObjectURL(url);
  }

  importCsvFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const config: Papa.ParseConfig = {
        complete: (results: Papa.ParseResult) => {
          resolve(results.data);
        },
        error: (error: Papa.ParseError) => {
          reject(error);
        }
      };

      this.papa.parse(file, config);
    });
  }

}
