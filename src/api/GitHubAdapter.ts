import { UserFeedback } from '../types/Feedback';
import { ImageRequest } from '../types/ImageRequest';

/**
 * GitHub Adapter for submitting user feedback and image requests
 * Stores feedback as JSON files in the UserFeedback folder
 * Stores image requests as JSON files in the ImageRequests folder
 */
export class GitHubAdapter {
  private readonly token: string;
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;

  constructor() {
    // Get GitHub token from environment variable
    // In production, this should be set in GitHub Secrets (embedded at build time)
    this.token = import.meta.env.VITE_GITHUB_TOKEN || '';
    this.owner = 'ampautsc';
    this.repo = 'PlantFinder';
    this.branch = 'main';
  }

  /**
   * Submit feedback to the GitHub repository
   * Creates a new file in the UserFeedback folder
   */
  async submitFeedback(feedback: UserFeedback): Promise<void> {
    if (!this.token) {
      throw new Error('GitHub token is not configured. Please set VITE_GITHUB_TOKEN environment variable.');
    }

    // Generate a unique filename based on timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `feedback-${timestamp}.json`;
    const path = `UserFeedback/${filename}`;

    // Prepare the content
    const content = JSON.stringify(feedback, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Prepare commit message
    const commitMessage = `Add user feedback: ${feedback.subject}`;

    // GitHub API endpoint
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedContent,
          branch: this.branch,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to submit feedback: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Submit an image request to the GitHub repository
   * Creates a new file in the ImageRequests folder
   */
  async submitImageRequest(imageRequest: ImageRequest): Promise<void> {
    if (!this.token) {
      throw new Error('GitHub token is not configured. Please set VITE_GITHUB_TOKEN environment variable.');
    }

    // Generate a unique filename based on timestamp and species
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `image-request-${imageRequest.speciesId}-${timestamp}.json`;
    const path = `ImageRequests/${filename}`;

    // Prepare the content
    const content = JSON.stringify(imageRequest, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Prepare commit message
    const commitMessage = `Add image request: ${imageRequest.commonName}`;

    // GitHub API endpoint
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedContent,
          branch: this.branch,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to submit image request: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return;
    } catch (error) {
      console.error('Error submitting image request:', error);
      throw error;
    }
  }

  /**
   * Check if the adapter is properly configured
   */
  isConfigured(): boolean {
    return !!this.token;
  }
}
