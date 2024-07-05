import Learner from "./pages/Learner";
import Menu from "./pages/Menu";
import Settings from "./pages/Settings";
import { StoreProvider, useMobxStores } from "./hooks/useMobxStores";
import { observer } from "mobx-react-lite";
import { AppShell, Center, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { Header } from "./components/Header";

const theme = createTheme({
    primaryColor: "cyan",
    scale: 1.3,
});

const App = observer(() => {
    const {
        routerStore: { currentRoute },
        settingsStore: { darkMode },
    } = useMobxStores();

    return (
        <StoreProvider>
            <MantineProvider
                forceColorScheme={darkMode ? "dark" : "light"}
                theme={theme}
            >
                <AppShell header={{ height: 60 }} padding="md">
                    <AppShell.Header>
                        <Header />
                    </AppShell.Header>
                    <AppShell.Main>
                        <Center h={"100%"}>
                            {currentRoute === "menu" && <Menu />}
                            {currentRoute === "learner" && <Learner />}
                            {currentRoute === "settings" && <Settings />}
                        </Center>
                    </AppShell.Main>
                </AppShell>
            </MantineProvider>
        </StoreProvider>
    );
});

export default App;
