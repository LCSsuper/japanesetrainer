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
import { IconEye, IconPlus } from "@tabler/icons-react";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { Words } from "./Words";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { Lesson, Word } from "../../../types";

const WordsInLesson = ({
    lesson,
    getWordsInLesson,
}: {
    lesson: Lesson;
    getWordsInLesson: (lesson: Lesson) => Word[];
}) => <Words words={getWordsInLesson(lesson)} />;

export const SelectedLesson = ({
    lesson,
    getWordsInLesson,
}: {
    lesson?: Lesson;
    getWordsInLesson: (lesson: Lesson) => Word[];
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Card withBorder w="10rem" h="4.5rem" p="sm">
            {!lesson && (
                <Center h="100%">
                    <Text size="xs" c="dimmed" fs="italic">
                        {"no lesson selected"}
                    </Text>
                </Center>
            )}
            {lesson && (
                <>
                    <Modal
                        opened={opened}
                        onClose={close}
                        title={`Words in lesson: ${lesson?.title}`}
                        fullScreen
                    >
                        <WordsInLesson
                            lesson={lesson}
                            getWordsInLesson={getWordsInLesson}
                        />
                    </Modal>
                    <Group justify="space-between">
                        <Text size="xs">{lesson.title}</Text>
                        <ActionIcon
                            size="xs"
                            variant="subtle"
                            onClick={(e) => {
                                e.stopPropagation();
                                open();
                            }}
                        >
                            <IconEye />
                        </ActionIcon>
                    </Group>
                    <Space h="xs" />
                    <Group justify="space-between">
                        <Text c="dimmed" size="xs">{`${
                            lesson?.count || 0
                        } words`}</Text>
                        {lesson?.type && (
                            <Badge
                                size="xs"
                                color={
                                    lesson.type === "category"
                                        ? "violet"
                                        : "cyan"
                                }
                                tt="none"
                            >
                                {lesson?.type}
                            </Badge>
                        )}
                    </Group>
                </>
            )}
        </Card>
    );
};

const CreateLessonCard = ({ onClick }: { onClick: () => void }) => (
    <Card
        h="5rem"
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

const LessonCard = ({
    lesson,
    onSelect,
    selected,
    getWordsInLesson,
}: {
    lesson: Lesson;
    selected: boolean;
    onSelect: (key: string) => void;
    getWordsInLesson: (lesson: Lesson) => Word[];
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={`Words in lesson: ${lesson.title}`}
                fullScreen
            >
                <WordsInLesson
                    lesson={lesson}
                    getWordsInLesson={getWordsInLesson}
                />
            </Modal>
            <Card
                h="5rem"
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
        </>
    );
};

export const Lessons = observer(() => {
    const { libraryStore } = useMobxStores();
    const { width } = useViewportSize();

    return (
        <>
            <Space h="xs" />
            <Center>
                <Grid w={"35rem"} maw={"100%"}>
                    {libraryStore.lessons.map((lesson) => {
                        return (
                            <Grid.Col
                                span={width > 900 ? 6 : 12}
                                key={lesson.key}
                            >
                                <LessonCard
                                    getWordsInLesson={
                                        libraryStore.getWordsInLesson
                                    }
                                    lesson={lesson}
                                    onSelect={libraryStore.setSelectedLesson}
                                    selected={
                                        lesson.key ===
                                        libraryStore.selectedLessonId
                                    }
                                />
                            </Grid.Col>
                        );
                    })}
                    <Grid.Col span={width > 900 ? 6 : 12}>
                        <CreateLessonCard
                            onClick={() => console.log("create lesson")}
                        />
                    </Grid.Col>
                </Grid>
            </Center>
        </>
    );
});
