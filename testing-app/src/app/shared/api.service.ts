import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedResult, QueueTicket, Visitor, VisitorQuery } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ---- Queue ----
  takeQueueNumber(): Observable<QueueTicket> {
    return this.http.post<QueueTicket>(`${this.base}/queue`, {});
  }

  getTodayQueue(status?: 'waiting' | 'registered'): Observable<QueueTicket[]> {
    let params = new HttpParams();
    if (status) { params = params.set('status', status); }
    return this.http.get<QueueTicket[]>(`${this.base}/queue`, { params });
  }

  // ---- Visitors ----
  createVisitor(visitor: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(`${this.base}/visitors`, visitor);
  }

  getVisitors(query: VisitorQuery): Observable<PagedResult<Visitor>> {
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      const value = query[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PagedResult<Visitor>>(`${this.base}/visitors`, { params });
  }

  deleteVisitor(id: string): Observable<any> {
    return this.http.delete(`${this.base}/visitors/${id}`);
  }
}
