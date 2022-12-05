import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

export default class RouterStore {
    currentRoute: string = "menu";

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
    }

    setCurrentRoute = (route: string) => {
        this.currentRoute = route;
    };
}
