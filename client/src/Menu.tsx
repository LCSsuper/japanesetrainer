import React from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./menu.css";

const flags = {
    japanese: "🇯🇵",
    spanish: "🇪🇸",
};

const Menu = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        learnerStore: { reset },
        challengeStore: { initialize },
        settingsStore: { language },
    } = useMobxStores();

    return (
        <>
            <div className="menu-container">
                <i>{`Selected language: ${flags[language]} ${language}`}</i>
                <div id="title">Language Trainer</div>
                <div id="subtitle">
                    Learn a language by learning the most common words
                </div>
                <button
                    onClick={() => {
                        reset();
                        setCurrentRoute("learner");
                    }}
                >
                    Training
                </button>
                <button
                    onClick={() => {
                        initialize();
                        setCurrentRoute("challenge");
                    }}
                >
                    Daily Challenge
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
