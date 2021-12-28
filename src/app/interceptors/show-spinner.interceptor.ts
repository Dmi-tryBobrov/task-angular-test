import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingStateService } from '../services/loading-state.service';

@Injectable()
export class ShowSpinnerInterceptor implements HttpInterceptor {

  private _totalRequests = 0;
  private _completedRequests = 0;

  constructor(
    private loadingState: LoadingStateService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this._totalRequests++;
    this.loadingState.showSpinner();
    
    return next.handle(request).pipe(
      finalize(() => {
        
        this._completedRequests++;
        if(this._completedRequests === this._totalRequests){
            this._completedRequests = 0;
            this._totalRequests = 0;
            this.loadingState.hideSpinner();
        }
        
      })
    );  
  }
}
