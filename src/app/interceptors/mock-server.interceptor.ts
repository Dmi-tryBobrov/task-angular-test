import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { MockServerService } from '../services/mock-server.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockServerInterceptor implements HttpInterceptor {

  private mock = [
    {x: 5, y: 5}, {x: 10, y: 50}
  ]

  constructor(private mockServer: MockServerService ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Url:', request.url);

    if(request.url === '/api/curve' && request.method === 'POST'){

      const res = this.mockServer.calculateCurveCoord(request.body);
      return of(new HttpResponse({status: 200, body: res}));
  }

    return next.handle(request);

  }
}
