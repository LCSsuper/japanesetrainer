import "react-range-slider-input/dist/style.css";
import { Card, Grid, Space, Table, Title, Text, Pill } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../hooks/useMobxStores";

const Library = observer(() => {
    const { libraryStore } = useMobxStores();

    return (
        <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
            <Grid.Col>
                <Card>
                    <Title>Library</Title>
                    <Space h="md" />
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Td></Table.Td>
                                <Table.Td>Word</Table.Td>
                                <Table.Td>Translation(s)</Table.Td>
                                <Table.Td>type</Table.Td>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {libraryStore.library.lang_to_eng.map(
                                (word, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{index + 1}</Table.Td>
                                        <Table.Td>
                                            <Text>{word.word}</Text>
                                            {word.description && (
                                                <Text c="dimmed">
                                                    {word.description}
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <Text>
                                                {word.translation.join(", ")}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Pill>{word.type || "?"}</Pill>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Grid.Col>
        </Grid>
    );
});

export default Library;
