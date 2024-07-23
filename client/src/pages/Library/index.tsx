import { useState } from "react";
import { Card, Group, Space, Tabs, Title } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { IconBook } from "@tabler/icons-react";
import { useScrollIntoView, useWindowScroll } from "@mantine/hooks";

import { ScrollToTop } from "./components/ScrollToTop";
import { Lessons } from "./components/Lessons";
import { useMobxStores } from "../../hooks/useMobxStores";
import { LessonCreator } from "./components/LessonCreator";
import { sleep } from "../../utils/sleep";
import { AllWords } from "./components/AllWords";

const Library = observer(() => {
    const {
        libraryStore: { library },
    } = useMobxStores();
    const [, scrollTo] = useWindowScroll();
    const { scrollIntoView, targetRef } = useScrollIntoView({ duration: 500 });
    const [tab, setTab] = useState<string | null>("lessons");

    return (
        <>
            <ScrollToTop />
            <Card w="50rem" maw="100vw" m="1rem" shadow="xl">
                <Group>
                    <IconBook size="2rem" />
                    <Title order={3}>Lessons</Title>
                </Group>
                <Space h="xl" />
                <Tabs
                    value={tab}
                    onChange={(t) => setTab(t)}
                    keepMounted={false}
                >
                    <Tabs.List grow>
                        <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
                        <Tabs.Tab value="creator">Lesson creator</Tabs.Tab>
                        <Tabs.Tab value="words">Words</Tabs.Tab>
                    </Tabs.List>

                    <Space h="xs" />

                    <Tabs.Panel value="lessons">
                        <Lessons
                            onCreateLesson={() => {
                                setTab("creator");
                                scrollTo({ y: 0 });
                            }}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="creator">
                        <LessonCreator
                            onCreateLesson={async () => {
                                setTab("lessons");
                                await sleep(50);
                                scrollIntoView();
                            }}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="words">
                        <AllWords library={library} />
                    </Tabs.Panel>
                </Tabs>
                <Space h="md" />
                <p ref={targetRef as any} />
            </Card>
        </>
    );
});

export default Library;
