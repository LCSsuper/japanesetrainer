import {
    Space,
    Text,
    Grid,
    Card,
    Center,
    Group,
    Badge,
    ActionIcon,
    Modal,
} from "@mantine/core";
import { useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { Words } from "./Words";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { Lesson, Word } from "../../../types";

const WordsInLesson = ({
    lesson,
    getWordsInLibrary,
}: {
    lesson: Lesson;
    getWordsInLibrary: (lesson: Lesson) => Word[];
}) => <Words words={getWordsInLibrary(lesson)} selectedWordIds={new Set()} />;

const LessonCard = ({
    lesson,
    onSelect,
    selected,
    getWordsInLibrary,
}: {
    lesson: Lesson;
    selected: boolean;
    onSelect: (key: string) => void;
    getWordsInLibrary: (lesson: Lesson) => Word[];
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Card
                shadow="xs"
                withBorder
                onClick={() => onSelect(lesson.key)}
                styles={{
                    root: {
                        cursor: "pointer",
                        borderColor: selected ? "cyan" : "gray",
                    },
                }}
            >
                <Group justify="space-between">
                    <Text size="xs">{lesson.title}</Text>
                    {lesson.type && (
                        <Badge
                            size="xs"
                            color={
                                lesson.type === "category" ? "violet" : "cyan"
                            }
                            tt="none"
                        >
                            {lesson.type}
                        </Badge>
                    )}
                </Group>
                <Space h="xs" />
                <Group gap={5}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={(e) => {
                            e.stopPropagation();
                            open();
                        }}
                    >
                        <IconEye />
                    </ActionIcon>
                    <Text size="xs" c="dimmed" fs="italic">
                        {`${lesson.count} words`}
                    </Text>
                </Group>
            </Card>
            <Modal
                opened={opened}
                onClose={close}
                title={`Words in lesson: ${lesson.title}`}
                fullScreen
            >
                <WordsInLesson
                    lesson={lesson}
                    getWordsInLibrary={getWordsInLibrary}
                />
            </Modal>
        </>
    );
};

export const Lessons = observer(() => {
    const { libraryStore } = useMobxStores();
    const [selectedLesson, setSelectedLesson] = useState<string>("all");

    return (
        <>
            <Space h="xs" />
            <Center>
                <Grid w={"35rem"} maw={"100%"}>
                    {libraryStore.lessons.map((lesson) => {
                        return (
                            <Grid.Col span={6} key={lesson.key}>
                                <LessonCard
                                    getWordsInLibrary={
                                        libraryStore.getWordsInLibrary
                                    }
                                    lesson={lesson}
                                    onSelect={setSelectedLesson}
                                    selected={lesson.key === selectedLesson}
                                />
                            </Grid.Col>
                        );
                    })}
                </Grid>
            </Center>
        </>
    );
});
