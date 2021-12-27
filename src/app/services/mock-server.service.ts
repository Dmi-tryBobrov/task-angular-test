import { Injectable } from '@angular/core';
import { IUserInput } from '../interfaces/user-input';
import { IPoint } from '../interfaces/point-interface';

@Injectable({
  providedIn: 'root'
})
export class MockServerService {

  private _width = 100;

  constructor() { }

  /*
    gaussian: g(X) = a*exp(-[X-b]^2/2c^2)
    c = (maxX - minX)/100 (/_width);
    b = random(minX, maxX),
    a = random(0, maxHeight)
  */
  calculateCurveCoord(input: IUserInput): IPoint[] {
    const res: IPoint[] = [];
    const minX = parseFloat(input.minValue);
    const maxX = parseFloat(input.maxValue);
    const numberOfPoints = parseInt(input.numberOfPoints, 10);
    const maxHeight = parseFloat(input.maxHeight);

    // const gaussianA = this.getRandomFloat(0, maxHeight);
    // const gaussianB = this.getRandomFloat(minX, maxX);
    // const gaussianC = (maxX - minX)/this._width;

    //for QA use normal distribution
    let gaussianA, gaussianB, gaussianC: number;
    [gaussianA, gaussianB, gaussianC] = this.getNormalDistr(maxHeight, minX, maxX);
    console.log(`a: ${gaussianA}, b: ${gaussianB}, c: ${gaussianC}`);

    const delta = (maxX - minX)/(numberOfPoints - 1);

    for(let i = 0; i < numberOfPoints; i++){
      const x = minX + i*delta;
      const y = this.calculateGaussian(gaussianA, gaussianB, gaussianC, x);
      res.push({x, y});
    }

    return res;
  }

  private getRandomFloat(from: number, to: number): number {
    return Math.random()*(to - from) + from;
  }

  private calculateGaussian(a: number, b: number, c: number, x: number): number {
    const exponent = (-1)*(x - b)**2/(2*c**2);
    return a*Math.exp(exponent);
  }

  private getNormalDistr(sigma: number, min: number, max: number){
    const a = 1/(sigma*Math.sqrt(2*Math.PI));
    const b = (max+min)/2;
    const c = sigma;
    return [a, b, c];
  }
}
