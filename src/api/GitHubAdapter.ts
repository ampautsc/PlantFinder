import { UserFeedback } from '../types/Feedback';
import { PlantImageSubmission } from '../types/PlantImage';

/**
 * GitHub Adapter for submitting user feedback and plant images
 * Stores feedback as JSON files in the UserFeedback folder
 * Stores plant images in species-specific directories in public/images/plants
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
   * Submit plant image to the GitHub repository
   * Creates a new image file in the appropriate plant directory
   */
  async submitPlantImage(submission: PlantImageSubmission): Promise<void> {
    if (!this.token) {
      throw new Error('GitHub token is not configured. Please set VITE_GITHUB_TOKEN environment variable.');
    }

    // Generate a unique filename based on timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = submission.fileName ? submission.fileName.split('.').pop() : 'jpg';
    const filename = `${submission.plantId}-${timestamp}.${fileExtension}`;
    const path = `public/images/plants/${submission.plantId}/${filename}`;

    let encodedContent: string;
    
    if (submission.imageSource === 'file' && submission.imageData) {
      // For file uploads, the data is already base64 encoded
      encodedContent = submission.imageData.split(',')[1] || submission.imageData;
    } else if (submission.imageSource === 'url' && submission.imageUrl) {
      // For URL uploads, fetch the image and encode it
      try {
        const response = await fetch(submission.imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image from URL: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        const base64 = await this.blobToBase64(blob);
        encodedContent = base64.split(',')[1] || base64;
      } catch (error) {
        throw new Error(`Failed to fetch image from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      throw new Error('Invalid image submission: must provide either image file or URL');
    }

    // Prepare commit message
    const commitMessage = `Add plant image: ${submission.plantCommonName} (${submission.plantScientificName})`;

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
        throw new Error(`Failed to submit plant image: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return;
    } catch (error) {
      console.error('Error submitting plant image:', error);
      throw error;
    }
  }

  /**
   * Convert a Blob to base64 string
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Check if the adapter is properly configured
   */
  isConfigured(): boolean {
    return !!this.token;
  }
}
