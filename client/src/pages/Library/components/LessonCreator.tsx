import { memo, useCallback, useState } from "react";
import {
    Box,
    Combobox,
    Grid,
    Group,
    InputBase,
    Space,
    useCombobox,
    TextInput,
    Text,
    Button,
    Tooltip,
    Card,
    Title,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { v4 } from "uuid";

import { Translations } from "../../../components/Translations";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { SelectedLesson } from "../../../components/lessons/SelectedLesson";
import { CustomLesson } from "../../../types";
import { TransitionOnMount } from "../../../components/generic/TransitionOnMount";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

export const FilterDropdown = ({
    label,
    placeholder,
    disabled,
    value,
    values,
    onChange,
}: {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string;
    values: string[];
    onChange: (value: string) => void;
}) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = values.map((value) => (
        <Combobox.Option value={value} key={value}>
            {value}
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
                onChange(val);
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase
                    label={label}
                    disabled={disabled}
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                >
                    {value || placeholder || "all"}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <Combobox.Option value={""}>all</Combobox.Option>
                    {options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

const LessonForm = memo(
    ({
        types,
        categories,
        onChangeTitle,
        onChangeSearch,
        onChangeFilterType,
        onChangeFilterCategory,
    }: {
        types: string[];
        categories: string[];
        onChangeTitle: (title: string) => void;
        onChangeSearch: (search: string) => void;
        onChangeFilterType: (type: string) => void;
        onChangeFilterCategory: (category: string) => void;
    }) => {
        const [filterType, setFilterType] = useState<string>("");
        const [filterCategory, setFilterCategory] = useState<string>("");

        return (
            <>
                <Title order={4}>Lesson title</Title>
                <Space h="xs" />
                <TextInput
                    maxLength={50}
                    placeholder="What should the lesson be called?"
                    onChange={(e) => {
                        onChangeTitle(e.target.value);
                    }}
                />
                <Space h="xl" />
                <Title order={4}>Select words for this lesson</Title>
                <Space h="md" />
                <Grid>
                    <Grid.Col span={6}>
                        <TextInput
                            placeholder="Search..."
                            onChange={(e) => {
                                onChangeSearch(e.target.value);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <FilterDropdown
                            placeholder="All types"
                            value={filterType}
                            values={types}
                            onChange={(type) => {
                                setFilterType(type);
                                onChangeFilterType(type);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <FilterDropdown
                            placeholder="All categories"
                            value={filterCategory}
                            values={categories}
                            onChange={(category) => {
                                setFilterCategory(category);
                                onChangeFilterCategory(category);
                            }}
                        />
                    </Grid.Col>
                </Grid>
            </>
        );
    },
);

export const LessonCreator = observer(() => {
    const { libraryStore, routerStore } = useMobxStores();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [title, setTitle] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [filterType, setFilterType] = useState<string>("");
    const [filterCategory, setFilterCategory] = useState<string>("");

    const SaveLessonButton = () => {
        let missing: string[] = [];
        if (!title) {
            missing.push("title");
        }
        if (!selectedIds.size) {
            missing.push("words");
        }

        const label = `Missing ${missing.join(" and ")}`;

        return (
            <Tooltip
                disabled={!!title && !!selectedIds.size}
                label={label}
                position="top"
                withArrow
                transitionProps={{ transition: "fade", duration: 300 }}
            >
                <Button
                    leftSection={<IconDeviceFloppy />}
                    variant="primary"
                    disabled={!title || !selectedIds.size}
                    onClick={() => {
                        const lesson: CustomLesson = {
                            title,
                            count: selectedIds.size,
                            id: v4(),
                            type: "custom",
                            wordIds: Array.from(selectedIds),
                        };
                        libraryStore.saveLesson(lesson);
                        routerStore.setCurrentRoute("menu");
                    }}
                >
                    Save lesson
                </Button>
            </Tooltip>
        );
    };

    const filteredSelectedIds = new Set<string>();
    const filteredLibrary = libraryStore.library.filter((word) => {
        if (
            search &&
            (
                word.word.original +
                (word.word.romanization || "") +
                word.translations.join("")
            )
                .toLowerCase()
                .indexOf(search.toLowerCase()) === -1
        ) {
            return false;
        }

        if (filterType && word.type !== filterType) {
            return false;
        }

        if (filterCategory && word.category !== filterCategory) {
            return false;
        }

        if (selectedIds.has(word.id)) {
            filteredSelectedIds.add(word.id);
        }

        return true;
    });

    return (
        <TransitionOnMount>
            <Card
                w="50rem"
                maw="100vw"
                m="1rem"
                shadow="xl"
                radius="lg"
                pb="5rem"
            >
                <Group justify="space-between">
                    <Group>
                        <IconPlus size="2rem" />
                        <Title order={3}>
                            Create new {libraryStore.languageTitle} lesson
                        </Title>
                    </Group>
                    <SaveLessonButton />
                </Group>
                <Box>
                    <Space h="xl" />
                    <LessonForm
                        types={Array.from(libraryStore.counts.types.keys())}
                        categories={Array.from(
                            libraryStore.counts.categories.keys(),
                        )}
                        onChangeTitle={(t: string) => {
                            setTitle(t);
                        }}
                        onChangeSearch={(s: string) => {
                            setSearch(s);
                        }}
                        onChangeFilterType={(type: string) => {
                            setFilterType(type);
                        }}
                        onChangeFilterCategory={(category: string) => {
                            setFilterCategory(category);
                        }}
                    />
                    <Space h="sm" />
                    <Translations
                        selectable
                        translations={filteredLibrary}
                        selected={selectedIds}
                        onSelectWord={useCallback((wordId: string) => {
                            setSelectedIds((prev) => {
                                prev.add(wordId);
                                return new Set(prev);
                            });
                        }, [])}
                        onDeselectWord={useCallback((wordId: string) => {
                            setSelectedIds((prev) => {
                                prev.delete(wordId);
                                return new Set(prev);
                            });
                        }, [])}
                    />
                </Box>
            </Card>
        </TransitionOnMount>
    );
});
