import { Component, OnInit } from '@angular/core';
import { MaterialOrderDto } from '../material-order/MarterialOrderDto';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/core/app-config';
import { MaterialOrderService } from '../material-order/material-order.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMaterialOrderComponent } from '../material-order/add-material-order/add-material-order.component';
import { MaterialOrderDetailComponent } from '../material-order/material-order-detail/material-order-detail.component';
import { EditMaterialOrderComponent } from '../material-order/edit-material-order/edit-material-order.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent  {

}
