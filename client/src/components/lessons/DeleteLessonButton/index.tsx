import { ActionIcon, Button, Group, Modal, Tooltip, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Lesson } from "../../../types";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { IconTrash } from "@tabler/icons-react";

export function DeleteLessonButton({ lesson }: { lesson: Lesson }) {
    const [opened, { open, close }] = useDisclosure(false);

    const {
        libraryStore: { deleteLesson },
    } = useMobxStores();

    if (lesson.type !== "custom") {
        return null;
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={
                    // `Are you sure you want to delete lesson '${lesson.title}'?`
                    <Group gap={4}>
                        <Text>{`Are you sure you want to delete lesson `}</Text>
                        <Text fs="italic" fw="bold">
                            {lesson.title}
                        </Text>
                        <Text>{`?`}</Text>
                    </Group>
                }
            >
                <Group justify="end">
                    <Button onClick={close} variant="light">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            deleteLesson(lesson.id);
                            close();
                        }}
                        color="red"
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
            <Tooltip
                label={"Delete lesson"}
                position="top"
                withArrow
                transitionProps={{ transition: "fade", duration: 300 }}
            >
                <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={(e) => {
                        e.stopPropagation();
                        open();
                    }}
                >
                    <IconTrash />
                </ActionIcon>
            </Tooltip>
        </>
    );
}
