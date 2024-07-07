import {
    Group,
    Button,
    Box,
    useCombobox,
    Combobox,
    InputBase,
    ActionIcon,
} from "@mantine/core";
import {
    IconChevronLeft,
    IconLamp,
    IconLampOff,
    IconSettings,
} from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../hooks/useMobxStores";
import { Language } from "../../types";

export const Header = observer(
    ({ setDarkMode, darkMode }: { setDarkMode: any; darkMode: boolean }) => {
        const {
            routerStore: { currentRoute, setCurrentRoute },
            libraryStore: { language, setLanguage },
        } = useMobxStores();
        return (
            <Box className="">
                <header>
                    <Group justify="space-between" h="100%" p={10}>
                        <Box>
                            {currentRoute !== "menu" && (
                                <Button
                                    variant="light"
                                    pl={7}
                                    onClick={() => setCurrentRoute("menu")}
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
                                    {darkMode ? <IconLamp /> : <IconLampOff />}
                                </ActionIcon>
                                <ActionIcon disabled size={"lg"}>
                                    <IconSettings />
                                </ActionIcon>
                                <LanguageSelect
                                    disabled={currentRoute === "learner"}
                                    setLanguage={setLanguage}
                                    language={language}
                                />
                            </Group>
                        </Box>
                    </Group>
                </header>
            </Box>
        );
    }
);

const languages = {
    korean: "🇰🇷 korean",
    japanese: "🇯🇵 japanese",
    spanish: "🇪🇸 spanish",
    swedish: "🇸🇪 swedish",
    arabic: "🇦🇪 arabic",
};

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
