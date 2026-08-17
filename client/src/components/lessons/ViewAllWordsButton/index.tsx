import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { IconEye } from "@tabler/icons-react";
import { Translations } from "../../Translations";
import { capitalize } from "../../../utils/capitalize";

export function ViewAllWordsButton() {
    const [opened, { open, close }] = useDisclosure(false);

    const {
        libraryStore: { library, languageTitle },
    } = useMobxStores();

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap={4}>
                        <Text>{`${capitalize(languageTitle)} contains these words:`}</Text>
                    </Group>
                }
                size="xl"
            >
                <Translations translations={library} />
            </Modal>
            <Button
                variant="subtle"
                leftSection={<IconEye />}
                onClick={(e) => {
                    e.stopPropagation();
                    open();
                }}
            >
                Words
            </Button>
        </>
    );
}
