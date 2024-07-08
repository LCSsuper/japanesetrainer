import { Card, Text, Title, Space, Group, Badge, Button } from "@mantine/core";
import { IconBooks } from "@tabler/icons-react";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { observer } from "mobx-react-lite";

const ToggleInfo = ({ enabled, text }: { enabled: boolean; text: string }) => (
    <Group gap={5} pb=".2rem">
        <Text c="dimmed" size="xs">
            {text}
        </Text>
        <Badge color={enabled ? "cyan" : "gray"} size="xs">
            {enabled ? "on" : "off"}
        </Badge>
    </Group>
);

export const LibraryInfoCard = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        libraryStore: {
            library,
            practiceLibrary,
            showRomanization,
            showWordType,
            randomize,
        },
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
                    {`This library contains ${library.lang_to_eng.length}
                                            words.`}
                </Text>
                <Text c="dimmed" size="sm">
                    {`The practice selection contains ${practiceLibrary.lang_to_eng.length}
                                            words.`}
                </Text>
                <Space h={"sm"} />
                <ToggleInfo
                    enabled={showRomanization}
                    text="Show romanization is"
                />
                <ToggleInfo enabled={showWordType} text="Show word type is" />
                <ToggleInfo enabled={randomize} text="Randomize words is" />
                <Space h={"sm"} />
                <Group>
                    <Button
                        variant="gradient"
                        onClick={() => setCurrentRoute("library")}
                    >
                        Library options
                    </Button>
                    <Badge color="gray">beta</Badge>
                </Group>
            </Title>
        </Card>
    );
});
