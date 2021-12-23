import { Component, OnInit } from '@angular/core';
import { MenuItem } from './menu-item';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  public menuItems: MenuItem[] = [
    {
      label: 'Log In',
      icon: 'login',
      link: '/login',
    },
    {
      label: 'Log Out',
      icon: 'logout ',
      link: '/login',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  navigate(link: string | undefined): void {
    if (!link) {
      return;
    }
    console.log(link);
  }
}
