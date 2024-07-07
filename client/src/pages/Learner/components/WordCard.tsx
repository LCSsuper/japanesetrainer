import { Card, Group, Pill, Progress, Space, Text, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";

const wordSize = (width: number) => {
    if (width > 900) return "6rem";
    if (width > 600) return "4rem";
    return "3rem";
};

const wordColor = (guessedCount: number, translationCount: number) => {
    if (guessedCount === 0) return "";
    if (guessedCount === translationCount) return "green";
    return "blue";
};

export const WordCard = observer(() => {
    const { width } = useViewportSize();
    const {
        learnerStore: {
            wordIndex,
            selectedLibrary,
            guessedCount,
            translationCount,
            currentWord,
            guessIsCorrect,
            answerRevealed,
            progressPercentage,
        },
        libraryStore: { showRomanization },
    } = useMobxStores();

    const romanizationVisible =
        showRomanization || guessIsCorrect || answerRevealed;

    return (
        <Card shadow={"xl"}>
            <Group justify="space-between" align="start">
                <Text c="dimmed">Guess:</Text>
                <Group>
                    <Pill>{`${wordIndex + 1} of ${
                        selectedLibrary.length
                    }`}</Pill>
                </Group>
            </Group>
            <Group justify="center">
                <Title
                    size={wordSize(width)}
                    c={wordColor(guessedCount, translationCount)}
                >
                    {currentWord.word}
                </Title>
            </Group>
            <Group justify="center" h={"2rem"}>
                <Text size="xl" c="dimmed">
                    {romanizationVisible && currentWord.description}
                </Text>
            </Group>
            <Space h={"md"} />
            <Progress value={progressPercentage} />
        </Card>
    );
});
