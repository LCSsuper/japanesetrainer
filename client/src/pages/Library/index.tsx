import "react-range-slider-input/dist/style.css";
import {
    Card,
    Grid,
    Space,
    Table,
    Title,
    Text,
    Pill,
    Group,
    Switch,
    Badge,
    Checkbox,
    Affix,
    Button,
    Transition,
    rem,
    Chip,
    RangeSlider,
    Radio,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import {
    IconInfoCircle,
    IconCheckbox,
    IconToggleRight,
    IconLibrary,
    IconArrowUp,
} from "@tabler/icons-react";

import { useMobxStores } from "../../hooks/useMobxStores";
import { useWindowScroll } from "@mantine/hooks";
import { wordTypes } from "../../constants";

const Library = observer(() => {
    const [scroll, scrollTo] = useWindowScroll();
    const {
        libraryStore: {
            showRomanization,
            setShowRomanization,
            showWordType,
            setShowWordType,
            randomize,
            setRandomize,
            range,
            setRange,
            library,
            language,
            selectedWordIds,
            toggleAll,
            hasWordTypeInSelection,
            toggleAllWithWordType,
        },
    } = useMobxStores();

    return (
        <>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={
                                <IconArrowUp
                                    style={{ width: rem(16), height: rem(16) }}
                                />
                            }
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
            <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                <Grid.Col>
                    <Card shadow="xl">
                        <Group>
                            <IconLibrary size="2rem" />
                            <Title order={2}>Library options</Title>
                        </Group>
                        <Space h="sm" />
                        <Text>{`The selected language to practice is ${language}. A selection of words can be made to practice with.`}</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
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
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card shadow="xl">
                        <Group>
                            <IconToggleRight size="2rem" />
                            <Title order={2}>Options</Title>
                        </Group>
                        <Space h="sm" />
                        <Switch
                            label="Show romanization"
                            checked={showRomanization}
                            onChange={() =>
                                setShowRomanization(!showRomanization)
                            }
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
                </Grid.Col>
                <Grid.Col>
                    <Card shadow="xl">
                        <Group justify="space-between" align="start">
                            <Group>
                                <IconCheckbox size="2rem" />
                                <Title order={2}>Word selection</Title>
                            </Group>
                            <Title
                                order={6}
                            >{`${selectedWordIds.size} selected`}</Title>
                        </Group>
                        <Space h="md" />
                        <Group>
                            <Radio label="Select based on range" checked />
                            <Radio label="Make custom selection" disabled />
                            <Badge color="gray">coming soon</Badge>
                        </Group>
                        <Space h="md" />
                        <Text size="sm">
                            Selected range of words to practice:
                        </Text>
                        <RangeSlider
                            min={0}
                            max={library.lang_to_eng.length}
                            value={range}
                            onChange={(newRange: number[]) => {
                                setRange(newRange[0], newRange[1]);
                            }}
                        />
                        <Space h="md" />
                        <Group gap={5}>
                            {wordTypes.map((type) => {
                                const checked = hasWordTypeInSelection(type);

                                return (
                                    <Chip
                                        disabled={!!"WIP"}
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
                        <Space h="md" />
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Td>
                                        <Checkbox
                                            disabled={!!"WIP"}
                                            checked={!!selectedWordIds.size}
                                            onChange={toggleAll}
                                        />
                                    </Table.Td>
                                    <Table.Td>Word</Table.Td>
                                    <Table.Td>Translation(s)</Table.Td>
                                    <Table.Td>Type</Table.Td>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {library.lang_to_eng.map((word, index) => (
                                    <Table.Tr
                                        key={index}
                                        bg={
                                            selectedWordIds.has(word.id)
                                                ? "var(--mantine-color-cyan-light)"
                                                : undefined
                                        }
                                    >
                                        <Table.Td>
                                            <Checkbox
                                                disabled={!!"WIP"}
                                                aria-label="Select word"
                                                checked={selectedWordIds.has(
                                                    word.id
                                                )}
                                                onChange={() => {
                                                    selectedWordIds.has(word.id)
                                                        ? selectedWordIds.delete(
                                                              word.id
                                                          )
                                                        : selectedWordIds.add(
                                                              word.id
                                                          );
                                                }}
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text>{word.word}</Text>
                                            {word.romanization && (
                                                <Text c="dimmed">
                                                    {word.romanization}
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap={4}>
                                                {word.translations.map(
                                                    (translation) => (
                                                        <Pill key={translation}>
                                                            {translation}
                                                        </Pill>
                                                    )
                                                )}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            {word.type && (
                                                <Badge size="sm">
                                                    {word.type}
                                                </Badge>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Card>
                </Grid.Col>
            </Grid>
        </>
    );
});

export default Library;
