import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {linksFeature, LinkState} from "../state/link.reducer";
import {Observable} from "rxjs";
import {Link} from "../state/link.model";
import {LinkPageActions} from "../state/link.actions";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-list-links',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './list-links.component.html'
})
export class ListLinksComponent implements OnInit {

  links$: Observable<Link[]> = this.store.select(linksFeature.selectAll);

  constructor(private store: Store<LinkState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(LinkPageActions.loadLinks());
  }

}
