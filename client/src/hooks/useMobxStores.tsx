import { Context, createContext, ReactNode, useContext } from "react";
import LearnerStore from "../stores/learner";
import RouterStore from "../stores/router";
import SettingsStore from "../stores/settings";

class RootStore {
    routerStore: RouterStore;
    settingsStore: SettingsStore;
    learnerStore: LearnerStore;

    constructor() {
        this.routerStore = new RouterStore();
        this.settingsStore = new SettingsStore();
        this.learnerStore = new LearnerStore(this.settingsStore);
    }
}

export const rootStore: RootStore = new RootStore();
const StoreContext: Context<RootStore> = createContext<RootStore>(rootStore);

export function StoreProvider({
    children,
}: {
    children: ReactNode;
}): JSX.Element {
    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
}

export function useMobxStores(): RootStore {
    return useContext(StoreContext);
}
