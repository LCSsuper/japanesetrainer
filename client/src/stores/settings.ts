import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

export default class SettingsStore {
    range: [number, number] = [0, 10];
    showRomanji: boolean = true;
    darkMode: boolean = true;

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
    }

    setRange = (from: number, to: number) => {
        this.range = [from, to];
    };

    setDarkMode = (onOrOff: boolean) => {
        this.darkMode = onOrOff;
    };

    setShowRomanji = (onOrOff: boolean) => {
        this.showRomanji = onOrOff;
    };
}
