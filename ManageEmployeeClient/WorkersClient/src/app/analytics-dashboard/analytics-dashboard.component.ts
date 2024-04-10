import { Component,OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './analytics-dashboard.component.html',
  styleUrl: './analytics-dashboard.component.css'
})
export class AnalyticsDashboardComponent implements OnInit{

  numberOfEmployees!: number;
  // ... נתונים נוספים

  constructor() { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Number of Items Sold',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  loadAnalyticsData() {
    // כאן תטעין את הנתונים האנליטיים שלך, לדוגמה משירות API
  }

}



