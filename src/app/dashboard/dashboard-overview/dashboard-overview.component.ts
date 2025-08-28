import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardOverviewDTO, MonthlyStatsDTO, AccountTypeStatsDTO, AlertDTO } from '../../common/models/dashboard.models';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css'],
  imports: [CommonModule, BaseChartDirective]
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  overview: DashboardOverviewDTO | null = null;
  monthlyStats: MonthlyStatsDTO[] = [];
  accountTypes: AccountTypeStatsDTO[] = [];
  operationTypes: any[] = [];
  alerts: AlertDTO[] = [];

  monthlyChartData: ChartData<'line'> | null = null;
  accountTypePieData: ChartData<'doughnut'> | null = null;
  operationsTypePieData: ChartData<'doughnut'> | null = null;

  loading = true;
  error: string | null = null;

  // Chart options
  monthlyChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return `Mois: ${context[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            if (context.datasetIndex === 0) {
              return `Nouveaux clients: ${value}`;
            } else if (context.datasetIndex === 1) {
              return `Flux net: ${this.formatCurrency(value)}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          callback: function (value, index, ticks) {
            const monthValue = this.getLabelForValue(Number(value));
            return monthValue ? monthValue.substring(5) : ''; // Show only MM-DD part
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          callback: function (value) {
            return Number(value).toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const data = this.accountTypes[context.dataIndex];
            return [
              `${this.getAccountTypeLabel(data.accountType)}`,
              `Comptes: ${data.count}`,
              `Solde: ${this.formatCurrency(data.totalBalance)}`,
              `Part: ${data.percentage}%`
            ];
          }
        }
      }
    },
    cutout: '60%'
  };

  operationsPieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const data = this.operationTypes[context.dataIndex];
            return [
              `${this.getAccountTypeLabel(data.type)}`,
              `Montant: ${this.formatCurrency(data.total)}`,
              `Part: ${data.percentage}%`
            ];
          }
        }
      }
    },
    cutout: '60%'
  };


  constructor(private dashboardService: DashboardService) { }

  get hasMonthlyData(): boolean {
    return this.monthlyStats && this.monthlyStats.some(d =>
      d.newCustomers > 0 || d.netFlow !== 0 || d.transactionCount > 0
    );
  }

  get hasAccountTypeData(): boolean {
    return this.accountTypes && this.accountTypes.length > 0;
  }

  get hasOperationsTypeData(): boolean {
    return this.monthlyStats && this.monthlyStats.length > 0;
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    combineLatest([
      this.dashboardService.getOverview(),
      this.dashboardService.getMonthlyStats(12),
      this.dashboardService.getAccountTypeDistribution(),
      this.dashboardService.getSystemAlerts()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([overview, monthlyStats, accountTypes, alerts]) => {
        this.overview = overview;
        this.monthlyStats = monthlyStats;
        this.accountTypes = accountTypes;
        this.alerts = alerts; //.filter((alert: AlertDTO) => alert.severity === 'HIGH');
        this.loading = false;
        console.log('Dashboard data loaded successfully');

        this.monthlyChartData = {
          labels: this.monthlyStats.map(stat => stat.month),
          datasets: [
            {
              type: 'line' as const,
              label: 'Nouveaux Clients',
              data: this.monthlyStats.map(stat => stat.newCustomers),
              borderColor: '#3B82F6',
              backgroundColor: '#3B82F6',
              tension: 0.4,
              fill: false,
              yAxisID: 'y'
            },
            {
              type: 'line' as const,
              label: 'Nouveaux Comptes',
              data: this.monthlyStats.map(stat => stat.newAccounts),
              borderColor: '#6366F1',
              backgroundColor: '#6366F1',
              tension: 0.4,
              fill: false,
              yAxisID: 'y'
            },
            {
              type: 'line' as const,
              label: 'Dépôts',
              data: this.monthlyStats.map(stat => stat.totalDeposits),
              borderColor: '#10B981',
              backgroundColor: '#10B981',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1'
            },
            {
              type: 'line' as const,
              label: 'Retraits',
              data: this.monthlyStats.map(stat => stat.totalWithdrawals),
              borderColor: '#F59E0B',
              backgroundColor: '#F59E0B',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1'
            },
            {
              type: 'line' as const,
              label: 'Transactions',
              data: this.monthlyStats.map(stat => stat.transactionCount),
              borderColor: '#8B5CF6',
              backgroundColor: '#8B5CF6',
              tension: 0.4,
              fill: false,
              yAxisID: 'y'
            },
            {
              type: 'line' as const,
              label: 'Flux Net',
              data: this.monthlyStats.map(stat => stat.netFlow),
              borderColor: '#EF4444',
              backgroundColor: '#EF4444',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1'
            }
          ]
        };

        this.accountTypePieData = {
          labels: this.accountTypes.map(at => this.getAccountTypeLabel(at.accountType)),
          datasets: [
            {
              data: this.accountTypes.map(at => at.percentage),
              backgroundColor: this.accountTypes.map((_, index) => this.getAccountTypeColor(index)),
              hoverOffset: 30
            }
          ]
        };
        // Extract operation types data from monthlyStats
        const totalDeposits = this.monthlyStats.reduce((sum, stat) => sum + stat.totalDeposits, 0);
        const totalWithdrawals = this.monthlyStats.reduce((sum, stat) => sum + stat.totalWithdrawals, 0);
        const total = totalDeposits + totalWithdrawals;

        this.operationTypes = [
          {
            type: 'deposit',
            label: 'Dépôt',
            total: totalDeposits,
            percentage: total > 0 ? ((totalDeposits / total) * 100).toFixed(2) : '0'
          },
          {
            type: 'withdrawal',
            label: 'Retrait',
            total: totalWithdrawals,
            percentage: total > 0 ? ((totalWithdrawals / total) * 100).toFixed(2) : '0'
          }
        ];

        this.operationsTypePieData = {
          labels: this.operationTypes.map(op => op.label),
          datasets: [
            {
              data: this.operationTypes.map(op => op.total),
              backgroundColor: this.operationTypes.map((_, index) => this.getAccountTypeColor(index)),
              hoverOffset: 30
            }
          ]
        };
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error('Dashboard loading error:', err);
      }
    });
  }


  setupAutoRefresh(): void {
    setInterval(() => {
      this.loadDashboardData();
    }, 300000);
  }

  refreshDashboard(): void {
    this.dashboardService.refreshDashboard();
    this.loadDashboardData();
  }

  // Méthodes utilitaires pour le template
  formatCurrency(amount: any): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  getAccountTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'SavingAccount': 'Comptes Épargne',
      'CourantAccount': 'Comptes Courants',
    };
    return labels[type] || type;
  }

  getAccountTypeColor(index: number): string {
    const colors = [
      '#6366F1', // Indigo
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Violet
      '#06B6D4', // Cyan
    ];
    return colors[index % colors.length];
  }
}
