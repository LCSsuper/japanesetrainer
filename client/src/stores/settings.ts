import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

type Language = "japanese" | "spanish" | "swedish" | "papiamento";

export default class SettingsStore {
    range: [number, number] = [0, 10];
    showDescription: boolean = true;
    darkMode: boolean = true;
    language: Language = "japanese";

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getSettings();
    }

    setRange = (from: number, to: number) => {
        this.range = [from, to];
        this.saveSettings();
    };

    setDarkMode = (onOrOff: boolean) => {
        this.darkMode = onOrOff;
        this.saveSettings();
    };

    setShowDescription = (onOrOff: boolean) => {
        this.showDescription = onOrOff;
        this.saveSettings();
    };

    setLanguage = (language: string) => {
        this.language = language as Language;
        this.saveSettings();
    };

    saveSettings = () => {
        window.localStorage.setItem(
            "settings",
            JSON.stringify({
                range: this.range,
                showDescription: this.showDescription,
                darkMode: this.darkMode,
                language: this.language,
            })
        );
    };

    getSettings = () => {
        const settings = window.localStorage.getItem("settings");
        if (!settings) return;
        ({
            range: this.range,
            showDescription: this.showDescription,
            darkMode: this.darkMode,
            language: this.language,
        } = JSON.parse(settings));
    };
}
