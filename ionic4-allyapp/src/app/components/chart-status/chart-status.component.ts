import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions} from 'chart.js';
import { Label, SingleDataSet} from 'ng2-charts';


@Component({
  selector: 'app-chart-status',
  templateUrl: 'chart-status.component.html',
  styleUrls: ['chart-status.component.scss'],
})
export class ChartStatusComponent implements OnInit {
  @Input() value: string;
  @Input() chartDataSets: any;
  @Input() chartSize = '68px';
  public doughnutChartLabels: Label[] = [];
  // public chartDataSets: any;
  public doughnutChartType: ChartType = 'doughnut';
  public chartOptions: ChartOptions = {
    tooltips: {
      enabled: false
    },
    title: {
      display: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 75
  };
  constructor() {
  }

  ngOnInit() {}


}
