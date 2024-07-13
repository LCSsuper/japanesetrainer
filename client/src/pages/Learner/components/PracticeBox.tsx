import {
    Badge,
    Box,
    Flex,
    Grid,
    Group,
    Pill,
    Progress,
    Space,
    Text,
    Title,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";

const wordSize = (width: number) => {
    if (width > 1000) return "5rem";
    if (width > 820) return "4rem";
    if (width > 650) return "3rem";
    return "2rem";
};

const textInfoSize = (width: number) => {
    if (width > 820) return "md";
    if (width > 650) return "sm";
    return "xs";
};

const wordColor = (guessedCount: number, translationCount: number) => {
    if (guessedCount === 0) return "";
    if (guessedCount === translationCount) return "green";
    return "blue";
};

const guessesBadgeColor = (guessedCount: number, translationCount: number) => {
    if (guessedCount === 0) return "gray";
    if (guessedCount === translationCount) return "green";
    return "blue";
};

export const PracticeBox = observer(() => {
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
            guessedTranslations,
            remainingAnswers,
        },
        libraryStore: { showRomanization, showWordType },
    } = useMobxStores();
    const { width } = useViewportSize();

    const romanizationVisible =
        showRomanization || guessIsCorrect || answerRevealed;

    return (
        <Box>
            <Flex direction="row" gap="xs" align="center">
                <Progress value={progressPercentage} flex="1" />
                <Pill flex="0">{`${wordIndex + 1} of ${words.length}`}</Pill>
            </Flex>
            <Space h={"sm"} />
            <Grid>
                <Grid.Col span={8}>
                    <Text c="dimmed">What is</Text>
                    <Title
                        size={wordSize(width)}
                        c={wordColor(guessedCount, translationCount)}
                    >
                        {currentWord.word}
                    </Title>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Flex justify="end" direction="column" h="100%">
                        {guessedTranslations.map((t) => (
                            <Group justify="end" pb={5}>
                                <Badge
                                    size={textInfoSize(width)}
                                    color="green"
                                    tt="none"
                                    key={t}
                                >
                                    {t}
                                </Badge>
                            </Group>
                        ))}
                        {answerRevealed &&
                            remainingAnswers.length &&
                            remainingAnswers.map((t) => (
                                <Group justify="end" pb={5}>
                                    <Badge
                                        size={textInfoSize(width)}
                                        color="yellow"
                                        tt="none"
                                        key={t}
                                    >
                                        {t}
                                    </Badge>
                                </Group>
                            ))}
                    </Flex>
                </Grid.Col>
            </Grid>
            <Group justify="space-between">
                <Group>
                    {romanizationVisible && currentWord.romanization && (
                        <Text size={textInfoSize(width)} c="dimmed">
                            {`(${currentWord.romanization})`}
                        </Text>
                    )}
                    {showWordType && currentWord.type && (
                        <Pill size={textInfoSize(width)}>
                            {currentWord.type}
                        </Pill>
                    )}
                </Group>
                <Group gap={5} align="center" justify="end" wrap="nowrap">
                    <Badge
                        size={textInfoSize(width)}
                        color={guessesBadgeColor(
                            guessedCount,
                            translationCount
                        )}
                    >{`${guessedCount} of ${translationCount}`}</Badge>
                    <Text c="dimmed" size={textInfoSize(width)}>
                        answered
                    </Text>
                </Group>
            </Group>
            <Space h={"sm"} />
        </Box>
    );
});
