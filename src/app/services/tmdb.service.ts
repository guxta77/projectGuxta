import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private backendUrl = environment.tmdbBackendUrl;

  constructor(private http: HttpClient) {}

  searchMulti(query: string): Observable<{ results: any[] }> {
    return this.http.get<{ results: any[] }>(`${this.backendUrl}/multi`, {
      params: { query }
    });
  }

  searchMovies(query: string): Observable<{ results: any[] }> {
    return this.http.get<{ results: any[] }>(`${this.backendUrl}/movies`, {
      params: { query }
    });
  }

  searchSeries(query: string): Observable<{ results: any[] }> {
    return this.http.get<{ results: any[] }>(`${this.backendUrl}/series`, {
      params: { query }
    });
  }
}
