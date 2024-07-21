import { Card, Text, Title, Space, Group, Button } from "@mantine/core";
import { IconBooks } from "@tabler/icons-react";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { observer } from "mobx-react-lite";
import { SelectedLesson } from "../../../components/SelectedLesson";

const plurals: { [key: string]: { singular: string; plural: string } } = {
    are: { singular: "is", plural: "are" },
    lessons: { singular: "lesson", plural: "lessons" },
};

const plural = (key: string, items: any[]): string => {
    return items.length === 1 ? plurals[key].singular : plurals[key].plural;
};

export const LessonInfoCard = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        libraryStore: { lessons, selectedLesson, getWordsInLesson },
    } = useMobxStores();

    return (
        <Card shadow="xl">
            <Title order={2}>
                <Group gap={7}>
                    <IconBooks />
                    <Title order={3}>Lessons</Title>
                </Group>
                <Space h={"xs"} />
                <Text c="dimmed" size="sm">
                    {`There ${plural("are", lessons)} ${lessons.length}
                                            ${plural(
                                                "lessons",
                                                lessons
                                            )} to practice.`}
                </Text>
                <Space h="md" />
                <Group justify="space-between" align="end">
                    <SelectedLesson
                        label="Selected lesson"
                        lesson={selectedLesson}
                        getWordsInLesson={getWordsInLesson}
                    />
                    <Button
                        variant="gradient"
                        onClick={() => setCurrentRoute("library")}
                    >
                        Lessons
                    </Button>
                </Group>
            </Title>
        </Card>
    );
});
