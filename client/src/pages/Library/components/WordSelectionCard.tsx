import {
    Card,
    Group,
    Title,
    Space,
    Radio,
    Badge,
    RangeSlider,
    Chip,
    Table,
    Checkbox,
    Pill,
    Text,
    Box,
} from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { wordTypes } from "../../../constants";
import { useMobxStores } from "../../../hooks/useMobxStores";

export const WordSelectionCard = observer(() => {
    const {
        libraryStore: {
            library,
            selectedWordIds,
            range,
            setRange,
            hasWordTypeInSelection,
            toggleAllWithWordType,
            toggleAll,
            toggleWord,
            selectionMode,
            setSelectionMode,
            selectedWordCount,
            isSelected,
        },
    } = useMobxStores();

    return (
        <Card shadow="xl">
            <Group justify="space-between" align="start">
                <Group>
                    <IconCheckbox size="2rem" />
                    <Title order={2}>Word selection</Title>
                </Group>
                <Title order={6}>{`${selectedWordCount} selected`}</Title>
            </Group>
            <Space h="md" />
            <Group>
                <Radio
                    size="xs"
                    label="Select based on range"
                    checked={selectionMode === "range"}
                    onChange={() => setSelectionMode("range")}
                />
                <Radio
                    size="xs"
                    label="Make custom selection"
                    checked={selectionMode === "custom"}
                    onChange={() => setSelectionMode("custom")}
                />
            </Group>
            <Box h="6rem">
                <Space h="md" />
                {selectionMode === "range" && (
                    <>
                        <Text size="sm">
                            Selected range of words to practice:
                        </Text>
                        <RangeSlider
                            min={0}
                            max={library.lang_to_eng.length}
                            minRange={1}
                            defaultValue={range}
                            onChangeEnd={(newRange: number[]) => {
                                setRange(newRange[0], newRange[1]);
                            }}
                        />
                    </>
                )}
                {selectionMode === "custom" && (
                    <>
                        <Text size="sm">Select word types:</Text>
                        <Group gap={5}>
                            {wordTypes.map((type) => {
                                const checked = hasWordTypeInSelection(type);

                                return (
                                    <Chip
                                        checked={checked}
                                        onClick={() =>
                                            toggleAllWithWordType(type)
                                        }
                                        size="xs"
                                        key={type}
                                    >{`${type}s`}</Chip>
                                );
                            })}
                        </Group>
                        <Space h="xs" />
                    </>
                )}
            </Box>
            <Space h="md" />
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td>
                            <Checkbox
                                disabled={selectionMode === "range"}
                                indeterminate={
                                    !!selectedWordIds.size &&
                                    selectedWordIds.size !==
                                        library.lang_to_eng.length
                                }
                                checked={!!selectedWordIds.size}
                                onChange={toggleAll}
                            />
                        </Table.Td>
                        <Table.Td>Word</Table.Td>
                        <Table.Td>Translation(s)</Table.Td>
                        <Table.Td visibleFrom="sm">Type</Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {library.lang_to_eng.map((word, index) => (
                        <Table.Tr
                            key={index}
                            bg={
                                isSelected(word.id, index)
                                    ? "var(--mantine-color-cyan-light)"
                                    : undefined
                            }
                        >
                            <Table.Td>
                                <Checkbox
                                    disabled={selectionMode === "range"}
                                    aria-label="Select word"
                                    checked={isSelected(word.id, index)}
                                    onChange={() => toggleWord(word.id)}
                                />
                            </Table.Td>
                            <Table.Td>
                                <Text>{word.word}</Text>
                                {word.romanization && (
                                    <Text c="dimmed">{word.romanization}</Text>
                                )}
                                {word.type && (
                                    <Badge size="xs" hiddenFrom="sm">
                                        {word.type}
                                    </Badge>
                                )}
                            </Table.Td>
                            <Table.Td>
                                <Group gap={4}>
                                    {word.translations.map((translation) => (
                                        <Pill key={translation}>
                                            {translation}
                                        </Pill>
                                    ))}
                                </Group>
                            </Table.Td>
                            <Table.Td visibleFrom="sm">
                                {word.type && (
                                    <Badge size="sm">{word.type}</Badge>
                                )}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Card>
    );
});
