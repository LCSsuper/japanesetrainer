import { Card, Text, Title, Space, Group, Button } from "@mantine/core";
import { IconBooks } from "@tabler/icons-react";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { observer } from "mobx-react-lite";

export const LibraryInfoCard = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        libraryStore: { library, practiceLibrary, language },
    } = useMobxStores();

    return (
        <Card shadow="xl">
            <Title order={2}>
                <Group gap={7}>
                    <IconBooks />
                    <Title order={3}>Library</Title>
                </Group>
                <Space h={"xs"} />
                <Text c="dimmed" size="sm">
                    {`The selected library is ${language}.`}
                </Text>
                <Text c="dimmed" size="sm">
                    {`This library contains ${library.lang_to_eng.length}
                                            words.`}
                </Text>
                <Text c="dimmed" size="sm">
                    {`The practice selection contains ${practiceLibrary.lang_to_eng.length}
                                            words.`}
                </Text>
                <Space h={"sm"} />
                <Space h={"sm"} />
                <Group justify="end">
                    <Button
                        variant="gradient"
                        onClick={() => setCurrentRoute("library")}
                    >
                        Library options
                    </Button>
                </Group>
            </Title>
        </Card>
    );
});
