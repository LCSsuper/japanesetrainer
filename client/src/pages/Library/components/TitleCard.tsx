import { Card, Group, Space, Text, Title } from "@mantine/core";
import { IconLibrary } from "@tabler/icons-react";

import { Language } from "../../../types";

export const TitleCard = ({ language }: { language: Language }) => (
    <Card shadow="xl">
        <Group>
            <IconLibrary size="2rem" />
            <Title order={3}>Library options</Title>
        </Group>
        <Space h="sm" />
        <Text>{`The selected language to practice is ${language}. A selection of words can be made to practice with.`}</Text>
    </Card>
);
