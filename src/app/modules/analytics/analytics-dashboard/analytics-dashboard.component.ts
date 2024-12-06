import { Component } from '@angular/core';
import { ContactService } from 'src/app/core/services/contact.service';
import { ContactAnalyticsRequest } from '../../contact/ContactAnalyticsRequest';
import { JobService } from 'src/app/core/services/job.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent {
  // Sample data for Graph 1 (Lead Sources)
  leadSourcesData = {}
  leadSourcesOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Sample data for Graph 2 (Lead Generation)
  leadGenerationData: any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Contacts',
        data: [50, 30, 60, 40, 70, 90],
        borderColor: 'rgba(0, 123, 255, 1)',
        fill: false
      },
      {
        label: 'Jobs',
        data: [40, 20, 50, 30, 60, 80],
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false
      }
    ]
  };
  leadGenerationOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };


  // Sample data for Graph 3 (Workflow Profit)
  workflowProfitData: any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'IL South',
        data: [8000, 6000, 7500, 9000, 8500, 10000],
        borderColor: 'rgba(0, 123, 255, 1)',
        fill: false
      },
      {
        label: 'IL North',
        data: [4000, 3000, 3500, 4000, 3800, 4500],
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false
      }
    ]
  };
  workflowProfitOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Sample data for Graph 4 (Sales Rep Revenue)
  salesRepRevenueData: any = {
    labels: ['John', 'Jacob', 'James'],
    datasets: [
      {
        label: 'Contacts',
        data: [15000, 12000, 18000],
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        hoverBackgroundColor: 'rgba(0, 123, 255, 1)'
      },
      {
        label: 'Jobs',
        data: [12000, 10000, 14000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        hoverBackgroundColor: 'rgba(255, 99, 132, 1)'
      }
    ]
  };
  salesRepRevenueOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  // Sample data for Pie Chart 1 (Leads by Office Location)
  leadsByOfficeData: any = {
    labels: ['Office A', 'Office B', 'Office C', 'Office D', 'Office E'],
    datasets: [
      {
        data: [25, 20, 30, 15, 10],
        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
        hoverBackgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)']
      }
    ]
  };
  leadsByOfficeOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Sample data for Pie Chart 2 (Close Rate by Workflow)
  closeRateByWorkflowData: any = {
    labels: ['Workflow 1', 'Workflow 2', 'Workflow 3', 'Workflow 4', 'Workflow 5'],
    datasets: [
      {
        data: [70, 80, 60, 90, 50],
        backgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)']
      }
    ]
  };
  closeRateByWorkflowOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Sample data for Pie Chart 3 (Leads by Workflow)
  leadsByWorkflowData: any = {
    labels: ['Workflow 1', 'Workflow 2', 'Workflow 3', 'Workflow 4', 'Workflow 5'],
    datasets: [
      {
        data: [50, 40, 60, 30, 70],
        backgroundColor: ['rgba(0, 123, 255, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
        hoverBackgroundColor: ['rgba(0, 123, 255, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)']
      }
    ]
  };
  leadsByWorkflowOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  totalContacts: number = 0;
  newContacts: number = 0;
  JobsPercentageIncrease: any;
  ContactsPercentageIncrease: any;
  totalJobs: any;
  newJobs: any;
  selectedJobsTimeFrame: string= 'yearly'; // Default time frame
  selectedContactsTimeFrame: string= 'yearly'; // Default time frame
  jobsCompleted: any;

  constructor(private contactService: ContactService, private jobService: JobService) { }

  ngOnInit() {
    this.fetchContactAnalytics();
  }

  fetchContactAnalytics() {
    const ContactRequest: ContactAnalyticsRequest = {
      timeFrame: this.selectedContactsTimeFrame,
      sourceId: null
    };
    const JobRequest: ContactAnalyticsRequest = {
      timeFrame: this.selectedJobsTimeFrame,
      sourceId: null
    };

    forkJoin([
      this.contactService.getContactAnalytics(ContactRequest),
      this.jobService.getJobsAnalytics(JobRequest)
    ]).subscribe(([contactResponse, jobResponse]) => {
      this.totalContacts = contactResponse.payload.totalContacts;
      this.newContacts = contactResponse.payload.newContacts;
      this.ContactsPercentageIncrease = contactResponse.payload.percentageIncrease;
      this.JobsPercentageIncrease = jobResponse.percentageIncrease;
      this.totalJobs = jobResponse.totalJobs;
      this.newJobs = jobResponse.newJobs;
      this.jobsCompleted = jobResponse.jobsCompleted;
      this.updateLeadSourcesData(contactResponse.payload.sourceWiseResponse, jobResponse.sourceWiseResponse);
    });
  }

  updateContactsTimeFrame(timeFrame: string) {
    this.selectedContactsTimeFrame = timeFrame;
    this.fetchContactAnalytics(); // Fetch analytics with the new time frame
  }

  updateJobsTimeFrame(timeFrame: string) {
    this.selectedJobsTimeFrame = timeFrame;
    this.fetchContactAnalytics(); // Fetch analytics with the new time frame
  }


  updateLeadSourcesData(sourceWiseContactResponse: any[], sourceWiseJobResponse: any[]) {
    const labels = [
      ...new Set([...sourceWiseContactResponse.map(source => source.sourceName), ...sourceWiseJobResponse.map(source => source.sourceName)])
    ]; const contactData = sourceWiseContactResponse.map(source => source.count);
    const jobData = sourceWiseJobResponse.map(source => source.count);

    this.leadSourcesData = {
      labels: labels,
      datasets: [
        {
          label: 'Contacts',
          data: contactData,
          backgroundColor: 'rgba(0, 123, 255, 0.5)'
        },
        {
          label: 'Jobs',
          data: jobData,
          backgroundColor: 'rgba(255, 99, 132, 1)'
        }
        // You can add other datasets as needed
      ]
    };
  }
}
