import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DashboardConfig } from '../interfaces/DashboardConfig';
import { AppSettings } from '../interfaces/AppSettings';
import { DashboardComponentConfig } from '../interfaces/DashboardComponentConfig';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private defaultDashboardConfig: DashboardConfig = {
    dashboardComponentConfigs: [
      { componentName: 'Tasks', isVisible: true, order: 1 },
      { componentName: 'Jobs', isVisible: true, order: 2 },
      { componentName: 'Contacts', isVisible: true, order: 3 },
      { componentName: 'Estimates', isVisible: false, order: 4 },
      { componentName: 'Logbook', isVisible: false, order: 5 }
    ]
  };

  private defaultAppSettings: AppSettings = {
    language: 'en',
    pageSize: 10
  };

  private dashboardConfigs: DashboardComponentConfig[] = [];
  private appSettings: AppSettings = this.defaultAppSettings;

  constructor(private http: HttpClient) { }

  private async loadConfigurations(): Promise<void> {
    try {
      const response = await this.http.get<any>(AppConfig.AppConfigurations.GetAll).toPromise();
      const { dashboardConfigurations, appConfigurations } = response.data;
      let apiConfigs = dashboardConfigurations || [];
      if (apiConfigs.length === 0) {
        this.dashboardConfigs = this.defaultDashboardConfig.dashboardComponentConfigs.map(config => ({
          ...config
        }));
      } else {
        const defaultComponents = this.defaultDashboardConfig.dashboardComponentConfigs;
        const defaultConfigMap = new Map(defaultComponents.map(config => [config.componentName, { ...config }]));
        apiConfigs.forEach(config => {
          if (defaultConfigMap.has(config.componentName)) {
            defaultConfigMap.set(config.componentName, { ...defaultConfigMap.get(config.componentName), ...config });
          }
        });

        this.dashboardConfigs = Array.from(defaultConfigMap.values());
        this.dashboardConfigs.forEach(config => {
          if (!apiConfigs.some(apiConfig => apiConfig.componentName === config.componentName)) {
            config.isVisible = false;
          }
        });
      }
      this.appSettings = appConfigurations ? appConfigurations : this.defaultAppSettings;
    } catch (error) {
      this.dashboardConfigs = this.defaultDashboardConfig.dashboardComponentConfigs;
      this.appSettings = this.defaultAppSettings;
    }
  }

  async getDashboardConfigs(): Promise<DashboardComponentConfig[]> {
    await this.loadConfigurations();
    return this.dashboardConfigs
      .sort((a, b) => a.order - b.order);
  }

  async getAppSettings(): Promise<AppSettings> {
    await this.loadConfigurations();
    return this.appSettings;
  }

  async updateDashboardConfigs(configs: DashboardComponentConfig[]): Promise<any> {
    await this.http.post<any>(AppConfig.AppConfigurations.AddOrUpdateDashboardConfig, configs).toPromise();
  }

  async updateAppSettings(language: string, pageSize: number): Promise<any> {
    await this.http.post<any>(AppConfig.AppConfigurations.AddOrUpdateAppConfig, { language, pageSize }).toPromise();
  }

  async deleteAppConfig(id: number): Promise<any> {
    await this.http.delete<any>(AppConfig.AppConfigurations.DeleteAppConfig(id)).toPromise();
  }

  async deleteDashboardConfig(id: number): Promise<any> {
    await this.http.delete<any>(AppConfig.AppConfigurations.DeleteDashboardConfig(id)).toPromise();
  }
}
