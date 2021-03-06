import { Injectable, OnInit } from '@angular/core';
import { IPoint} from '../interfaces/point-interface';
import { IUserInput } from '../interfaces/user-input';
import { GraphDataStore } from '../store/graph-data.store';

interface Canvases {
  [key: string]: HTMLCanvasElement;
}

interface Contexts {
  [key: string]: CanvasRenderingContext2D;
}

@Injectable({
  providedIn: 'root'
})
export class RenderGraphService {

  public canvasList: Canvases = {};
  public contextList: Contexts = {};
  private _ctx?: CanvasRenderingContext2D;
  private _pixelRatio = window.devicePixelRatio;

  //background default variables
  private _bgdGridColor = '#000000';
  private _bgdGridWidth = 0.6;
  private _bgdBorderColor = '#888888';
  private _bgdBorderWidth = 3;
  private _subAxis = 4;
  private _bgdXAxisLines = 30;
  private _bgdYAxisLines = 15;

  //foreground defaul vars 
  private _labelFontSize = 11;
  private _maxCharNumInLabel = 8;
  private _curveColor = "#4b0082"; //indigo

  //common defaults
  private _bgdBorderMargins = {
    top: this._labelFontSize,
    bottom: this._labelFontSize + this._subAxis*4,
    left: this._labelFontSize*(this._maxCharNumInLabel + 1),
    right: this._labelFontSize*this._maxCharNumInLabel/2 + 1
  }

  constructor() { }

  registerCanvas(canvas: HTMLCanvasElement, id: string): void{

    this.canvasList['canvas_'+id] = canvas;
    this.initCanvas(canvas);
    this.registerContext(canvas.getContext('2d'), id);
    // console.log(this.canvasList);
  }

  private registerContext(ctx: CanvasRenderingContext2D | null, id: string): void {
    if(ctx){
      this.contextList['ctx_'+id] = ctx;
      this.initCtx(ctx);
    }    
    console.log(this.contextList);
  }

  //to accomodate retina display
  private initCanvas(canvas: HTMLCanvasElement): void {
    let canvasSize = canvas.getBoundingClientRect();
    canvas.width = canvasSize.width*this._pixelRatio;
    canvas.height = canvasSize.height*this._pixelRatio;

    // console.log(canvasSize.width, canvasSize.height);
  }

  //to accomodate retina display
  private initCtx (ctx: CanvasRenderingContext2D): void {
    ctx.scale(this._pixelRatio, this._pixelRatio);
  }

  
  resetGraph(): void {
    let key: string;
    let canvas: HTMLCanvasElement;
    let idPosition = 'canvas_'.length;
    for([key, canvas] of Object.entries(this.canvasList)){
      // console.log(key.slice(idPosition), canvas);
      let id = key.slice(idPosition);
      this.initCanvas(canvas);
      this.registerContext(canvas.getContext('2d'), id);
      this.clearCanvas(canvas.getBoundingClientRect());
    }
  }

  private getCanvasSizeAndCtx(id: string): DOMRect | null {
    try {
      if(Object.keys(this.contextList).includes('ctx_'+id)){
        this._ctx = this.contextList['ctx_'+id];
        return this.canvasList['canvas_'+id].getBoundingClientRect();

      }
      else{
        throw new Error(`Entered id: ${id}`);
      }  
      // console.log(this._ctx);
      
    } catch (error) {
      console.error('Incorrect id\n', error);
      this._ctx = undefined;
      return null;
    }
  }

  renderBackgroundGrid(id: string):void {
    let canvasSize = this.getCanvasSizeAndCtx(id);
    if(!this._ctx || !canvasSize) {return;}

    this.clearCanvas(canvasSize);

    this._ctx.strokeStyle = this._bgdGridColor;
    this._ctx.lineWidth = this._bgdGridWidth;

    let offsetX = (canvasSize.width - this._bgdBorderMargins.left
      - this._bgdBorderMargins.right)/(this._bgdXAxisLines - 1);

    let x_horLineLeft = this._bgdBorderMargins.left - this._bgdBorderWidth*0.5 - this._subAxis;
    let x_horLineRight = canvasSize.width - this._bgdBorderMargins.right;

    let offsetY = (canvasSize.height - this._bgdBorderMargins.bottom
      - this._bgdBorderMargins.top)/(this._bgdYAxisLines - 1);

    let y_vertLineTop = this._bgdBorderMargins.top;
    let y_vertLineBottom = canvasSize.height - this._bgdBorderMargins.bottom 
    + this._bgdBorderWidth*0.5 + this._subAxis;

    //draw vertical sub-axis
    for(let i = 0; i < this._bgdXAxisLines; i++){
      let x_vertLineTop = this._bgdBorderMargins.left + offsetX*i;

      this._ctx.beginPath();
      this._ctx.moveTo(x_vertLineTop, y_vertLineTop);
      this._ctx.lineTo(x_vertLineTop, y_vertLineBottom);
      this._ctx.stroke();
    }

    //draw horizontal sub-axis
    for(let i = 0; i < this._bgdYAxisLines; i++){
      let y_horLineLeft = this._bgdBorderMargins.top + offsetY*i;

      this._ctx.beginPath();
      this._ctx.moveTo(x_horLineLeft, y_horLineLeft);
      this._ctx.lineTo(x_horLineRight, y_horLineLeft);
      this._ctx.stroke();
    }

    this._ctx.strokeStyle = this._bgdBorderColor;
    this._ctx.lineWidth = this._bgdBorderWidth;
    this._ctx.strokeRect(this._bgdBorderMargins.left, this._bgdBorderMargins.top,
      canvasSize.width - this._bgdBorderMargins.left - this._bgdBorderMargins.right,
      canvasSize.height - this._bgdBorderMargins.top - this._bgdBorderMargins.bottom);
  }

  renderAxisLabels(id: string, minX: string, maxX: string, maxY: string): void {
    let canvasSize = this.getCanvasSizeAndCtx(id);
    if(!this._ctx || !canvasSize) {return;}

    let x_LeftBottomXAxis = this._bgdBorderMargins.left;
    let y_LeftBottomXAxis = canvasSize.height - this._bgdBorderMargins.bottom + this._bgdBorderWidth*3;

    let x_RightBottomXAxis = canvasSize.width - this._bgdBorderMargins.right;
    let y_RightBottomXAxis = canvasSize.height - this._bgdBorderMargins.bottom + this._bgdBorderWidth*3;

    this._ctx.fillStyle = '#000000';
    this._ctx.font = `${this._labelFontSize}px Arial`;
    this._ctx.textAlign = 'center';
    this._ctx.textBaseline = 'top';

    this._ctx.fillText(minX, x_LeftBottomXAxis, y_LeftBottomXAxis);
    this._ctx.fillText(maxX, x_RightBottomXAxis, y_RightBottomXAxis);

    this._ctx.textAlign = 'right';
    this._ctx.textBaseline = 'middle';

    let x_LeftBottomYAxis = this._bgdBorderMargins.left - this._bgdBorderWidth*3;
    let y_LeftBottomYAxis = canvasSize.height - this._bgdBorderMargins.bottom;

    let x_LeftTopYAxis = this._bgdBorderMargins.left - this._bgdBorderWidth*3;
    let y_LeftTopYAxis = this._bgdBorderMargins.top;

    this._ctx.fillText('0', x_LeftBottomYAxis, y_LeftBottomYAxis);
    this._ctx.fillText(maxY, x_LeftTopYAxis, y_LeftTopYAxis);

  }

  renderCurve(id: string, input: IUserInput, points: IPoint[]):void {
    let canvasSize = this.getCanvasSizeAndCtx(id);
    if(!this._ctx || !canvasSize) {return;}

    const graphX0 = points[0].x;
    const graphY0 = points[0].y;
    const numberOfPoints = parseInt(input.numberOfPoints, 10);

    const offsetX =(canvasSize.width - this._bgdBorderMargins.left - this._bgdBorderMargins.right)
    /(points[numberOfPoints-1].x - points[0].x);
    const offsetY = (canvasSize.height - this._bgdBorderMargins.top - this._bgdBorderMargins.bottom)
    /parseFloat(input.maxHeight);

    this.clearCanvas(canvasSize);
    this.renderAxisLabels('curve-layer', input.minValue, input.maxValue, input.maxHeight);

    this._ctx.save();
    this._ctx.transform(1, 0, 0, -1, 0, canvasSize.height);
    this._ctx.translate(this._bgdBorderMargins.left, this._bgdBorderMargins.bottom);
    this._ctx.strokeStyle = this._curveColor;

    //ONLY for QA
    // this._ctx.fillRect(0,0,50,50)

    this._ctx.beginPath();
    this._ctx.moveTo(0,graphY0*offsetY);

    for(let i = 1; i < numberOfPoints; i++){
      let x = (points[i].x - graphX0)*offsetX;
      let y = (points[i].y)*offsetY;

      this._ctx.lineTo(x, y);
    }

    this._ctx.stroke();

    this._ctx.restore();
  }

  private clearCanvas(rect: DOMRect): void {
    if(!this._ctx) {return;}

    this._ctx.clearRect(0, 0, rect.width, rect.height);
  }
}
