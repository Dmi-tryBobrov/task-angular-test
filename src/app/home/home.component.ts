import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerConnectService } from '../services/server-connect.service';
import { RenderGraphService } from '../services/render-graph.service';
import { IUserInput } from '../interfaces/user-input';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { GraphDataStore } from '../store/graph-data.store';
import { sameValueValidator } from '../validators/same-value.directive';

type IUserInputKeys = keyof IUserInput;

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
      minValue: ['0', [Validators.required]],
      maxValue: ['100', [Validators.required]],
      maxHeight: ['10', [Validators.required]],
      numberOfPoints: ['100', [Validators.required]]
    },
    {validators: sameValueValidator}
    );

    let bgdCanvas: HTMLCanvasElement = document.querySelector('#bgd-layer') as HTMLCanvasElement;
    this.renderGraph.registerCanvas(bgdCanvas, 'bgd-layer');

    let curveCanvas: HTMLCanvasElement = document.querySelector('#curve-layer') as HTMLCanvasElement;
    this.renderGraph.registerCanvas(curveCanvas, 'curve-layer');

    this.renderGraph.renderBackgroundGrid('bgd-layer');

    this._graphDataSubscribtion$ = this._graphData$
    .subscribe(data => {
      console.log('inside it!');
      if(data.points.length){
        this.renderGraph.renderCurve('curve-layer', data.input, data.points);
      }
    });

    //TODO: improve resize issue
    this._windowResize$ = fromEvent(window, 'resize');
    this._windowResizeSubscription$ = this._windowResize$
    .subscribe(e => {
      this.renderGraph.resetGraph();
      this.renderGraph.renderBackgroundGrid('bgd-layer');
      this.graphDataStore.getState().subscribe(
        state => {
          if(state.points.length){
            this.renderGraph.renderCurve('curve-layer', state.input, state.points);
          }
        }
      );

    });
  }

  get minValue() {
    return this.userInputs.get('minValue') as FormControl;
  }

  get maxValue() {
    return this.userInputs.get('maxValue') as FormControl;
  }

  get maxHeight() {
    return this.userInputs.get('maxHeight') as FormControl;
  }

  get numberOfPoints() {
    return this.userInputs.get('numberOfPoints') as FormControl;
  }

  ngOnDestroy(): void {
    this._windowResizeSubscription$.unsubscribe();
    this._graphDataSubscribtion$.unsubscribe();
  }

  generateCurve(input: IUserInput) {
    this.checkInput(input);
    console.log(JSON.stringify(input))
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

  private checkInput(input: IUserInput) {
    this.checkDecimalSeparator(input);

    let minValue = parseFloat(input.minValue);
    let maxValue = parseFloat(input.maxValue);

    if(!this.checkMinMax(minValue, maxValue)){
      input.minValue = maxValue.toString();
      input.maxValue = minValue.toString();
    }
  }

  private checkDecimalSeparator(input: IUserInput): void {
    let val: string;
    let key: string;

    console.log(JSON.stringify(input));
    for([key, val] of Object.entries(input)){
      if(val.includes(','))
        input[key as IUserInputKeys] = val.replace(',', '.');
      }

    console.log(JSON.stringify(input));
  }

  private checkMinMax(min: number, max: number): boolean {
    if(min < max)
      return true;
    else
      return false;
  }

  showInputErrorMessage(): string {
    if (
      this.userInputs.controls['minValue'].hasError('notAFloat') || 
      this.userInputs.controls['maxValue'].hasError('notAFloat')
      ) {
      return `Incorrect number`;
    }

    if(this.userInputs.controls['maxHeight'].hasError('notAPositiveFloat'))
      return 'Must be any number greater than 0';

    if (this.userInputs.controls['numberOfPoints'].hasError('notAPositiveInt'))
      return 'Must be an integer greater than 0';

    return '';
  }

 
}
