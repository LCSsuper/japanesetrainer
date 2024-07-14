import { Context, createContext, ReactNode, useContext } from "react";

import LearnerStore from "../stores/learner";
import RouterStore from "../stores/router";
import LibraryStore from "../stores/library";
import SettingsStore from "../stores/settings";

class RootStore {
    routerStore: RouterStore;
    libraryStore: LibraryStore;
    learnerStore: LearnerStore;
    settingsStore: SettingsStore;

    constructor() {
        this.routerStore = new RouterStore();
        this.libraryStore = new LibraryStore();
        this.settingsStore = new SettingsStore();
        this.learnerStore = new LearnerStore(
            this.libraryStore,
            this.settingsStore
        );
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
