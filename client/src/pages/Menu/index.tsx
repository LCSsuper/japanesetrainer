import { Grid } from "@mantine/core";

import { TitleCard } from "./components/TitleCard";
import { LibraryInfoCard } from "./components/LibraryInfoCard";
import { PracticeCard } from "./components/PracticeCard";

const Menu = () => {
    return (
        <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
            <Grid.Col span={6} visibleFrom="md">
                <Grid>
                    <Grid.Col>
                        <TitleCard />
                    </Grid.Col>
                    <Grid.Col>
                        <LibraryInfoCard />
                    </Grid.Col>
                </Grid>
            </Grid.Col>
            <Grid.Col span={6} visibleFrom="md">
                <Grid>
                    <Grid.Col>
                        <PracticeCard mode="lang_to_eng" />
                    </Grid.Col>
                    <Grid.Col>
                        <PracticeCard mode="eng_to_lang" />
                    </Grid.Col>
                </Grid>
            </Grid.Col>
            <Grid hiddenFrom="md">
                <Grid.Col>
                    <TitleCard />
                </Grid.Col>
                <Grid.Col>
                    <PracticeCard mode="lang_to_eng" />
                </Grid.Col>
                <Grid.Col>
                    <PracticeCard mode="eng_to_lang" />
                </Grid.Col>
                <Grid.Col>
                    <LibraryInfoCard />
                </Grid.Col>
            </Grid>
        </Grid>
    );
};

export default Menu;
