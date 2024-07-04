import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { useMobxStores } from "../../hooks/useMobxStores";
import "./index.css";

export const ThemeProvider = observer(
    ({ children }: { children: ReactNode }) => {
        const {
            settingsStore: { darkMode },
        } = useMobxStores();

        return (
            <div className={`theme ${darkMode ? "dark" : "light"}`}>
                {children}
            </div>
        );
    }
);
