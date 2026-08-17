import { Card, CardProps, Center, Text } from "@mantine/core";

export const NoLessonCard = ({ ...props }: CardProps) => {
    return (
        <Card withBorder w="10rem" h="4.5rem" p="sm" {...props}>
            <Center h="100%">
                <Text size="xs" c="dimmed" fs="italic">
                    {"no lesson selected"}
                </Text>
            </Center>
        </Card>
    );
};
