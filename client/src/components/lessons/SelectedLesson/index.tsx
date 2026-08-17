import { Text, Box } from "@mantine/core";
import { Lesson } from "../../../types";
import { NoLessonCard } from "../NoLessonCard";
import { LessonCard } from "../LessonCard";

export const SelectedLesson = ({
    lesson,
    label,
}: {
    lesson?: Lesson;
    label?: string;
}) => {
    return (
        <Box>
            {label && (
                <Text c="dimmed" size="sm" fs="italic">
                    {label}:
                </Text>
            )}
            {!lesson && <NoLessonCard />}
            {lesson && <LessonCard lesson={lesson} />}
        </Box>
    );
};
