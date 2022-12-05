import React from "react";
import { StoreProvider } from "./hooks/useMobxStores";
import Learner from "./Learner";
import Menu from "./Menu";
import Settings from "./Settings";
import { useMobxStores } from "./hooks/useMobxStores";
import { observer } from "mobx-react-lite";

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
                    {currentRoute === "learner" && <Learner />}
                    {currentRoute === "menu" && <Menu />}
                    {currentRoute === "settings" && <Settings />}
                </div>
            </div>
        </StoreProvider>
    );
});

export default App;
