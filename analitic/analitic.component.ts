import {Component, OnInit, ViewChild} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { TransactionsService } from 'src/app/services/transactions.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-analitic',
  templateUrl: './analitic.component.html',
  styleUrls: ['./analitic.component.scss']
})
export class AnaliticComponent implements OnInit {
  allTransactions: any[] = [];
  totalPacient: number = 0;
  totalTransactions: number = 0;
  totalIncomes: number = 0;
  
  
  
  @ViewChild("chart", { static: false }) chart: ChartComponent | any  ;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptions2: Partial<ChartOptions> | any;

  constructor(
    private transactions: TransactionsService
  ) {
    this.chartOptions = {
      series: [{
        name: 'Доход',
        data: [0]
      }, {
        name: 'Расход',
        data: [0]
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        fontSize: '12px',
        fontWeight: 300,
        
        labels: {
          colors: 'black',
        },
        position: 'bottom',
        horizontalAlign: 'center', 	
        markers: {
          width: 19,
          height: 19,
          strokeWidth: 0,
          radius: 19,
          strokeColor: '#fff',
          fillColors: ['#369DC9','#D45BFF'],
          offsetX: 0,
          offsetY: 0
        }
      },
      yaxis: {
        labels: {
        style: {
          colors: '#3e4954',
          fontSize: '14px',
          fontFamily: 'Poppins',
          fontWeight: 100,
          
        },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [this.addDays(new Date(), -4), this.addDays(new Date(), -3), this.addDays(new Date(), -2), this.addDays(new Date(), -1), this.addDays(new Date(), 0)],
      },
      fill: {
        colors:['#369DC9','#D45BFF'],
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return "TJS " + val 
          }
        }
      }
    }
    this.chartOptions2 = {
        series: [{
          name: "Итого пациентов",
          data: [500, 230, 600, 360, 700, 890, 750, 420, 600, 300, 420, 220]
        },
        {
          name: "Итого исследований",
          data: [250, 380, 200, 300, 200, 520,380, 770, 250, 520, 300, 900]
        }
      ],
        chart: {
          height: 350,
          type: 'area',
          group: 'social',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [2, 2],
          colors:['#F46B68','#2BC155'],
          curve: 'straight'
        },
        legend: {
          tooltipHoverFormatter: function(val: any, opts:any) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          },
          markers: {
            fillColors:['#F46B68','#2BC155'],
            width: 19,
            height: 19,
            strokeWidth: 0,
            radius: 19
          }
        },
        markers: {
          size: 6,
          border:0,
          colors:['#F46B68','#2BC155'],
          hover: {
            size: 6,
          }
        },
        xaxis: {
          categories: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь','Октябрь','Ноябрь','Декабрь',
            '10 Jan', '11 Jan', '12 Jan'
          ],
        },
        yaxis: {
          labels: {
            style: {
              colors: '#3e4954',
              fontSize: '14px',
              fontFamily: 'Poppins',
              fontWeight: 100,
              
            },
          },
        },
        fill: {
          colors:['#F46B68','#2BC155'],
          type:'solid',
          opacity: 0.07
        },
        grid: {
          borderColor: '#f1f1f1',
        }
    };
  }

  ngOnInit(): void {
    this.getTransactions();
    
  }

  changeValue(){
    this.chartOptions.series[0].data.push(25);
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  getTransactions() {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 2);
    let gapArrPacient: any = [];
    let gapArrIncomes: any = [];
    let totalIncomes: any = 0;
    this.transactions.getTransactions(`?start_date=${firstDay}`).subscribe((res: any)=>{
      this.allTransactions = res.data;     
      
      res.data.filter((it:any)=>{
        if(!gapArrPacient.includes(it.client_id)) {
          gapArrPacient.push(it.client_id);
        }
        gapArrIncomes.push((parseFloat(it.total).toFixed(2)))

        totalIncomes += parseFloat(it.total)
        
      }) 
      this.totalPacient = gapArrPacient.length

      this.totalTransactions = res.data.length

      this.totalIncomes = totalIncomes.toFixed(2)

      let lastDay = -1

      let income: any = {
        i1: {
          date: '',
          total: 0
        }, 
        i2: {
          date: '',
          total: 0
        }, 
        i3: {
          date: '',
          total: 0
        }, 
        i4: {
          date: '',
          total: 0
        },  
        i5: {
          date: '',
          total: 0
        },  
      }

      let k = 0;
      for(let i = 0; i < res.data.length; i++) {

        let curDay = new Date(res.data[i].created_at).getDate();
        if(lastDay != curDay){
             k++;
             lastDay = curDay
             if (k>6) {
               break;
             }
        }
        
        
        income['i'+k].date = curDay;
        income['i'+k].total += parseFloat(res.data[i].total);
      
        
      }
      console.log(income);
      let gapChartArr = []
      for(let i = 0; i < this.chartOptions.xaxis.categories.length; i++) {
        // console.log(this.chartOptions.xaxis.categories[i]);
        let total = 0;
        for(let j = 1; j < 6; j++) {
          
         
          if ( income['i'+j].date == this.chartOptions.xaxis.categories[i]) {
            
            total = income['i'+j].total
            
          }
         
          
        }
        gapChartArr.push(total)
        
      }
      this.chartOptions.series = [{
        name: 'Доход',
        data: gapChartArr
      }, {
        name: 'Расход',
        data: [0]
      }];
    })
    
    
    
  }
  
  addDays(date: any, days: any) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.getDate();
  }
}
