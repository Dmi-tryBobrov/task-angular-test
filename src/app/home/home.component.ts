import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerConnectService } from '../services/server-connect.service';
import { RenderGraphService } from '../services/render-graph.service';
import { IUserInput } from '../interfaces/user-input';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { GraphDataStore } from '../store/graph-data.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public userInputs!: FormGroup;

  private _windowResize$!: Observable<Event>;
  private _windowResizeSubscription$!: Subscription;

  //global state
  private _graphData$ = this.graphDataStore.graphData$;
  private _graphDataSubscribtion$!: Subscription;
  

  constructor(
    private fb: FormBuilder,
    private serverConnect: ServerConnectService,
    private renderGraph: RenderGraphService,
    private graphDataStore: GraphDataStore
  ) { }

  ngOnInit(): void {
    this.userInputs = this.fb.group({
      minValue: ['1', [Validators.required]],
      maxValue: ['2', [Validators.required]],
      maxHeight: ['3', [Validators.required]],
      numberOfPoints: ['4', [Validators.required]]
    }
    );

    let bgdCanvas: HTMLCanvasElement = document.querySelector('#bgd-layer') as HTMLCanvasElement;
    this.renderGraph.registerCanvas(bgdCanvas, 'bgd-layer');

    let curveCanvas: HTMLCanvasElement = document.querySelector('#curve-layer') as HTMLCanvasElement;
    this.renderGraph.registerCanvas(curveCanvas, 'curve-layer');

    this.renderGraph.renderBackgroundGrid('bgd-layer');

    this._graphDataSubscribtion$ = this._graphData$
    .subscribe(data => {
      this.renderGraph.renderCurve('curve-layer', data.input, data.points);
      console.log('inside it!');
    });

    //TODO: fix resize issue
    this._windowResize$ = fromEvent(window, 'resize');
    this._windowResizeSubscription$ = this._windowResize$
    .subscribe(e => {
      this.renderGraph.resetGraph();
      this.renderGraph.renderBackgroundGrid('bgd-layer');
      
    });
  }

  ngOnDestroy(): void {
    this._windowResizeSubscription$.unsubscribe();
    this._graphDataSubscribtion$.unsubscribe();
  }

  generateCurve(input: IUserInput) {
    this.serverConnect.requestCurve(input).subscribe(
      res => {
        console.log(res);
        this.graphDataStore.setState({points: res, input});
        // this.renderGraph.renderBackgroundGrid('bgd-layer');
        // this.renderGraph.renderCurve('curve-layer', input, res);
      }
    );
    // console.log(input, input.numberOfPoints);
  }

}
