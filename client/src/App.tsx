import React from "react";
import { StoreProvider } from "./hooks/useMobxStores";
import Learner from "./Learner";
import Menu from "./Menu";
import Settings from "./Settings";
import { useMobxStores } from "./hooks/useMobxStores";
import { observer } from "mobx-react-lite";
import Challenge from "./Challenge";
import FAQ from "./FAQ";

const App = observer(() => {
    const {
        routerStore: { currentRoute, setCurrentRoute },
        settingsStore: { darkMode },
    } = useMobxStores();

    return (
        <StoreProvider>
            {currentRoute !== "menu" && (
                <div
                    id="menu-button"
                    className={`${darkMode ? "dark" : "light"}`}
                    onClick={() => setCurrentRoute("menu")}
                >
                    {"← Menu"}
                </div>
            )}

            <div className={`container ${darkMode ? "dark" : "light"}`}>
                <div className="inner-container">
                    {currentRoute === "menu" && <Menu />}
                    {currentRoute === "learner" && <Learner />}
                    {currentRoute === "challenge" && <Challenge />}
                    {currentRoute === "settings" && <Settings />}
                    {currentRoute === "faq" && <FAQ />}
                </div>
            </div>
        </StoreProvider>
    );
});

export default App;
