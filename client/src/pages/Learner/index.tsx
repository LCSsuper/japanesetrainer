import { observer } from "mobx-react-lite";
import { useMobxStores } from "../../hooks/useMobxStores";
import {
    Badge,
    Box,
    Button,
    Card,
    Center,
    Grid,
    Group,
    Kbd,
    Pill,
    Progress,
    Space,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {
    HotkeyItem,
    getHotkeyHandler,
    useHotkeys,
    useViewportSize,
} from "@mantine/hooks";

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

const guessesBadgeColor = (guessedCount: number, translationCount: number) => {
    if (guessedCount === 0) return "gray";
    if (guessedCount === translationCount) return "green";
    return "blue";
};

const Learner = observer(() => {
    const {
        learnerStore: {
            currentWord,
            nextWord,
            setCurrentGuess,
            currentGuess,
            guessIsCorrect,
            answerRevealed,
            showAnswer,
            selectedLibrary,
            wordIndex,
            guessedTranslations,
            remainingAnswers,
            guessedCount,
            translationCount,
            remainingCount,
            canContinue,
            progressPercentage,
            englishToLanguage,
        },
        settingsStore: { showDescription },
    } = useMobxStores();

    const onInputChange = (e: any) => {
        if (!remainingAnswers.length || answerRevealed) return;
        setCurrentGuess(e.target.value);
    };

    const { width } = useViewportSize();

    const hotkeys: HotkeyItem[] = [
        ["1", () => showAnswer()],
        ["2", () => nextWord()],
        [
            "enter",
            () => {
                if (!guessIsCorrect && !answerRevealed) return;
                nextWord();
            },
        ],
    ];

    useHotkeys(hotkeys);

    const onFocus = () => {
        setTimeout(() => {
            document.documentElement.scrollTop = 0;
        }, 100);
    };

    return (
        <Box>
            <Center>
                <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                    <Grid.Col>
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
                                    c={wordColor(
                                        guessedCount,
                                        translationCount
                                    )}
                                >
                                    {currentWord.word}
                                </Title>
                            </Group>
                            <Group justify="center" h={"2rem"}>
                                <Text size="xl" c="dimmed">
                                    {englishToLanguage ||
                                    showDescription ||
                                    guessIsCorrect ||
                                    answerRevealed
                                        ? currentWord.description
                                        : ""}
                                </Text>
                            </Group>
                            <Space h={"md"} />
                            <Progress value={progressPercentage} />
                        </Card>
                    </Grid.Col>
                    <Grid.Col>
                        <Card shadow={"xl"} radius={"md"}>
                            <Group>
                                <TextInput
                                    autoFocus
                                    placeholder="Answer..."
                                    variant="filled"
                                    size="xl"
                                    w={"100%"}
                                    onKeyDown={getHotkeyHandler(hotkeys)}
                                    onChange={onInputChange}
                                    onFocus={onFocus}
                                    value={currentGuess}
                                    rightSectionWidth={"12rem"}
                                    rightSection={
                                        canContinue && (
                                            <Group gap="5px">
                                                <Text c="dimmed" size="sm">
                                                    Press
                                                </Text>
                                                <Kbd>Enter</Kbd>
                                                <Text c="dimmed" size="sm">
                                                    to continue
                                                </Text>
                                            </Group>
                                        )
                                    }
                                />
                            </Group>
                            <Space h={"md"} />
                            <Group justify="space-between">
                                <Group>
                                    <Badge
                                        color={guessesBadgeColor(
                                            guessedCount,
                                            translationCount
                                        )}
                                    >{`${guessedCount} of ${translationCount}`}</Badge>
                                    {guessIsCorrect && (
                                        <Group gap={5}>
                                            <Text c="dimmed">Guessed: </Text>
                                            {guessedTranslations.map((t) => (
                                                <Pill ml={0}>{t}</Pill>
                                            ))}
                                        </Group>
                                    )}
                                    {answerRevealed &&
                                        remainingAnswers.length && (
                                            <Group gap={5}>
                                                <Text c="dimmed">
                                                    Not guessed:{" "}
                                                </Text>
                                                {remainingAnswers.map((t) => (
                                                    <Pill ml={0}>{t}</Pill>
                                                ))}
                                            </Group>
                                        )}
                                </Group>

                                <Group>
                                    <Button
                                        leftSection={<Kbd>1</Kbd>}
                                        disabled={
                                            answerRevealed || !remainingCount
                                        }
                                        variant="default"
                                        onClick={showAnswer}
                                    >
                                        Show answer
                                    </Button>
                                    <Button
                                        leftSection={<Kbd>2</Kbd>}
                                        variant="light"
                                        onClick={nextWord}
                                    >
                                        Skip
                                    </Button>
                                </Group>
                            </Group>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Center>
        </Box>
    );
});

export default Learner;
