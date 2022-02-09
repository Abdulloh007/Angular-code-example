import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, map, switchMap } from 'rxjs/operators';
import { CodeShtrichComponent } from 'src/app/components/incomes/code-shtrich/code-shtrich.component';
import { setCurDate } from 'src/app/helpers/dateTime';
import { FilialsService } from 'src/app/services/filials.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  rowTR: any;
  allRowTR: any[] = [];
  filialsList: any[] = [];
  rowTH = [
    '№  транзакции',
    'Дата и время транзакции',
    'Номер чека',
    'ID Услуг',
    'Статус',
    'Филиал',
    'Кассир',
    'Метод',
    'Сума'
    // 'Долг'
  ];
  paginationPage: number = 1;
  toPage: number = 1;
  btnState: boolean = false;
  search: FormControl = new FormControl(null);
  subscription$: any;
  selectedFilial: any = '';
  dateStart: any = '';
  dateEnd: any = '';
  reqData: any = {
    page: '',
    group_by: '',
    start_date: '',
    end_date: '',
    filial_id: ''
  };
  fills: any = '?';
  interval$: any;
  @ViewChild(MatPaginator) paginator: any;
  constructor(
    private service: TransactionsService,
    private toastr: ToastrService,
    private loader: LoaderService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private filials: FilialsService
  ) { }

  ngOnInit(): void {
    this.getTransactions();
    this.getFilialsList()
  }

  // searchChange() {
  //   this.search.valueChanges.subscribe((val: string) => {
  //     this.rowTR = this.allRowTR.filter((row: any) => {
  //       return row.id?.toString().toLowerCase().includes(val?.toLowerCase())
  //     });
  //   })
  // }

  getTransactions() {
    this.loader.show();
    this.getTransactionsData('?page=' + this.paginationPage);
    this.checkoutPrevBtn();

  }
  getTransactionsData(params?: any){
    this.service.getTransactions(params).subscribe((res:any) => {
      this.loader.hide();
      // if(res.data.length == 0) {
      //   this.paginationPage = 1;
      //   this.toPage = this.paginationPage;
      //   this.checkoutPrevBtn();
      //   return this.getTransactionsData('?page=' + this.paginationPage);
      // }
      return this.rowTR = res.data
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
  repage(value: string) {
    if (value === 'past'){
      this.paginationPage === 0 || this.paginationPage === 1 ? this.paginationPage = 1 : this.paginationPage--;
      this.getTransactionsData('?page=' + this.paginationPage);
      this.toPage = this.paginationPage;
    } else if(value === 'next') {
      this.paginationPage++;
      this.getTransactionsData('?page=' + this.paginationPage);
      this.toPage = this.paginationPage;
    } else if(value === 'to') {
      this.paginationPage = this.toPage;
      this.getTransactionsData('?page=' + this.paginationPage);
    }
  }

  checkoutPrevBtn() {
    if (this.paginationPage === 1) {
      return this.btnState = true;
    }else {
      return this.btnState = false;
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.interval$)
  }
  generateReport(){
    this.router.navigate(['dashboard/reports/generator', {page: this.paginationPage}]); 
  }
  viewReport(id: any, order_id: any){
    this.router.navigate(['dashboard/reports/view-transaction', {id: id, order_id: order_id}]); 
  }

  downloadFile() {
      this.loader.show()
      this.service.getTransactionsFile(this.fills).subscribe((res)=>{
      this.loader.hide();
      this.downloadFileXls(res)
      
    })
  }

  downloadFileXls(data: any) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }



}
