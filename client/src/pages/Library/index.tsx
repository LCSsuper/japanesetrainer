import { Card, Grid, Group, Space, Tabs, Title, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { IconCheckbox } from "@tabler/icons-react";

import { ScrollToTop } from "./components/ScrollToTop";
import { Lessons } from "./components/Lessons";
import { Words } from "./components/Words";
import { useMobxStores } from "../../hooks/useMobxStores";

const Library = observer(() => {
    const {
        libraryStore: { library, selectedWordIds },
    } = useMobxStores();

    return (
        <>
            <ScrollToTop />
            <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                <Grid.Col>
                    <Card shadow="xl">
                        <Group justify="space-between" align="start">
                            <Group>
                                <IconCheckbox size="2rem" />
                                <Title order={3}>Lesson options</Title>
                            </Group>
                            <Group align="top">
                                <Title
                                    order={6}
                                    c="dimmed"
                                >{`0 selected`}</Title>
                            </Group>
                        </Group>
                        <Space h="xl" />
                        <Tabs defaultValue="lessons" keepMounted={false}>
                            <Tabs.List grow>
                                <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
                                <Tabs.Tab value="creator">
                                    Lesson creator
                                </Tabs.Tab>
                                <Tabs.Tab value="words">Words</Tabs.Tab>
                            </Tabs.List>

                            <Space h="xs" />

                            <Tabs.Panel value="lessons">
                                <Lessons />
                            </Tabs.Panel>

                            <Tabs.Panel value="words">
                                <Text c="dimmed" fs="italic">
                                    {`The library contains ${library.length} words.`}
                                </Text>
                                <Space h="xs" />
                                <Words
                                    words={library}
                                    selectedWordIds={selectedWordIds}
                                />
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
