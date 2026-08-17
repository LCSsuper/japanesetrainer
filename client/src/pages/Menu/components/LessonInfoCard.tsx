import { Card, Title, Group, Button, Box, Stack, Flex } from "@mantine/core";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { observer } from "mobx-react-lite";
import { LanguageSelect } from "../../../components/LanguageSelect";
import { LessonCard } from "../../../components/lessons/LessonCard";
import { NoLessonCard } from "../../../components/lessons/NoLessonCard";
import { IconClick, IconPlus } from "@tabler/icons-react";
import { ViewLessonButton } from "../../../components/lessons/ViewLessonButton";
import { ViewAllWordsButton } from "../../../components/lessons/ViewAllWordsButton";

// TODO have an easier way to select a lesson, maybe a dropdown or something
// TODO clearly show what lesson is selected
// TODO prettier buttons, something like: "manage lessons", "create lesson", "check all words"

export const LessonInfoCard = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        libraryStore: { selectedLesson, setLanguage, language, flag },
    } = useMobxStores();

    return (
        <Card shadow="xl" radius="lg" style={{ overflow: "visible" }}>
            <Title order={2}>
                <Group justify="space-between" align="start">
                    <Stack gap="xs">
                        <Group gap={7}>
                            <Title order={4}>Today I'm learning</Title>
                            <LanguageSelect
                                disabled={false}
                                setLanguage={setLanguage}
                                language={language}
                            />
                            <ViewAllWordsButton />
                        </Group>
                        <Group>
                            <Box fz="5rem">{flag}</Box>
                        </Group>
                    </Stack>
                    <Stack gap="xs">
                        <Title order={4}>Selected lesson:</Title>
                        {selectedLesson && (
                            <LessonCard
                                lesson={selectedLesson}
                                w="17rem"
                                hideDelete
                            />
                        )}
                        {!selectedLesson && <NoLessonCard w="17rem" />}
                        <Flex gap="xs">
                            <Button
                                variant={selectedLesson ? "light" : "gradient"}
                                onClick={() => setCurrentRoute("lessonselect")}
                                leftSection={<IconClick />}
                                flex={1}
                            >
                                {selectedLesson
                                    ? "Select different lesson"
                                    : "Select a lesson"}
                            </Button>
                            <Button
                                color="green"
                                w="2.625rem" // md width
                                p="0"
                                onClick={() => setCurrentRoute("lessoncreate")}
                                variant="subtle"
                            >
                                <IconPlus />
                            </Button>
                        </Flex>
                    </Stack>
                </Group>
            </Title>
        </Card>
    );
});
