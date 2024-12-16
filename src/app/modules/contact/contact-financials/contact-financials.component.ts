import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contact-financials',
  templateUrl: './contact-financials.component.html',
  styleUrls: ['./contact-financials.component.css'],
})
export class ContactFinancialsComponent implements OnInit {
  activeTab: string = 'estimates';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isModalVisible = false;
  estimateForm: FormGroup;
  updateData: any = { FormTitle: 'Add Estimate' };
  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;
  // estimates: any[] = [];

  estimates = [
    {
      estimate: '#00001',
      date: new Date('2024-02-10'),
      notes: 'estimate no# 1',
      syncedtobe: new Date('2024-02-12'),
      signed: 'true',
      total: '13422',
      status: 'Draft',
    },
  ];

  budgets = [
    {
      budgets: '',
      date: new Date('2024-02-10'),
      grossprofit: '',
      netprofit: '',
    },
  ];

  materialOrders = [
    {
      order: '',
      date: new Date('2024-02-10'),
      notes: '',
      status: '',
    },
  ];

  invoices = [
    {
      invoices: '',
      date: new Date('2024-02-10'),
      notes: '',
      syncedtobe: '',
      total: '',
      paid: '',
      dueDate: '',
      status: '',
    },
  ];

  creditMemos = [
    {
      number: '',
      relatedRecords: '',
      status: '',
      total: '',
      creditdate: new Date('2024-02-10'),
      credituploaded: '',
    },
  ];

  payments = [
    {
      datePayment: '',
      reference: '',
      total: '',
      invoices: '',
      method: '',
      relatedRecords: '',
      syncedtobe: '',
    },
  ];

  editEvent(event: any) {
    console.log('Edit event:', event);
  }

  deleteEvent(event: any) {
    console.log('Delete event:', event);
  }

  staticEstimates = [
    {
      id: 1,
      estimateNumber: 'E001',
      date: '2024-01-01',
      notes: 'First estimate',
      status: 'Draft',
      syncedToQB: false,
      signed: false,
      items: [
        {
          itemName: 'Item 1',
          description: 'Description 1',
          quantity: 2,
          price: 100,
          amount: 200,
        },
      ],
      subtotal: 200,
      tax: 20,
      total: 220,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.estimateForm = this.fb.group({
      estimateNumber: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
      status: ['Draft'],
      syncedToQB: [false],
      signed: [false],
      items: this.fb.array([]),
      subtotal: [0],
      tax: [0],
      total: [0],
    });
    this.loadPagedData(this.currentPageIndex);
  }

  get items(): FormArray {
    return this.estimateForm.get('items') as FormArray;
  }

  loadPagedData(pageIndex: number): void {
    const startIndex = (pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // this.estimates = this.staticEstimates.slice(startIndex, endIndex);
    // this.totalCount = this.staticEstimates.length;
    this.currentPageIndex = pageIndex;
  }

  // Open modal to add or edit an estimate
  openModal(data: any = null): void {
    this.updateData = data
      ? { ...data, FormTitle: 'Update Estimate', Request_Type: 'Update' }
      : { FormTitle: 'Add Estimate', Request_Type: 'Add' };
    this.isModalVisible = true;

    if (data) {
      this.populateForm(data);
    }
  }

  // Close modal
  closeModal(): void {
    this.isModalVisible = false;
    this.estimateForm.reset(); // Reset the form on close
  }

  // Populate form for editing
  populateForm(data: any): void {
    this.estimateForm.patchValue(data);
    this.items.clear();
    data.items.forEach((item: any) =>
      this.items.push(
        this.fb.group({
          itemName: [item.itemName, Validators.required],
          description: [item.description, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price, [Validators.required, Validators.min(0)]],
          amount: [{ value: item.amount, disabled: true }],
        })
      )
    );
  }

  // Add a new item to the items array
  addItem(): void {
    this.items.push(
      this.fb.group({
        itemName: ['', Validators.required],
        description: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]],
        amount: [{ value: 0, disabled: true }],
      })
    );
  }

  // Remove an item from the items array
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Submit the form
  submitForm(): void {
    if (this.estimateForm.valid) {
      const estimate = this.estimateForm.value;

      if (this.updateData.Request_Type === 'Add') {
        estimate.id = this.staticEstimates.length + 1; // Assign new ID
        this.staticEstimates.push(estimate);
      } else {
        const index = this.staticEstimates.findIndex(
          (e) => e.id === estimate.id
        );
        if (index > -1) {
          this.staticEstimates[index] = estimate;
        }
      }

      this.toastr.success(
        `${
          this.updateData.Request_Type === 'Add' ? 'Added' : 'Updated'
        } Successfully`,
        'Success'
      );
      this.loadPagedData(this.currentPageIndex); // Reload data
      this.closeModal();
    }
  }

  // Delete an estimate
  deleteEstimate(data: any): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: {
        FormTitle: 'Confirm Delete',
        Request_Type: 'Delete',
        estimateNumber: data.estimateNumber,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.staticEstimates.findIndex((e) => e.id === data.id);
        if (index > -1) {
          this.staticEstimates.splice(index, 1);
          this.toastr.success('Deleted Successfully', 'Success');
          this.loadPagedData(this.currentPageIndex); // Reload data
        }
      }
    });
  }
}
