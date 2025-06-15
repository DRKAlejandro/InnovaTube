import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Youtube {
  private apiKey = 'AIzaSyAA0f3KOC0UUnM9bJEL4zmTghAXshahofM';
  private apiUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private http: HttpClient) { }

  searchVideos(query: string): Observable<any> {
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', '10')
      .set('q', query)
      .set('key', this.apiKey)
      .set('type', 'video');

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getTrendingVideos(): Observable<any> {
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', '10')
      .set('q', 'Angular')
      .set('key', this.apiKey)
      .set('type', 'video');

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

}
