import {
    Card,
    Center,
    Modal,
    Group,
    ActionIcon,
    Space,
    Badge,
    Text,
    Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye } from "@tabler/icons-react";
import { Lesson, Translation } from "../../types";
import { WordsInLesson } from "../WordsInLesson";

export const SelectedLesson = ({
    lesson,
    label,
    getWordsInLesson,
}: {
    lesson?: Lesson;
    label?: string;
    getWordsInLesson: (lesson: Lesson) => Translation[];
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    let typeColor = "cyan";
    if (lesson?.type === "category") {
        typeColor = "violet";
    }
    if (lesson?.type === "custom") {
        typeColor = "pink";
    }

    return (
        <Box>
            {label && (
                <Text c="dimmed" size="sm" fs="italic">
                    {label}:
                </Text>
            )}
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
                            <Text size="xs" maw="6rem" truncate>
                                {lesson.title || "-"}
                            </Text>
                            <ActionIcon
                                size="xs"
                                variant="light"
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
                                <Badge size="xs" color={typeColor} tt="none">
                                    {lesson?.type}
                                </Badge>
                            )}
                        </Group>
                    </>
                )}
            </Card>
        </Box>
    );
};
