import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Youtube {
  private apiKey = 'AIzaSyAA0f3KOC0UUnM9bJEL4zmTghAXshahofM';
  private apiUrl = 'https://www.googleapis.com/youtube/v3';
  private nextPageTokens: { [key: string]: string } = {};

  constructor(private http: HttpClient) { }

  searchVideos(query: string, loadMore: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', '12')
      .set('q', query)
      .set('key', this.apiKey)
      .set('type', 'video');

    if (loadMore && this.nextPageTokens[query]) {
      params = params.set('pageToken', this.nextPageTokens[query]);
    }

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getTrendingVideos(loadMore: boolean = false): Observable<any> {
    const queryKey = 'trending';
    let params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', '12')
      .set('q', 'music|gaming|news|sports')
      .set('key', this.apiKey)
      .set('type', 'video')
      .set('order', 'viewCount');

    if (loadMore && this.nextPageTokens[queryKey]) {
      params = params.set('pageToken', this.nextPageTokens[queryKey]);
    }

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  setNextPageToken(query: string, token: string) {
    this.nextPageTokens[query] = token;
  }

  clearNextPageToken(query: string) {
    delete this.nextPageTokens[query];
  }
}
