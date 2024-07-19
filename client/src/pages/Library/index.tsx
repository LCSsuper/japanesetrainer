import {
    Card,
    Grid,
    Group,
    Space,
    Tabs,
    Title,
    Text,
    Center,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { IconBook } from "@tabler/icons-react";

import { ScrollToTop } from "./components/ScrollToTop";
import { Lessons, SelectedLesson } from "./components/Lessons";
import { Words } from "./components/Words";
import { useMobxStores } from "../../hooks/useMobxStores";

const Library = observer(() => {
    const {
        libraryStore: { library, selectedLesson, getWordsInLesson },
    } = useMobxStores();

    return (
        <>
            <ScrollToTop />
            <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                <Grid.Col>
                    <Card shadow="xl">
                        <Group justify="space-between" align="start">
                            <Group>
                                <IconBook size="2rem" />
                                <Title order={3}>Lessons</Title>
                            </Group>
                            <Group align="top">
                                <SelectedLesson
                                    lesson={selectedLesson}
                                    getWordsInLesson={getWordsInLesson}
                                />
                            </Group>
                        </Group>
                        <Space h="xl" />
                        <Tabs defaultValue="lessons" keepMounted={false}>
                            <Tabs.List grow>
                                <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
                                <Tabs.Tab value="creator" disabled>
                                    Lesson creator
                                </Tabs.Tab>
                                <Tabs.Tab value="words">Words</Tabs.Tab>
                            </Tabs.List>

                            <Space h="xs" />

                            <Tabs.Panel value="lessons">
                                <Lessons />
                            </Tabs.Panel>

                            <Tabs.Panel value="words">
                                <Center h="3rem">
                                    <Text c="dimmed" fs="italic">
                                        {`There are ${library.length} words.`}
                                    </Text>
                                </Center>
                                <Space h="xs" />
                                <Words words={library} />
                            </Tabs.Panel>
                        </Tabs>
                        <Space h="md" />
                    </Card>
                </Grid.Col>
            </Grid>
        </>
    );
});

export default Library;
