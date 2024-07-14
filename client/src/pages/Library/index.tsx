import "react-range-slider-input/dist/style.css";
import { Grid } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../hooks/useMobxStores";
import { ScrollToTop } from "./components/ScrollToTop";
import { TitleCard } from "./components/TitleCard";
import { InfoCard } from "./components/InfoCard";
import { WordSelectionCard } from "./components/WordSelectionCard";

const Library = observer(() => {
    const {
        libraryStore: { library, language },
    } = useMobxStores();

    return (
        <>
            <ScrollToTop />
            <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                <Grid.Col>
                    <TitleCard language={language} />
                </Grid.Col>
                <Grid.Col>
                    <InfoCard library={library} language={language} />
                </Grid.Col>
                <Grid.Col>
                    <WordSelectionCard />
                </Grid.Col>
            </Grid>
        </>
    );
});

export default Library;
