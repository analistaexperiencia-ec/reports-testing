/**
 * Service to handle Google Drive URL conversions and fetching
 */
export const DriveService = {
  /**
   * Converts a standard Google Drive sharing link to a direct download link
   */
  convertToDownloadUrl(url: string): string {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  },

  /**
   * Fetches data from a URL, handling potential CORS issues with a proxy if needed
   */
  async fetchWithCORS(url: string): Promise<Response> {
    // Using a public CORS proxy for static environments like GitHub Pages
    // In a real production app, you'd use your own backend proxy
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const finalUrl = `${proxyUrl}${encodeURIComponent(url)}`;
    
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error('Failed to fetch from Google Drive');
    return response;
  },

  /**
   * Gets a direct image URL from a Drive ID
   */
  getImageUrl(id: string): string {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
};
