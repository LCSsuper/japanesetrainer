import {
    Card,
    Group,
    Space,
    Badge,
    Text,
    Flex,
    CardProps,
} from "@mantine/core";
import { Lesson } from "../../../types";
import { ViewLessonButton } from "../ViewLessonButton";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { IconSchool } from "@tabler/icons-react";
import { DeleteLessonButton } from "../DeleteLessonButton";

const WordCount = ({ count }: { count: number }) => (
    <Text c="dimmed" size="xs">{`${count} words`}</Text>
);

const LessonTypeBadge = ({ type }: { type: Lesson["type"] }) => {
    let typeColor = "cyan";
    if (type === "category") {
        typeColor = "violet";
    }
    if (type === "custom") {
        typeColor = "lime";
    }

    return (
        <Badge size="xs" color={typeColor} tt="none">
            {type}
        </Badge>
    );
};

export const LessonCard = ({
    lesson,
    onSelect,
    selected,
    hideDelete = false,
    ...props
}: {
    lesson: Lesson;
    onSelect?: (id: string) => void;
    selected?: boolean;
    hideDelete?: boolean;
} & CardProps) => {
    const {
        libraryStore: { getWordsInLesson },
    } = useMobxStores();

    return (
        <Card
            withBorder
            w="10rem"
            h="4.5rem"
            p="sm"
            {...props}
            onClick={() => onSelect?.(lesson.id)}
            styles={{
                root: {
                    cursor: onSelect ? "pointer" : "default",
                    borderColor: selected ? "cyan" : "gray",
                    backgroundColor: selected
                        ? "light-dark(var(--mantine-color-cyan-light), var(--mantine-color-cyan-light))"
                        : "transparent",
                    transform: selected ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.2s ease-in-out",
                },
            }}
        >
            <Flex justify="space-between" align="center" gap="xs">
                <Group
                    gap={8}
                    maw="calc(100% - 2rem)"
                    style={{ overflow: "hidden" }}
                    wrap="nowrap"
                >
                    <Group w="1rem">
                        <IconSchool size={19} />
                    </Group>
                    <Text size="xs" truncate>
                        {lesson.title || "-"}
                    </Text>
                </Group>
                <Group gap="xs">
                    {!hideDelete && <DeleteLessonButton lesson={lesson} />}
                    <ViewLessonButton
                        lesson={lesson}
                        getWordsInLesson={getWordsInLesson}
                    />
                </Group>
            </Flex>
            <Space h="xs" />
            <Group justify="space-between">
                <WordCount count={lesson.count} />
                <LessonTypeBadge type={lesson.type} />
            </Group>
        </Card>
    );
};
