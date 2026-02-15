/**
 * Entities Layer: HTTP Client
 * 
 * Low-level HTTP operations
 */

import { AppError } from '@/shared/lib/errors';

export interface HttpFetchOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * HTTP Fetch utility
 */
export async function httpFetch<T = unknown>({
  url,
  method = 'GET',
  headers = {},
  body,
  timeout = 30000,
}: HttpFetchOptions): Promise<HttpResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new AppError(
        `HTTP request failed: ${response.statusText}`,
        'HTTP_ERROR',
        response.status
      );
    }
    
    return {
      data: await response.json(),
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(
      `HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'HTTP_ERROR'
    );
  }
}
