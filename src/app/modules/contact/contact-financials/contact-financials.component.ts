import { Component } from '@angular/core';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-contact-financials',
  templateUrl: './contact-financials.component.html',
  styleUrls: ['./contact-financials.component.css']
})
export class ContactFinancialsComponent {
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  attachments = []
  loadPagedData(pageIndex: number) {
    
  }

  onFileSelected(event: any) {
    debugger
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          
        };
        reader.readAsDataURL(file);
      }

    }
  }


  deleteClick(data: any): void {
    let dialogRef: any = {};
    data.FormTitle = 'Confirm Delete';
    data.Request_Type = 'Delete';
    // dialogRef = this.dialog.open(ConfirmationComponent, {
    //   width: '30vw',
    //   height: '200px',
    //   data: data,
    //   disableClose: true,
    // });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        
      }
    });
  }
}
