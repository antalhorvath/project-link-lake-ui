import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

interface MenuItem {
  name: string;
  link: string;
}

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './menu-items.component.html',
})
export class MenuItemsComponent {

  menuItems: MenuItem[] = [
    {
      name: 'Home',
      link: '/home'
    },
    {
      name: 'Links',
      link: '/links'
    },
    {
      name: 'Tags',
      link: '/tags'
    }
  ];

  activeMenuItem: MenuItem = this.menuItems[0];

  navigate(meniItem: MenuItem) {
    this.activeMenuItem = meniItem;
  }
}
