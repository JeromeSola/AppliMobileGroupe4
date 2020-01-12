import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from "chart.js";
import * as moment from 'moment';
import { GoogleFitService } from 'src/app/services/google-fit.service';

@Component({
  selector: 'app-progression',
  templateUrl: './progression.page.html',
  styleUrls: ['./progression.page.scss'],
})
export class ProgressionPage implements OnInit {
  @ViewChild('lineChart', { static: false }) lineChart;
  @ViewChild('monthChart', { static: false }) monthChart;

  charts = {
    week: this.lineChart,
    month: this.monthChart
  }

  weekDate: any;
  monthDate: any;

  constructor(private ggFit: GoogleFitService) { }

  ngOnInit() {
    moment.locale('FR');
  }

  ionViewWillEnter() {

    this.charts.week = this.lineChart;
    this.charts.month = this.monthChart;

    this.getStepsInfosByDay('week').then(
      (weekChart) => {
        console.log(weekChart)
        this.createChart(weekChart, 'week')
      }
    )

    this.getStepsInfosByDay('month').then(
      (monthChart) => {
        console.log(monthChart)
        this.createChart(monthChart, 'month')
      }
    )
  }

  ionViewDidEnter() {

  }

  createChart(chart: any, specificChart: string) {
    this.charts[specificChart] = new Chart(this.charts[specificChart].nativeElement, {
      type: 'line',
      data: {
        labels: chart.xData,
        datasets: [{
          data: chart.yData,
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }

  getStepsInfosByDay(specificChart) {
    var chart = {
      xData: [],
      yData: [],
    }
    var req = {
      startTime: this.getSpecificTimeForChart(specificChart),
      endTime: new Date().getTime(),
      duration: 86400000 //=1J  //Milliseconds 
    }

    return this.ggFit.getStepsInfo(req)
      .then(
        (data: any) => {
          console.log(data)
          data.bucket
            .map(

              (activity) => {

                var startTime: any = new Date(+activity.startTimeMillis).getTime();
                this.setXData(chart, specificChart, startTime);

                if (activity.dataset[0].point.length > 0) {
                  chart.yData.push(activity.dataset[0].point[0].value[0].intVal)
                } else {
                  chart.yData.push(0)
                }

              }
            )
        }
      )
      .then(
        () => {
          return chart;
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  setXData(chart, specificChart: string, data) {
    try {
      if (specificChart == "week") {
        chart.xData.push(moment(data).format("dddd"))
      } else if (specificChart == "month") {
        chart.xData.push(moment(data).format("Do"))
      } else {
        throw Error("unknow chart")
      }
    } catch (e) {
      console.error(e)
    }

  }

  getSpecificTimeForChart(specificChart: string) {
    try {
      if (specificChart === "month") {
        return this.getFirstOfMonth()
      } else if (specificChart === "week") {
        return this.getLastMondayOfWeek()
      } else {
        throw Error("unknow chart")
      }
    } catch (e) {
      console.error(e)
    }
  }

  getLastMondayOfWeek(): number {
    var today = new Date();
    var day = today.getDay();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var lastMonday;

    if (day === 0) {
      lastMonday = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000);
      console.log(lastMonday);

    } else {
      lastMonday = new Date(today.getTime() - (day - 1) * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000)
    }

    this.weekDate = moment(lastMonday).format("L");
    return lastMonday.getTime();
  }

  getFirstOfMonth(): number {
    var today = new Date();
    var monthDate = today.getDate()
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var firstofMonth = new Date(today.getTime() - (monthDate - 1) * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000);
    this.monthDate = moment(firstofMonth).format("L");
    console.log(firstofMonth);
    return firstofMonth.getTime();

  }
}