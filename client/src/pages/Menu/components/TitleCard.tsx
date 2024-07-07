import { Card, Text, Title, Space } from "@mantine/core";

export const TitleCard = () => (
    <Card shadow="xl">
        <Title order={1}>Language Trainer</Title>
        <Space h={"sm"} />
        <Text>
            The easiest way to start learning a language is by practicing common
            words. This way you can quickly build a vocabulary and start
            speaking the language.
        </Text>
    </Card>
);
