import {
    Group,
    Button,
    Box,
    useCombobox,
    Combobox,
    InputBase,
    ActionIcon,
} from "@mantine/core";
import { IconChevronLeft, IconMoon, IconSun } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../hooks/useMobxStores";
import { Language } from "../../types";
import { languages } from "../../constants";

export const Header = observer(
    ({ setDarkMode, darkMode }: { setDarkMode: any; darkMode: boolean }) => {
        const { routerStore, libraryStore } = useMobxStores();
        return (
            <Box className="">
                <header>
                    <Group justify="space-between" h="100%" p={10}>
                        <Box>
                            {routerStore.currentRoute !== "menu" && (
                                <Button
                                    variant="light"
                                    pl={7}
                                    onClick={() =>
                                        routerStore.setCurrentRoute("menu")
                                    }
                                >
                                    <IconChevronLeft />
                                    menu
                                </Button>
                            )}
                        </Box>
                        <Box>
                            <Group gap={"xs"}>
                                <ActionIcon
                                    variant="light"
                                    size={"lg"}
                                    onClick={() => setDarkMode(!darkMode)}
                                >
                                    {darkMode ? <IconSun /> : <IconMoon />}
                                </ActionIcon>
                                <LanguageSelect
                                    disabled={
                                        routerStore.currentRoute === "learner"
                                    }
                                    setLanguage={libraryStore.setLanguage}
                                    language={libraryStore.language}
                                />
                            </Group>
                        </Box>
                    </Group>
                </header>
            </Box>
        );
    }
);

export const LanguageSelect = ({
    disabled,
    language,
    setLanguage,
}: {
    disabled: boolean;
    language: Language;
    setLanguage: any;
}) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = Object.entries(languages).map(([key, value]) => (
        <Combobox.Option value={key} key={key}>
            {value}
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
                setLanguage(val);
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase
                    disabled={disabled}
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                >
                    {languages[language] || "Select language"}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};
