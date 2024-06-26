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

  constructor(private store: Store<LinkState>, private router: Router) {
  }

  ngOnInit(): void {
    this.store.dispatch(LinkPageActions.loadLinks());
  }

  navigateToAddNew() {
    this.router.navigate(['/links/add']).then(asd => console.log(asd))
  }
}
