import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ListTagsComponent} from "./list-tags/list-tags.component";

const routes: Routes = [
  {path: '', component: ListTagsComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TagsRoutingModule {
}
