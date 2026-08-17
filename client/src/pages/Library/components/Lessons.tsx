import { Space, Text, Grid, Card, Center, Group, Title } from "@mantine/core";
import { IconPlus, IconSchool } from "@tabler/icons-react";
import { useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { SelectedLesson } from "../../../components/lessons/SelectedLesson";
import { LessonCard } from "../../../components/lessons/LessonCard";
import { TransitionOnMount } from "../../../components/generic/TransitionOnMount";
import { capitalize } from "../../../utils/capitalize";

const CreateLessonCard = ({ onClick }: { onClick: () => void }) => (
    <Card
        h="4.5rem"
        shadow="xs"
        withBorder
        onClick={onClick}
        styles={{
            root: {
                cursor: "pointer",
                borderColor: "gray",
            },
        }}
    >
        <Center h="100%">
            <Group gap={5}>
                <IconPlus color="gray" />
                <Text size="xs" c="dimmed">
                    create new lesson
                </Text>
            </Group>
        </Center>
    </Card>
);

export const Lessons = observer(() => {
    const { libraryStore, routerStore } = useMobxStores();
    const { width } = useViewportSize();

    return (
        <TransitionOnMount>
            <Card
                w="50rem"
                maw="100vw"
                m="1rem"
                shadow="xl"
                radius="lg"
                pb="5rem"
            >
                <Group>
                    <IconSchool size="2rem" />
                    <Title order={3}>
                        {capitalize(libraryStore.languageTitle)} lessons
                    </Title>
                </Group>
                <Space h="4rem" />
                <Center>
                    <Grid w={"35rem"} maw={"100%"}>
                        {libraryStore.lessons.map((lesson) => {
                            return (
                                <Grid.Col
                                    span={width > 900 ? 6 : 12}
                                    key={lesson.id}
                                >
                                    <LessonCard
                                        lesson={lesson}
                                        onSelect={
                                            libraryStore.setSelectedLesson
                                        }
                                        selected={
                                            lesson.id ===
                                            libraryStore.selectedLessonId
                                        }
                                        w="100%"
                                    />
                                </Grid.Col>
                            );
                        })}
                        <Grid.Col span={width > 900 ? 6 : 12}>
                            <CreateLessonCard
                                onClick={() =>
                                    routerStore.setCurrentRoute("lessoncreate")
                                }
                            />
                        </Grid.Col>
                    </Grid>
                </Center>
            </Card>
        </TransitionOnMount>
    );
});
