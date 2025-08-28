import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { 
  DashboardOverviewDTO, 
  MonthlyStatsDTO, 
  AccountTypeStatsDTO,
  AlertDTO,
  RiskAnalysisDTO,
  PerformanceMetricsDTO 
} from '../common/models/dashboard.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = environment.backendHost+'/dashboard';
  private refreshSubject = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  getOverview(): Observable<DashboardOverviewDTO> {
    return this.http.get<DashboardOverviewDTO>(`${this.apiUrl}/overview`)
      .pipe(shareReplay(1));
  }

  getMonthlyStats(months: number = 12): Observable<MonthlyStatsDTO[]> {
    return this.http.get<MonthlyStatsDTO[]>(`${this.apiUrl}/monthly-stats/${months}`, {
      params: { months: months.toString() }
    }).pipe(shareReplay(1));
  }

  getAccountTypeDistribution(): Observable<AccountTypeStatsDTO[]> {
    return this.http.get<AccountTypeStatsDTO[]>(`${this.apiUrl}/account-types`)
      .pipe(shareReplay(1));
  }

  getSystemAlerts(): Observable<AlertDTO[]> {
    return this.http.get<AlertDTO[]>(`${this.apiUrl}/alerts`)
      .pipe(shareReplay(1));
  }

  getRiskAnalysis(): Observable<RiskAnalysisDTO> {
    return this.http.get<RiskAnalysisDTO>(`${this.apiUrl}/risk-analysis`)
      .pipe(shareReplay(1));
  }

  getPerformanceMetrics(): Observable<PerformanceMetricsDTO> {
    return this.http.get<PerformanceMetricsDTO>(`${this.apiUrl}/performance`)
      .pipe(shareReplay(1));
  }

  getManagerDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/manager-view`)
      .pipe(shareReplay(1));
  }

  refreshDashboard(): void {
    this.refreshSubject.next();
  }
}