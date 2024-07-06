import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {linksFeature, LinkState} from "../state/link.reducer";
import {Observable} from "rxjs";
import {Link} from "../state/link.model";
import {LinkPageActions} from "../state/link.actions";
import {AsyncPipe} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-list-links',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet
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

  addLink() {
    this.store.dispatch(LinkPageActions.addLink());
  }

  editLink(link: Link) {
    this.store.dispatch(LinkPageActions.editLink({link}));
  }

  deleteLink(link: Link) {
    this.store.dispatch(LinkPageActions.deleteLink({linkId: link.linkId}));
  }
}
