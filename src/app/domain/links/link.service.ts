import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Link} from "./state/link.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient) {
  }

  loadLinks(): Observable<Link[]> {
    return this.http.get<Link[]>('/api/links');
  }

  saveLink(link: Link): Observable<Link> {
    const payload = {
      name: link.name,
      link: link.link,
      tags: link.tags
    };
    return this.http.put(`/api/links/${link.linkId}`, payload)
      .pipe(map(() => link));
  }

  deleteLink(linkId: string): Observable<string> {
    return this.http.delete(`/api/links/${linkId}`)
      .pipe(map(() => linkId));
  }
}
