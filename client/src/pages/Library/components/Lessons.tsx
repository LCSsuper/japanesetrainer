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
    Button,
} from "@mantine/core";
import { IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { Lesson, Translation } from "../../../types";
import { WordsInLesson } from "../../../components/WordsInLesson";
import { SelectedLesson } from "../../../components/SelectedLesson";

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
    onDelete,
    getWordsInLesson,
}: {
    lesson: Lesson;
    selected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    getWordsInLesson: (lesson: Lesson) => Translation[];
}) => {
    const [wordsModalOpened, { open: openWordsModal, close: closeWordsModal }] =
        useDisclosure(false);
    const [
        deleteModalOpened,
        { open: openDeleteModal, close: closeDeleteModal },
    ] = useDisclosure(false);

    let typeColor = "cyan";
    if (lesson.type === "category") {
        typeColor = "violet";
    }
    if (lesson.type === "custom") {
        typeColor = "pink";
    }

    return (
        <>
            <Modal
                opened={wordsModalOpened}
                onClose={closeWordsModal}
                title={`Words in lesson: ${lesson.title}`}
                fullScreen
            >
                <WordsInLesson
                    lesson={lesson}
                    getWordsInLesson={getWordsInLesson}
                />
            </Modal>
            <Modal
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                title={`Are you sure you want to delete lesson '${lesson.title}'?`}
            >
                <Group justify="end">
                    <Button onClick={closeDeleteModal} variant="light">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onDelete(lesson.id);
                            closeDeleteModal();
                        }}
                        color="red"
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
            <Card
                h="5rem"
                shadow="xs"
                withBorder
                onClick={() => onSelect(lesson.id)}
                styles={{
                    root: {
                        cursor: "pointer",
                        borderColor: selected ? "cyan" : "gray",
                    },
                }}
            >
                <Group justify="space-between">
                    <Text size="xs" truncate maw={lesson.type ? "70%" : "100%"}>
                        {lesson.title}
                    </Text>
                    {lesson.type && (
                        <Badge size="xs" color={typeColor} tt="none">
                            {lesson.type}
                        </Badge>
                    )}
                </Group>
                <Space h="xs" />
                <Group justify="space-between">
                    <Group gap={5}>
                        <ActionIcon
                            size="sm"
                            variant="light"
                            onClick={(e) => {
                                e.stopPropagation();
                                openWordsModal();
                            }}
                        >
                            <IconEye />
                        </ActionIcon>
                        <Text size="xs" c="dimmed" fs="italic">
                            {`${lesson.count} words`}
                        </Text>
                    </Group>
                    {lesson?.type === "custom" && (
                        <ActionIcon
                            size="sm"
                            variant="light"
                            color="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal();
                            }}
                        >
                            <IconTrash />
                        </ActionIcon>
                    )}
                </Group>
            </Card>
        </>
    );
};

export const Lessons = observer(
    ({ onCreateLesson }: { onCreateLesson: () => void }) => {
        const { libraryStore } = useMobxStores();
        const { width } = useViewportSize();

        return (
            <>
                <Space h="sm" />
                <Group justify="end">
                    <SelectedLesson
                        label="selected lesson"
                        lesson={libraryStore.selectedLesson}
                        getWordsInLesson={libraryStore.getWordsInLesson}
                    />
                </Group>
                <Space h="xl" />
                <Center>
                    <Grid w={"35rem"} maw={"100%"}>
                        <Grid.Col>
                            <Text size="md">Select a lesson:</Text>
                        </Grid.Col>
                        {libraryStore.lessons.map((lesson) => {
                            return (
                                <Grid.Col
                                    span={width > 900 ? 6 : 12}
                                    key={lesson.id}
                                >
                                    <LessonCard
                                        getWordsInLesson={
                                            libraryStore.getWordsInLesson
                                        }
                                        lesson={lesson}
                                        onSelect={
                                            libraryStore.setSelectedLesson
                                        }
                                        onDelete={libraryStore.deleteLesson}
                                        selected={
                                            lesson.id ===
                                            libraryStore.selectedLessonId
                                        }
                                    />
                                </Grid.Col>
                            );
                        })}
                        <Grid.Col span={width > 900 ? 6 : 12}>
                            <CreateLessonCard onClick={onCreateLesson} />
                        </Grid.Col>
                    </Grid>
                </Center>
            </>
        );
    }
);
