import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface ResourceTag {
  tagId: string;
  name: string;
}

export interface TaggedResource {
  resourceId: string;
  name: string;
  tags: ResourceTag[]
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private http: HttpClient) {
  }

  queryResources(): Observable<TaggedResource[]> {
    return this.http.get<TaggedResource[]>('/api/resources');
  }

  saveTaggedResource(taggedResource: TaggedResource): Observable<TaggedResource> {
    return this.http.put(`/api/resources/${taggedResource.resourceId}`, {
      name: taggedResource.name,
      tags: taggedResource.tags
    }).pipe(map(() => taggedResource));
  }
}
