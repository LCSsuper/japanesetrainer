import React from "react";
import { observer } from "mobx-react-lite";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useMobxStores } from "./hooks/useMobxStores";
import "./settings.css";

const Settings = observer(() => {
    const {
        settingsStore: {
            range,
            setRange,
            darkMode,
            setDarkMode,
            showDescription,
            setShowDescription,
            setLanguage,
            language,
        },
        learnerStore: { library },
    } = useMobxStores();

    return (
        <div className="settings-container">
            <div className="header">General</div>
            <div className="checkbox">
                <input
                    type="checkbox"
                    id="darkmode"
                    name="darkmode"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
                <label htmlFor="darkmode">Dark mode</label>
            </div>
            <div className="language">
                <span>Language: </span>
                <select
                    name="language"
                    id="language"
                    onChange={(e) => {
                        setLanguage(e.target.value);
                    }}
                    value={language}
                >
                    <option value="japanese">Japanese</option>
                    <option value="spanish">Spanish</option>
                    <option value="swedish">Swedish</option>
                    <option value="papiamento">Papiamento</option>
                    <option value="korean">Korean</option>
                </select>
            </div>
            <div className="header">Training</div>
            <i>{`The library contains ${library.length} words. Choose a selection that you want to train`}</i>
            <RangeSlider
                className="range-slider"
                min={0}
                max={library.length}
                value={range}
                onInput={(newRange: number[]) => {
                    setRange(newRange[0], newRange[1]);
                }}
            />
            <div id="range">
                <span>{`Range: `}</span>
                <input
                    type="number"
                    value={range[0]}
                    onChange={(event) => {
                        const value = Number(event.target.value);
                        if (value < 0) return;
                        if (value > range[1]) {
                            setRange(range[1], range[1]);
                            return;
                        }
                        setRange(value, range[1]);
                    }}
                />
                <input
                    type="number"
                    value={range[1]}
                    onChange={(event) => {
                        const value = Number(event.target.value);
                        if (value < 0) return;
                        if (value > library.length) {
                            setRange(range[0], library.length);
                            return;
                        }
                        if (value < range[0]) {
                            setRange(range[0], range[0]);
                            return;
                        }
                        setRange(range[0], value);
                    }}
                />
            </div>
            <div className="checkbox">
                <input
                    type="checkbox"
                    id="showdescription"
                    name="showdescription"
                    checked={showDescription}
                    onChange={() => setShowDescription(!showDescription)}
                />
                <label htmlFor="showdescription">
                    Show description (e.g. romanji for japanese)
                </label>
            </div>
        </div>
    );
});

export default Settings;
