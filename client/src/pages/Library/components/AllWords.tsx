import { useState } from "react";
import { Center, Space, Text, TextInput } from "@mantine/core";

import { Words } from "../../../components/Words";
import { Word } from "../../../types";

const Search = ({
    onChangeSearch,
}: {
    onChangeSearch: (value: string) => void;
}) => {
    return (
        <TextInput
            label="Search words"
            placeholder="Search..."
            onChange={(e) => onChangeSearch(e.currentTarget.value)}
        />
    );
};

export const AllWords = ({ library }: { library: Word[] }) => {
    const [search, setSearch] = useState<string>("");

    const filteredLibrary = library.filter(
        (word) =>
            !search ||
            (word.word + (word.romanization || "") + word.translations.join(""))
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
    );

    return (
        <>
            <Center h="3rem">
                <Text c="dimmed" fs="italic">
                    {`There are ${library.length} words.`}
                </Text>
            </Center>
            <Search
                onChangeSearch={(s) => {
                    setSearch(s);
                }}
            />
            <Space h="xs" />
            <Words words={filteredLibrary} />
        </>
    );
};
