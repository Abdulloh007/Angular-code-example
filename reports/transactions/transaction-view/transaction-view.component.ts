import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent implements OnInit {
  rowTR: any;
  order_id: any;
  transactionId: any = '';
  constructor(
    private service: TransactionsService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.params?.id;
    this.order_id = this.route.snapshot.params?.order_id;
    this.getTransactions(`?order_id=${this.order_id}`);
  }

  getTransactions(params: any) {
    this.loader.show();
    this.getTransactionsData(params)
  }
  getTransactionsData(params?: any){
    this.service.getTransactions(params).subscribe((res:any) => {
        this.loader.hide();
        console.log(res.data);
        return this.rowTR = res.data[0];   
    })

  }
  downloadFile(){
    
    // this.loader.show()
    // this.service.getTransactionsFile('?group_by=service_name').subscribe((res)=>{
    //   this.loader.hide();
    //   this.downloadFileXls(res)
      
    // })
  }

  // downloadFileXls(data: any) {
  //   const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }

  print() {
    const printFrame: any = (window.frames as any)['frame'];
    if (printFrame) {
      printFrame.document.body.innerHTML = `
                    <html>
                    <head>
                    </head>
                    <body>` +
        document.getElementById('blank')?.innerHTML +
        `</body></html>`;
      printFrame.window.focus();
      setTimeout(() => {
        printFrame.window.print();
      }, 0);
    }
  }
}
