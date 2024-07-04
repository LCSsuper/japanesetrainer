import Learner from "./pages/Learner";
import Menu from "./pages/Menu";
import Settings from "./pages/Settings";
import { StoreProvider, useMobxStores } from "./hooks/useMobxStores";
import { observer } from "mobx-react-lite";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.layer.css";

const theme = createTheme({
    primaryColor: "cyan",
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
                <ThemeProvider>
                    <Layout>
                        <>
                            {currentRoute === "menu" && <Menu />}
                            {currentRoute === "learner" && <Learner />}
                            {currentRoute === "settings" && <Settings />}
                        </>
                    </Layout>
                </ThemeProvider>
            </MantineProvider>
        </StoreProvider>
    );
});

export default App;
