import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { FormsModule } from '@angular/forms';
import { TransactionViewComponent } from './transactions/transaction-view/transaction-view.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
