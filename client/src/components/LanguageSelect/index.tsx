import { useCombobox, Combobox, InputBase } from "@mantine/core";
import { languages } from "../../constants";
import { Language } from "../../types";

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
