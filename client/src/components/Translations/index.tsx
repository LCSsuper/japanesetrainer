import {
    Group,
    Badge,
    Table,
    Text,
    Flex,
    Checkbox,
    Center,
} from "@mantine/core";

import { Translation } from "../../types";
import { useInViewport } from "@mantine/hooks";

const TranslationRow = ({
    translation,
    selectable,
    selected,
    onChange,
}: {
    translation: Translation;
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
                        <Text>{translation.word.original}</Text>
                        {translation.word.romanization && (
                            <Text c="dimmed">
                                {translation.word.romanization}
                            </Text>
                        )}
                        <Flex direction="column" gap={4}>
                            {translation.type && (
                                <Badge size="xs" hiddenFrom="sm" tt="none">
                                    {translation.type}
                                </Badge>
                            )}
                            {translation.category && (
                                <Badge
                                    size="sm"
                                    color="violet"
                                    hiddenFrom="sm"
                                    tt="none"
                                >
                                    {translation.category}
                                </Badge>
                            )}
                        </Flex>
                    </Table.Td>
                    <Table.Td>
                        <Group gap={4}>
                            {translation.translations
                                .map((translation) => translation.original)
                                .join(", ")}
                        </Group>
                    </Table.Td>
                    <Table.Td visibleFrom="sm">
                        <Group gap={4}>
                            {translation.type && (
                                <Badge size="sm" tt="none">
                                    {translation.type}
                                </Badge>
                            )}
                            {translation.category && (
                                <Badge size="sm" tt="none" color="violet">
                                    {translation.category}
                                </Badge>
                            )}
                        </Group>
                    </Table.Td>
                </>
            )}
        </Table.Tr>
    );
};

export const Translations = ({
    translations,
    selected,
    selectable,
    onSelectWord,
    onDeselectWord,
}: {
    translations: Translation[];
    selectable?: boolean;
    selected?: Set<string>;
    onSelectWord?: (id: string) => void;
    onDeselectWord?: (id: string) => void;
}) => {
    const wordIds = new Set(translations.map((translation) => translation.id));
    const intersetion = (wordIds as any).intersection(selected || new Set());
    const allSelected =
        intersetion.size === translations.length && translations.length > 0;
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
                                            translations.forEach(
                                                (translation) =>
                                                    onSelectWord(translation.id)
                                            );
                                        } else {
                                            translations.forEach(
                                                (translation) =>
                                                    onDeselectWord(
                                                        translation.id
                                                    )
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
                    {translations.map((translation) => (
                        <TranslationRow
                            key={translation.id}
                            translation={translation}
                            selected={selected?.has(translation.id)}
                            selectable={selectable}
                            onChange={(selected) => {
                                if (!onSelectWord || !onDeselectWord) return;
                                if (selected) onSelectWord(translation.id);
                                else onDeselectWord(translation.id);
                            }}
                        />
                    ))}
                </Table.Tbody>
            </Table>
            {!translations.length && (
                <Center h="10rem" w="100%">
                    <Text c="dimmed" size="sm" fs="italic">
                        wow, such empty...
                    </Text>
                </Center>
            )}
        </>
    );
};
