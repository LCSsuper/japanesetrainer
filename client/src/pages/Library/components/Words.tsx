import { Group, Badge, Table, Text, Box, Flex } from "@mantine/core";

import { Word } from "../../../types";

export const Words = ({
    words,
    selectedWordIds,
}: {
    words: Word[];
    selectedWordIds: any;
}) => {
    return (
        <Box>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td>Word</Table.Td>
                        <Table.Td>Translation(s)</Table.Td>
                        <Table.Td visibleFrom="sm">Type and category</Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {words.map((word, index) => (
                        <Table.Tr
                            key={index}
                            bg={
                                selectedWordIds.has(word.id)
                                    ? "var(--mantine-color-cyan-light)"
                                    : undefined
                            }
                        >
                            <Table.Td>
                                <Text>{word.word}</Text>
                                {word.romanization && (
                                    <Text c="dimmed">{word.romanization}</Text>
                                )}
                                <Flex direction="column" gap={4}>
                                    {word.type && (
                                        <Badge
                                            size="xs"
                                            hiddenFrom="sm"
                                            tt="none"
                                        >
                                            {word.type}
                                        </Badge>
                                    )}
                                    {word.category && (
                                        <Badge
                                            size="sm"
                                            color="violet"
                                            hiddenFrom="sm"
                                            tt="none"
                                        >
                                            {word.category}
                                        </Badge>
                                    )}
                                </Flex>
                            </Table.Td>
                            <Table.Td>
                                <Group gap={4}>
                                    {word.translations.join(", ")}
                                </Group>
                            </Table.Td>
                            <Table.Td visibleFrom="sm">
                                <Group gap={4}>
                                    {word.type && (
                                        <Badge size="sm" tt="none">
                                            {word.type}
                                        </Badge>
                                    )}
                                    {word.category && (
                                        <Badge
                                            size="sm"
                                            tt="none"
                                            color="violet"
                                        >
                                            {word.category}
                                        </Badge>
                                    )}
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Box>
    );
};
