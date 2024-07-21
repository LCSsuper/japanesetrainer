import {
    Group,
    Badge,
    Table,
    Text,
    Flex,
    Checkbox,
    Center,
} from "@mantine/core";

import { Word } from "../../types";
import { useInViewport } from "@mantine/hooks";

const WordRow = ({
    word,
    selectable,
    selected,
    onChange,
}: {
    word: Word;
    selectable?: boolean;
    selected?: boolean;
    onChange?: (selected: boolean) => void;
}) => {
    const { ref, inViewport } = useInViewport();

    return (
        <Table.Tr
            h="4rem"
            ref={ref}
            bg={selected ? "var(--mantine-color-cyan-light)" : undefined}
        >
            {inViewport && (
                <>
                    {selectable && (
                        <Table.Td>
                            <Checkbox
                                checked={selected}
                                onChange={() => {
                                    if (onChange) onChange(!selected);
                                }}
                            />
                        </Table.Td>
                    )}
                    <Table.Td>
                        <Text>{word.word}</Text>
                        {word.romanization && (
                            <Text c="dimmed">{word.romanization}</Text>
                        )}
                        <Flex direction="column" gap={4}>
                            {word.type && (
                                <Badge size="xs" hiddenFrom="sm" tt="none">
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
                        <Group gap={4}>{word.translations.join(", ")}</Group>
                    </Table.Td>
                    <Table.Td visibleFrom="sm">
                        <Group gap={4}>
                            {word.type && (
                                <Badge size="sm" tt="none">
                                    {word.type}
                                </Badge>
                            )}
                            {word.category && (
                                <Badge size="sm" tt="none" color="violet">
                                    {word.category}
                                </Badge>
                            )}
                        </Group>
                    </Table.Td>
                </>
            )}
        </Table.Tr>
    );
};

export const Words = ({
    words,
    selected,
    selectable,
    onSelectWord,
    onDeselectWord,
}: {
    words: Word[];
    selectable?: boolean;
    selected?: Set<string>;
    onSelectWord?: (id: string) => void;
    onDeselectWord?: (id: string) => void;
}) => {
    const wordIds = new Set(words.map((word) => word.id));
    const intersetion = (wordIds as any).intersection(selected || new Set());
    const allSelected = intersetion.size === words.length && words.length > 0;
    const someSelected = (intersetion.size || 0) > 0 && !allSelected;

    return (
        <>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        {selectable && (
                            <Table.Td w="5%">
                                <Checkbox
                                    checked={allSelected || someSelected}
                                    indeterminate={someSelected}
                                    onChange={(e) => {
                                        if (!onSelectWord || !onDeselectWord) {
                                            return;
                                        }

                                        if (e.target.checked && !someSelected) {
                                            words.forEach((word) =>
                                                onSelectWord(word.id)
                                            );
                                        } else {
                                            words.forEach((word) =>
                                                onDeselectWord(word.id)
                                            );
                                        }
                                    }}
                                />
                            </Table.Td>
                        )}
                        <Table.Td w="35%">Word</Table.Td>
                        <Table.Td w="35%">Translation(s)</Table.Td>
                        <Table.Td visibleFrom="sm"></Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {words.map((word) => (
                        <WordRow
                            key={word.id}
                            word={word}
                            selected={selected?.has(word.id)}
                            selectable={selectable}
                            onChange={(selected) => {
                                if (!onSelectWord || !onDeselectWord) return;
                                if (selected) onSelectWord(word.id);
                                else onDeselectWord(word.id);
                            }}
                        />
                    ))}
                </Table.Tbody>
            </Table>
            {!words.length && (
                <Center h="10rem" w="100%">
                    <Text c="dimmed" size="sm" fs="italic">
                        wow, such empty...
                    </Text>
                </Center>
            )}
        </>
    );
};
