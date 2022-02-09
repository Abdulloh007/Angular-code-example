import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilialsService } from 'src/app/services/filials.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.scss']
})
export class ReportGeneratorComponent implements OnInit {
  // @ViewChild('blocks') blocks!: ElementRef;
rowTR: any[] = [];
filialsList: any[] = [];
totalCount: number = 0;
total: number = 0;
selectedFilial: any = '';
dateStart: any = '';
dateEnd: any = '';
reqData: any = {
  page: '',
  group_by: 'service_name',
  start_date: '',
  end_date: '',
  filial_id: ''
};
fills: any = '?';
  constructor(
    private service: TransactionsService,
    private filials: FilialsService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.getTransactions();
    this.getFilialsList();
    this.prepearData('','service_name','', '', '');
  }

  getTransactions() {
    this.loader.show();
    this.getTransactionsData('?group_by=service_name')
  }
  getTransactionsData(params?: any){
    this.service.getTransactions(params).subscribe((res:any) => {
        this.loader.hide();
        this.totalCount = 0;
        this.total = 0;
        res.data.map((it: any) => {
          this.totalCount += it.count;
          this.total += parseInt(it.total);
        })
        console.log(res.data);
        return this.rowTR = res.data;   
    })
  }


  getFilialsList() {
    this.filials.getFilials().subscribe((res: any)=>{
      res.data.map((it: any) => {
        this.filialsList.push(it)
      })
    })
  }

  requestData(key?: any, value?: any) {
    if(key === 'page') {
      this.reqData.page = value;
    }
    else if(key === 'group_by') {
      this.reqData.group_by = value;
    }
    else if(key === 'start') {
      this.reqData.start_date = value;
    }
    else if(key === 'end') {
      this.reqData.end_date = value;
    }
    else if(key === 'filial') {
      this.reqData.filial_id = value;
    }
    this.getTransactionsData( this.prepearData(this.reqData.page, this.reqData.group_by, this.reqData.start_date, this.reqData.end_date, this.reqData.filial_id))
    
  }

  prepearData(page?: any, group_by?: any, start?: any, end?:any, filial?: any) {
    this.fills = '?'
    
    return this.fills += `${page != '' ? 'page='+page+'&' : ''}${group_by != '' ? 'group_by='+group_by+'&' : ''}${start != '' ? 'start_date='+start+'&' : ''}${end != '' ? 'end_date='+end+'&' : ''}${filial != '' ? 'filial_id='+filial : ''}`; 
  }

  parseInt(str: string){
    return parseInt(str);
  }

  tester(ev?: any) {
    console.log(ev);
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
