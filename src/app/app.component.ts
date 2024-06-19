import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {RouterModule} from "@angular/router";
import {NavbarComponent} from "./core/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }
}
