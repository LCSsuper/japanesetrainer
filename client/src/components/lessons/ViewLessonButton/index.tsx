import { ActionIcon, Group, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Lesson, Translation } from "../../../types";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { IconEye } from "@tabler/icons-react";
import { Translations } from "../../Translations";

export const WordsInLesson = ({
    lesson,
    getWordsInLesson,
}: {
    lesson: Lesson;
    getWordsInLesson: (lesson: Lesson) => Translation[];
}) => <Translations translations={getWordsInLesson(lesson)} />;

export function ViewLessonButton({
    lesson,
    getWordsInLesson: getWordsInLessonProp,
}: {
    lesson: Lesson;
    getWordsInLesson?: (lesson: Lesson) => Translation[];
}) {
    const [opened, { open, close }] = useDisclosure(false);

    const {
        libraryStore: { getWordsInLesson },
    } = useMobxStores();

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap={4}>
                        <Text>{`The lesson `}</Text>
                        <Text fs="italic" fw="bold">
                            {lesson.title}
                        </Text>
                        <Text>{` contains these words:`}</Text>
                    </Group>
                }
                size="xl"
            >
                <WordsInLesson
                    lesson={lesson}
                    getWordsInLesson={getWordsInLessonProp || getWordsInLesson}
                />
            </Modal>
            <Tooltip
                label={"View words in lesson"}
                position="top"
                withArrow
                transitionProps={{ transition: "fade", duration: 300 }}
            >
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
            </Tooltip>
        </>
    );
}
