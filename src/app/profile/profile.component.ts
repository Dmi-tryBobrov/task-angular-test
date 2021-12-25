import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userLogin?: string;

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.userLogin = this.auth.login;
  }

}
