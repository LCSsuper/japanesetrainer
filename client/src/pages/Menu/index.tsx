import { Grid } from "@mantine/core";

import { TitleCard } from "./components/TitleCard";
import { LessonInfoCard } from "./components/LessonInfoCard";
import { PracticeCard } from "./components/PracticeCard";
import { TransitionOnMount } from "../../components/generic/TransitionOnMount";

const Menu = () => {
    return (
        <TransitionOnMount>
            <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                <Grid.Col>
                    <TitleCard />
                </Grid.Col>
                <Grid.Col span={12}>
                    <LessonInfoCard />
                </Grid.Col>
                <Grid.Col span={{ xs: 12, md: 6 }}>
                    <PracticeCard mode="lang_to_eng" />
                </Grid.Col>
                <Grid.Col span={{ xs: 12, md: 6 }}>
                    <PracticeCard mode="eng_to_lang" />
                </Grid.Col>
            </Grid>
        </TransitionOnMount>
    );
};

export default Menu;
