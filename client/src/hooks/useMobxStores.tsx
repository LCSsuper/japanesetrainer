import { Context, createContext, ReactNode, useContext } from "react";

import LearnerStore from "../stores/learner";
import RouterStore from "../stores/router";
import LibraryStore from "../stores/library";

class RootStore {
    routerStore: RouterStore;
    libraryStore: LibraryStore;
    learnerStore: LearnerStore;

    constructor() {
        this.routerStore = new RouterStore();
        this.libraryStore = new LibraryStore();
        this.learnerStore = new LearnerStore(this.libraryStore);
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
