import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPoint} from '../interfaces/point-interface';
import { IUserInput } from '../interfaces/user-input';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerConnectService {

  private _genCurveApiUrl = '/api/curve';
  private _httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) { }

  requestCurve(input: IUserInput): Observable<IPoint[]>{
    return this.http.post<IPoint[]>(this._genCurveApiUrl, input, this._httpOptions);
  }


}
