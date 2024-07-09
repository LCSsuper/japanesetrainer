import { Card, Group, Space, Switch, Title } from "@mantine/core";
import { IconToggleRight } from "@tabler/icons-react";

export const OptionsCard = ({
    showRomanization,
    setShowRomanization,
    showWordType,
    setShowWordType,
    randomize,
    setRandomize,
}: {
    showRomanization: boolean;
    setShowRomanization: any;
    showWordType: boolean;
    setShowWordType: any;
    randomize: boolean;
    setRandomize: any;
}) => {
    return (
        <Card shadow="xl">
            <Group>
                <IconToggleRight size="2rem" />
                <Title order={3}>Practice options</Title>
            </Group>
            <Space h="sm" />
            <Switch
                label="Show romanization"
                checked={showRomanization}
                onChange={() => setShowRomanization(!showRomanization)}
            />
            <Space h="sm" />
            <Switch
                label="Show word type"
                checked={showWordType}
                onChange={() => setShowWordType(!showWordType)}
            />
            <Space h="sm" />
            <Switch
                label="Randomize words"
                checked={randomize}
                onChange={() => setRandomize(!randomize)}
            />
            <Space h="xs" />
        </Card>
    );
};
