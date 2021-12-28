import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {

  private _loadState = new BehaviorSubject<boolean>(false);
  public loadState$ = this._loadState.asObservable();

  constructor() { }

  showSpinner() {
    this._loadState.next(true);
  }

  hideSpinner() {
    this._loadState.next(false);
  }
}
