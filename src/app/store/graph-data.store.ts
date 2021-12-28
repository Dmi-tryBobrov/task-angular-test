import { Injectable, OnInit } from "@angular/core";
import { IPoint  } from "../interfaces/point-interface";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { IUserInput } from "../interfaces/user-input";

export interface GraphData {
    points: IPoint[];
    input: IUserInput;
}

@Injectable()
export class GraphDataStore extends ComponentStore<GraphData> {

    readonly graphData$: Observable<GraphData> = this.select(state => state);

    // readonly updateState = this.updater()

    constructor(){
        super();
    }
}