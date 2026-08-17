import { Text, Title, Space, Box } from "@mantine/core";

export const TitleCard = () => (
    <Box ta="center" pb="xl">
        <Title order={1}>Language Trainer</Title>
        <Space h={"sm"} />
        <Text fs="italic">Learn a new language today!</Text>
    </Box>
);
