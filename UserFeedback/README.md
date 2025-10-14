# User Feedback

This folder contains user feedback submitted through the PlantFinder application.

## Feedback Format

Each feedback submission is stored as a JSON file with the following structure:

```json
{
  "timestamp": "ISO 8601 timestamp",
  "feedbackType": "bug | feature | improvement | general",
  "subject": "Brief description",
  "message": "Detailed feedback message",
  "userAgent": "Browser user agent",
  "url": "Page URL where feedback was submitted"
}
```

## Privacy and Security

- No personally identifiable information (PII) is collected
- User agent and URL are included for context only
- All feedback is public in this repository

## Feedback Types

- **Bug Report** 🐛: Report issues or problems with the application
- **Feature Request** 💡: Suggest new features or functionality
- **Improvement** ✨: Suggest improvements to existing features
- **General Feedback** 💬: Any other comments or suggestions

## Processing Feedback

Feedback files are automatically created when users submit feedback through the application. The development team reviews these submissions regularly to improve the application.
