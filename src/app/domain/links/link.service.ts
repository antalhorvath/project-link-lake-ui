import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Link} from "./state/link.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient) { }

  loadLinks(): Observable<Link[]> {
    return this.http.get<Link[]>('/api/links');
  }
}
