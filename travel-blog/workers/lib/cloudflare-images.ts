/**
 * Cloudflare Images Upload Helper
 * Feature: 004-modular-blog-posts
 * 
 * Handles photo uploads to Cloudflare Images with automatic optimization
 */

export interface CloudflareImagesConfig {
  accountId: string;        // For API calls
  accountHash: string;      // For delivery URLs (imagedelivery.net)
  apiToken: string;
}

export interface ImageUploadResult {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];  // Full URLs to image variants
}

export interface ImageVariantUrls {
  public: string;      // Default public variant
  [key: string]: string;  // Other custom variants
}

export class CloudflareImagesClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(private config: CloudflareImagesConfig) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`;
    this.headers = {
      'Authorization': `Bearer ${config.apiToken}`,
    };
  }

  /**
   * Upload an image to Cloudflare Images
   */
  async upload(file: File | Blob, metadata?: Record<string, string>): Promise<ImageUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[CLOUDFLARE IMAGES] Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      throw new Error(`Cloudflare Images upload failed (${response.status}): ${error}`);
    }

    const data = await response.json() as any;
    
    if (!data.success) {
      console.error('[CLOUDFLARE IMAGES] API returned error:', data);
      throw new Error(`Cloudflare Images upload failed: ${data.errors?.[0]?.message || 'Unknown error'}`);
    }

    return data.result;
  }

  /**
   * Upload from URL
   */
  async uploadFromUrl(url: string, metadata?: Record<string, string>): Promise<ImageUploadResult> {
    const body: any = { url };
    
    if (metadata) {
      body.metadata = metadata;
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images URL upload failed: ${error}`);
    }

    const data = await response.json() as any;
    
    if (!data.success) {
      throw new Error(`Cloudflare Images URL upload failed: ${data.errors?.[0]?.message || 'Unknown error'}`);
    }

    return data.result;
  }

  /**
   * Get image variant URLs from upload result
   * The API returns full URLs for all configured variants
   */
  getVariantUrlsFromResult(uploadResult: ImageUploadResult): ImageVariantUrls {
    // uploadResult.variants is an array of full URLs
    // e.g., ["https://imagedelivery.net/hash/id/public", ...]
    const urls: ImageVariantUrls = { public: '' };
    
    for (const variantUrl of uploadResult.variants) {
      // Extract variant name from URL (last segment)
      const parts = variantUrl.split('/');
      const variantName = parts[parts.length - 1];
      urls[variantName] = variantUrl;
    }
    
    // Ensure public variant exists
    if (!urls.public && uploadResult.variants.length > 0) {
      urls.public = uploadResult.variants[0];
    }
    
    return urls;
  }

  /**
   * Get image variant URLs (legacy method - constructs URLs)
   * Uses the account hash for delivery URLs
   */
  getVariantUrls(imageId: string): ImageVariantUrls {
    // Use the delivery account hash, not the API account ID
    const baseDeliveryUrl = `https://imagedelivery.net/${this.config.accountHash}/${imageId}`;

    return {
      public: `${baseDeliveryUrl}/public`,
    };
  }

  /**
   * Delete an image
   */
  async delete(imageId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/${imageId}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      console.error('Failed to delete image:', await response.text());
      return false;
    }

    const data = await response.json() as any;
    return data.success;
  }

  /**
   * Get image details
   */
  async getDetails(imageId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${imageId}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get image details: ${await response.text()}`);
    }

    const data = await response.json() as any;
    return data.result;
  }

  /**
   * Validate file type and size
   */
  validateImage(file: File | Blob, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];
    if (file instanceof File && !validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Supported: JPEG, PNG, WebP, GIF, HEIC' };
    }

    return { valid: true };
  }
}

/**
 * Create Cloudflare Images client
 */
export function createCloudflareImagesClient(config: CloudflareImagesConfig): CloudflareImagesClient {
  return new CloudflareImagesClient(config);
}

/**
 * Get default image variant configuration
 */
export const IMAGE_VARIANTS = {
  thumbnail: { width: 200, height: 200, fit: 'cover' },
  mobile: { width: 800, height: 600, fit: 'scale-down' },
  desktop: { width: 1920, height: 1080, fit: 'scale-down' },
} as const;
