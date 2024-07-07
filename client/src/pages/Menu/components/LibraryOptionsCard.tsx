import {
    Card,
    Text,
    Title,
    Space,
    Group,
    RangeSlider,
    Switch,
    Badge,
    Button,
} from "@mantine/core";
import { IconLibrary, IconInfoCircle } from "@tabler/icons-react";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { observer } from "mobx-react-lite";

export const LibraryOptionsCard = observer(() => {
    const {
        libraryStore: {
            showRomanization,
            setShowRomanization,
            range,
            setRange,
        },
        routerStore: { setCurrentRoute },
        learnerStore: { library },
    } = useMobxStores();

    return (
        <Card shadow="xl">
            <Title order={2}>
                <Group gap={7}>
                    <IconLibrary />
                    <Title order={3}>Library options</Title>
                </Group>
                <Space h={"xs"} />
                <Text c="dimmed">
                    <Group gap={5}>
                        <IconInfoCircle size={18} />
                        {`This library contains ${library.length}
                                            words.`}
                    </Group>
                </Text>
                <Space h={"sm"} />
                <Text>Selected range of words to practice:</Text>
                <RangeSlider
                    min={0}
                    max={library.length}
                    value={range}
                    onChange={(newRange: number[]) => {
                        setRange(newRange[0], newRange[1]);
                    }}
                />
                <Space h={"lg"} />
                <Switch
                    checked={showRomanization}
                    onChange={() => setShowRomanization(!showRomanization)}
                    label="Show romanization"
                />
                <Space h={"sm"} />
                <Group justify="space-between">
                    <Switch disabled checked label="Randomize words" />
                    <Badge color="gray">coming soon</Badge>
                </Group>
                <Space h={"sm"} />
                <Group justify="space-between">
                    <Button
                        variant="gradient"
                        disabled
                        onClick={() => setCurrentRoute("library")}
                    >
                        Open library
                    </Button>
                    <Badge color="gray">work in progress</Badge>
                </Group>
            </Title>
        </Card>
    );
});
