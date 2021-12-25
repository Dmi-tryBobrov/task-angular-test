import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MenuItem } from './menu-item';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  public menuItems: MenuItem[] = [
    {
      label: 'Log Out',
      icon: 'logout ',
      link: '/login',
    },
  ];

  constructor(
    private router: Router,
    private auth: AuthService
    ) {}

  ngOnInit(): void {}

  navigate(link: string | undefined): void {
    if (!link) {
      return;
    }
    console.log(link);
    this.auth.logOut();
    this.router.navigate(['/login']);
  }
}
