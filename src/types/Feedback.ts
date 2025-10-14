export interface UserFeedback {
  timestamp: string;
  feedbackType: 'bug' | 'feature' | 'improvement' | 'general';
  subject: string;
  message: string;
  userAgent?: string;
  url?: string;
}

export interface FeedbackFormData {
  feedbackType: UserFeedback['feedbackType'];
  subject: string;
  message: string;
}
