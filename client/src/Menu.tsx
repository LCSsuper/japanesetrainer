import React from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./menu.css";

const flags = {
    japanese: "🇯🇵",
    spanish: "🇪🇸",
    english: "🇬🇧",
    swedish: "🇸🇪",
};

const Menu = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        learnerStore: { reset, setEnglishToJapanese },
        challengeStore: { initialize },
        settingsStore: { language },
    } = useMobxStores();

    return (
        <>
            <div className="menu-container">
                <i
                    onClick={() => setCurrentRoute("settings")}
                >{`Selected language: ${flags[language]} ${language}`}</i>
                <div id="title">Language Trainer</div>
                <div id="subtitle">
                    Learn a language by learning the most common words
                </div>
                <button
                    onClick={() => {
                        setEnglishToJapanese(false);
                        reset();
                        setCurrentRoute("learner");
                    }}
                >
                    {`Training (${flags[language]} - ${flags["english"]})`}
                </button>
                <button
                    onClick={() => {
                        setEnglishToJapanese(true);
                        reset();
                        setCurrentRoute("learner");
                    }}
                >
                    {`Training (${flags["english"]} - ${flags[language]})`}
                </button>
                <button
                    onClick={() => {
                        initialize();
                        setCurrentRoute("challenge");
                    }}
                >
                    {`Daily Challenge (${flags[language]} - ${flags["english"]})`}
                </button>
                <button onClick={() => setCurrentRoute("settings")}>
                    Settings
                </button>
                <button onClick={() => setCurrentRoute("faq")}>F.A.Q.</button>
            </div>
        </>
    );
});

export default Menu;
