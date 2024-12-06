import { Component } from '@angular/core';

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrls: ['./help-and-support.component.css']
})
export class HelpAndSupportComponent {
  faqs: any[] = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link...'
    },
    {
      question: 'How can I update my profile information?',
      answer: 'You can update your profile information by navigating to...'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards such as Visa, MasterCard, and American Express.'
    },
    {
      question: 'How long does it take to receive a response to a support request?',
      answer: 'Our support team typically responds within 24 hours on business days.'
    },
    // Add more FAQ items as needed
  ];
}
