import { Card, Group, Space, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import { Language, Library } from "../../../types";

export const InfoCard = ({
    library,
    language,
}: {
    library: Library;
    language: Language;
}) => (
    <Card shadow="xl">
        <Group>
            <IconInfoCircle size="2rem" />
            <Title order={2}>Information</Title>
        </Group>
        <Space h="sm" />
        <Group gap={4}>
            <Text c="dimmed">This library contains</Text>
            <Text>{library.lang_to_eng.length}</Text>
            <Text c="dimmed">{`${language} words`}</Text>
        </Group>
        <Group gap={4}>
            <Text c="dimmed">This library contains</Text>
            <Text>{library.eng_to_lang.length}</Text>
            <Text c="dimmed">english words</Text>
        </Group>
        <Space h="xs" />
        <Text c="dimmed" size="xs">
            There can be a difference because
        </Text>
        <Text c="dimmed" size="xs">
            words can have multiple translations
        </Text>
    </Card>
);
