import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoadingStateService } from './services/loading-state.service';
import { GraphDataStore } from './store/graph-data.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GraphDataStore]
})
export class AppComponent{
  public isLoggedIn$ = this.auth.isLoggedIn$;

  public loading$ = this.loadingState.loadState$;
  
  constructor(
    private auth: AuthService,
    private loadingState: LoadingStateService
  ) {}

}
