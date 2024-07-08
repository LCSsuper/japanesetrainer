import { Card, Group, Pill, Progress, Space, Text, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";

const wordSize = (width: number) => {
    if (width > 900) return "6rem";
    if (width > 600) return "4rem";
    return "2rem";
};

const romanizationBoxSize = (width: number) => {
    if (width > 600) return "2rem";
    return "1rem";
};

const romanizationSize = (width: number) => {
    if (width > 600) return "xl";
    return "sm";
};

const wordColor = (guessedCount: number, translationCount: number) => {
    if (guessedCount === 0) return "";
    if (guessedCount === translationCount) return "green";
    return "blue";
};

export const WordCard = observer(() => {
    const {
        learnerStore: {
            wordIndex,
            words,
            guessedCount,
            translationCount,
            currentWord,
            guessIsCorrect,
            answerRevealed,
            progressPercentage,
        },
        libraryStore: { showRomanization, showWordType },
    } = useMobxStores();
    const { width } = useViewportSize();

    const romanizationVisible =
        showRomanization || guessIsCorrect || answerRevealed;

    return (
        <Card shadow={"xl"}>
            <Group justify="space-between" align="start">
                <Text c="dimmed">Guess:</Text>
                <Group>
                    {showWordType && currentWord.type && (
                        <Pill>{currentWord.type}</Pill>
                    )}
                    <Pill>{`${wordIndex + 1} of ${words.length}`}</Pill>
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
            <Group justify="center" h={romanizationBoxSize(width)}>
                <Text size={romanizationSize(width)} c="dimmed">
                    {romanizationVisible && currentWord.romanization}
                </Text>
            </Group>
            <Space h={"md"} />
            <Progress value={progressPercentage} />
        </Card>
    );
});
