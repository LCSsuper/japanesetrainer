import {
    Badge,
    Box,
    Center,
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
        settingsStore: { showRomanization, showWordType },
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
                        {currentWord.word.original}
                    </Title>
                    <Group h="1.5rem">
                        {romanizationVisible &&
                            currentWord.word.romanization && (
                                <Text size={textInfoSize(width)} c="dimmed">
                                    {`(${currentWord.word.romanization})`}
                                </Text>
                            )}
                        {showWordType && currentWord.type && (
                            <Pill size={textInfoSize(width)}>
                                {currentWord.type}
                            </Pill>
                        )}
                    </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Center h="100%">
                        <Flex direction="column" align="center" gap={5}>
                            <Text c="dimmed">answers:</Text>
                            {Array.from(guessedTranslations.values()).map(
                                (t) => (
                                    <Badge
                                        size={textInfoSize(width)}
                                        color="green"
                                        tt="none"
                                        key={t.original}
                                    >
                                        {`${t.original} ${
                                            t.romanization
                                                ? `(${t.romanization})`
                                                : ""
                                        }`}
                                    </Badge>
                                )
                            )}
                            {!answerRevealed &&
                                remainingAnswers.map((t) => (
                                    <Badge
                                        size={textInfoSize(width)}
                                        tt="none"
                                        key={t.original}
                                        w={"5rem"}
                                    >
                                        ?
                                    </Badge>
                                ))}
                            {answerRevealed &&
                                remainingAnswers.map((t) => (
                                    <Badge
                                        size={textInfoSize(width)}
                                        color="yellow"
                                        tt="none"
                                        key={t.original}
                                    >
                                        {`${t.original} ${
                                            t.romanization
                                                ? `(${t.romanization})`
                                                : ""
                                        }`}
                                    </Badge>
                                ))}
                        </Flex>
                    </Center>
                </Grid.Col>
            </Grid>
            <Space h={"sm"} />
        </Box>
    );
});
