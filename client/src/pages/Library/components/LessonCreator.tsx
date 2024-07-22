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
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { v4 } from "uuid";

import { Words } from "../../../components/Words";
import { useMobxStores } from "../../../hooks/useMobxStores";
import { SelectedLesson } from "../../../components/SelectedLesson";
import { CustomLesson, Lesson } from "../../../types";

export const FilterDropdown = ({
    label,
    disabled,
    value,
    values,
    onChange,
}: {
    label?: string;
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
                    {value || "Filter..."}
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
        onChangeFilterType,
        onChangeFilterCategory,
    }: {
        types: string[];
        categories: string[];
        onChangeTitle: (title: string) => void;
        onChangeFilterType: (type: string) => void;
        onChangeFilterCategory: (category: string) => void;
    }) => {
        const [filterType, setFilterType] = useState<string>("");
        const [filterCategory, setFilterCategory] = useState<string>("");

        return (
            <>
                <TextInput
                    label="Lesson title"
                    maxLength={50}
                    placeholder="Enter lesson title..."
                    onChange={(e) => {
                        onChangeTitle(e.target.value);
                    }}
                />
                <Space h="lg" />
                <Grid>
                    <Grid.Col span={6}>
                        <FilterDropdown
                            label="Filter by type"
                            value={filterType}
                            values={types}
                            onChange={useCallback((type) => {
                                setFilterType(type);
                            }, [])}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <FilterDropdown
                            label="Filter by category"
                            value={filterCategory}
                            values={categories}
                            onChange={useCallback((category) => {
                                setFilterCategory(category);
                            }, [])}
                        />
                    </Grid.Col>
                </Grid>
            </>
        );
    }
);

export const LessonCreator = observer(
    ({ onCreateLesson }: { onCreateLesson: (lesson: Lesson) => void }) => {
        const { libraryStore } = useMobxStores();
        const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
        const [title, setTitle] = useState<string>("");
        const [filterType, setFilterType] = useState<string>("");
        const [filterCategory, setFilterCategory] = useState<string>("");

        const Preview = () => (
            <SelectedLesson
                label="preview"
                lesson={{
                    title,
                    count: selectedIds.size,
                    id: "tbd",
                    type: "custom",
                    wordIds: [],
                }}
                getWordsInLesson={() =>
                    libraryStore.library.filter((word) =>
                        selectedIds.has(word.id)
                    )
                }
            />
        );

        const SaveLessonButton = ({ fixedWidth }: { fixedWidth?: boolean }) => (
            <Tooltip
                disabled={!!title && !!selectedIds.size}
                label={"Missing title / words"}
                position="bottom"
            >
                <Button
                    w={fixedWidth ? "10rem" : undefined}
                    variant="gradient"
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
                        onCreateLesson(lesson);
                    }}
                >
                    Save lesson
                </Button>
            </Tooltip>
        );

        const filteredSelectedIds = new Set<string>();
        const filteredLibrary = libraryStore.library.filter((word) => {
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
            <Box>
                <Space h="sm" />
                <Grid>
                    <Grid.Col hiddenFrom="sm">
                        <Group justify="space-between" align="end">
                            <SaveLessonButton />
                            <Preview />
                        </Group>
                    </Grid.Col>
                    <Grid.Col hiddenFrom="sm">
                        <LessonForm
                            types={Array.from(libraryStore.counts.types.keys())}
                            categories={Array.from(
                                libraryStore.counts.categories.keys()
                            )}
                            onChangeTitle={(t: string) => {
                                setTitle(t);
                            }}
                            onChangeFilterType={(type: string) => {
                                setFilterType(type);
                            }}
                            onChangeFilterCategory={(category: string) => {
                                setFilterCategory(category);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={6} visibleFrom="sm">
                        <LessonForm
                            types={Array.from(libraryStore.counts.types.keys())}
                            categories={Array.from(
                                libraryStore.counts.categories.keys()
                            )}
                            onChangeTitle={(t: string) => {
                                setTitle(t);
                            }}
                            onChangeFilterType={(type: string) => {
                                setFilterType(type);
                            }}
                            onChangeFilterCategory={(category: string) => {
                                setFilterCategory(category);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={6} visibleFrom="sm">
                        <Group justify="end">
                            <Preview />
                        </Group>
                        <Space h="sm" />
                        <Group justify="end">
                            <SaveLessonButton fixedWidth />
                        </Group>
                    </Grid.Col>
                </Grid>
                <Space h="sm" />
                <Text c="dimmed" size="sm" fs="italic">
                    {`Words in filter: ${filteredLibrary.length}`}
                </Text>
                <Space h="xs" />
                <Words
                    selectable
                    words={filteredLibrary}
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
        );
    }
);
