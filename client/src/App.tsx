import { AppShell, Center, MantineProvider, createTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import "@mantine/core/styles.layer.css";

import Learner from "./pages/Learner";
import Menu from "./pages/Menu";
import Library from "./pages/Library";
import { StoreProvider, useMobxStores } from "./hooks/useMobxStores";
import { Header } from "./components/Header";

const desktopTheme = createTheme({
    primaryColor: "cyan",
    scale: 1.3,
});

const mobileTheme = createTheme({
    primaryColor: "cyan",
    scale: 1,
});

const App = observer(() => {
    const {
        routerStore: { currentRoute },
        settingsStore: { darkmode },
    } = useMobxStores();

    const { width } = useViewportSize();

    return (
        <StoreProvider>
            <MantineProvider
                forceColorScheme={darkmode ? "dark" : "light"}
                theme={width > 600 ? desktopTheme : mobileTheme}
            >
                <AppShell header={{ height: 60 }} padding="md">
                    <AppShell.Header>
                        <Header />
                    </AppShell.Header>
                    <AppShell.Main>
                        <Center h={"100%"}>
                            {currentRoute === "menu" && <Menu />}
                            {currentRoute === "learner" && <Learner />}
                            {currentRoute === "library" && <Library />}
                        </Center>
                    </AppShell.Main>
                </AppShell>
            </MantineProvider>
        </StoreProvider>
    );
});

export default App;
