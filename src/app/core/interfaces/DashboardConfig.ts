import { AppSettings } from "./AppSettings";
import { DashboardComponentConfig } from "./DashboardComponentConfig";


export interface AppConfigurttion {
    appSettings : AppSettings
    dashboardComponentConfigs: DashboardComponentConfig[];
}

export interface DashboardConfig {
    dashboardComponentConfigs: DashboardComponentConfig[];
}
