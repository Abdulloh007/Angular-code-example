import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditsComponent } from './credits/credits.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ReportGeneratorComponent } from './report-generator/report-generator.component';
import { RoyaltyComponent } from './royalty/royalty.component';
import { TransactionViewComponent } from './transactions/transaction-view/transaction-view.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {path: '', children: [
    {path: 'transactions', component: TransactionsComponent,
      data: {
        title: 'Транзакции'
      }
    },
    {path: 'view-transaction', component: TransactionViewComponent, 
      data: {
        title: 'Транзакции'
      }
    },
    {path: 'royalty', component: RoyaltyComponent,
      data: {
        title: ''
      }},
    {path: 'credits', component: CreditsComponent,
      data: {
        title: ''
      }
    },
    {path: 'receipts', component: ReceiptsComponent,
      data: {
        title: ''
      }
    },
    {path: 'generator', component: ReportGeneratorComponent,
      data: {
        title: ''
      }
    }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
