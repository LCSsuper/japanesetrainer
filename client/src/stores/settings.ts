import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";
import { get, save } from "./localstorage";

export default class SettingsStore {
    allowRomanizationAsAnswer: boolean = true;
    showRomanization: boolean = true;
    showWordType: boolean = true;
    randomize: boolean = true;
    darkmode: boolean = true;

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getSettingsFromLocalStorage();
    }

    save = (
        key:
            | "showRomanization"
            | "showWordType"
            | "randomize"
            | "darkmode"
            | "allowRomanizationAsAnswer",
        value: boolean
    ) => {
        this[key] = value;
        save(key, value);
    };

    get = (
        key:
            | "showRomanization"
            | "showWordType"
            | "randomize"
            | "darkmode"
            | "allowRomanizationAsAnswer"
    ) => {
        return this[key];
    };

    getSettingsFromLocalStorage = () => {
        const showRomanization = get("showRomanization");
        const showWordType = get("showWordType");
        const randomize = get("randomize");
        const darkmode = get("darkmode");
        const allowRomanizationAsAnswer = get("allowRomanizationAsAnswer");

        this.showRomanization = showRomanization ?? this.showRomanization;
        this.showWordType = showWordType ?? this.showWordType;
        this.randomize = randomize ?? this.randomize;
        this.darkmode = darkmode ?? this.darkmode;
        this.allowRomanizationAsAnswer =
            allowRomanizationAsAnswer ?? this.allowRomanizationAsAnswer;
    };
}
