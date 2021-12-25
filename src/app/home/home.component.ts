import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public userLogin?: string;

  public userInputs!: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router, 
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userLogin = this.auth.login;
    this.userInputs = this.fb.group({
      minValue: ['1', [Validators.required]],
      maxValue: ['2', [Validators.required]],
      maxHeight: ['3', [Validators.required]],
      numberOfPoints: ['4', [Validators.required]]
    }
    );
  }



}
