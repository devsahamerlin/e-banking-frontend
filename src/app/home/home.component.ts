import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  // Chart references
  private revenueChart: Chart | null = null;
  private expenseChart: Chart | null = null;
  private portfolioChart: Chart | null = null;
  
  // Chart data properties
  revenueChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  revenueChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          callback: function(tickValue, index, ticks) {
            const value = typeof tickValue === 'number' ? tickValue : 0;
            return '$' + (value / 1000) + 'k';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  expenseChartData: ChartData<'doughnut'> = {
    labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'],
    datasets: [{
      data: [30, 20, 25, 15, 10],
      backgroundColor: [
        'rgb(239, 68, 68)',
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(139, 92, 246)'
      ],
      borderWidth: 0
    }]
  };

  expenseChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  portfolioChartData: ChartData<'bar'> = {
    labels: ['Stocks', 'Bonds', 'Real Estate', 'Crypto', 'Cash'],
    datasets: [{
      label: 'Portfolio Value',
      data: [45000, 25000, 30000, 8000, 12000],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(139, 92, 246)',
        'rgb(107, 114, 128)'
      ],
      borderWidth: 1
    }]
  };

  portfolioChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          callback: function(tickValue, index, ticks) {
            const value = typeof tickValue === 'number' ? tickValue : 0;
            return '$' + (value / 1000) + 'k';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
 accountCards = [
    {
      title: 'Total Balance',
      amount: '$24,847.92',
      change: '+12.5%',
      changeClass: 'text-green-600 dark:text-green-400',
      trend: 'up',
      icon: '<svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Monthly Income',
      amount: '$8,420.00',
      change: '+8.2%',
      changeClass: 'text-green-600 dark:text-green-400',
      trend: 'up',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/></svg>',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Monthly Expenses',
      amount: '$4,247.85',
      change: '-15.3%',
      changeClass: 'text-green-600 dark:text-green-400',
      trend: 'down',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>',
      iconBg: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400'
    }
  ];

  recentTransactions = [
    {
      description: 'Amazon Purchase',
      date: 'Dec 28',
      category: 'Shopping',
      amount: '-$89.99',
      status: 'Completed',
      amountClass: 'text-red-600 dark:text-red-400',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/></svg>',
      iconBg: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      description: 'Salary Deposit',
      date: 'Dec 25',
      category: 'Income',
      amount: '+$4,200.00',
      status: 'Completed',
      amountClass: 'text-green-600 dark:text-green-400',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      description: 'Netflix Subscription',
      date: 'Dec 24',
      category: 'Entertainment',
      amount: '-$15.99',
      status: 'Completed',
      amountClass: 'text-red-600 dark:text-red-400',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H4v4h9v-4z" clip-rule="evenodd"/></svg>',
      iconBg: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      description: 'Gas Station',
      date: 'Dec 23',
      category: 'Transportation',
      amount: '-$52.40',
      status: 'Completed',
      amountClass: 'text-red-600 dark:text-red-400',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H8zm0 2h8v12H8V4z" clip-rule="evenodd"/></svg>',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private initializeCharts(): void {
    try {
      this.initializeRevenueChart();
      this.initializeExpenseChart();
      this.initializePortfolioChart();
    } catch (error) {
      console.error('Error initializing charts:', error);
      this.handleChartError();
    }
  }

  private initializeRevenueChart(): void {
    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (canvas && canvas.getContext) {
      try {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: this.revenueChartData,
            options: this.revenueChartOptions
          });
        }
      } catch (error) {
        console.error('Error creating revenue chart:', error);
        this.showChartFallback('revenueChart');
      }
    }
  }

  private initializeExpenseChart(): void {
    const canvas = document.getElementById('expenseChart') as HTMLCanvasElement;
    if (canvas && canvas.getContext) {
      try {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: this.expenseChartData,
            options: this.expenseChartOptions
          });
        }
      } catch (error) {
        console.error('Error creating expense chart:', error);
        this.showChartFallback('expenseChart');
      }
    }
  }

  private initializePortfolioChart(): void {
    const canvas = document.getElementById('portfolioChart') as HTMLCanvasElement;
    if (canvas && canvas.getContext) {
      try {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          this.portfolioChart = new Chart(ctx, {
            type: 'bar',
            data: this.portfolioChartData,
            options: this.portfolioChartOptions
          });
        }
      } catch (error) {
        console.error('Error creating portfolio chart:', error);
        this.showChartFallback('portfolioChart');
      }
    }
  }

  private destroyCharts(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
      this.revenueChart = null;
    }
    if (this.expenseChart) {
      this.expenseChart.destroy();
      this.expenseChart = null;
    }
    if (this.portfolioChart) {
      this.portfolioChart.destroy();
      this.portfolioChart = null;
    }
  }

  private handleChartError(): void {
    console.warn('Canvas not supported or Chart.js error occurred. Showing fallback content.');
  }

  private showChartFallback(chartId: string): void {
    const canvas = document.getElementById(chartId);
    if (canvas && canvas.parentElement) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg';
      fallbackDiv.innerHTML = `
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400">Chart unavailable</p>
          <p class="text-sm text-gray-400 dark:text-gray-500">Canvas not supported</p>
        </div>
      `;
      canvas.parentElement.replaceChild(fallbackDiv, canvas);
    }
  }


  refreshChartData(): void {
    setTimeout(() => {
      if (this.revenueChart) {
        this.revenueChart.data = this.revenueChartData;
        this.revenueChart.update();
      }
      if (this.expenseChart) {
        this.expenseChart.data = this.expenseChartData;
        this.expenseChart.update();
      }
      if (this.portfolioChart) {
        this.portfolioChart.data = this.portfolioChartData;
        this.portfolioChart.update();
      }
    }, 100);
  }


  onChartPeriodChange(period: string): void {
    console.log('Chart period changed to:', period);
    this.refreshChartData();
  }
}
