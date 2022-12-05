import React from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./menu.css";

const Menu = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        learnerStore: { reset },
    } = useMobxStores();

    return (
        <div className="menu-container">
            <div id="title">Japanese Trainer</div>
            <button
                onClick={() => {
                    reset();
                    setCurrentRoute("learner");
                }}
            >
                Training
            </button>
            <button onClick={() => setCurrentRoute("challenge")} disabled>
                Daily Challenge
            </button>
            <button onClick={() => setCurrentRoute("settings")}>
                Settings
            </button>
        </div>
    );
});

export default Menu;
