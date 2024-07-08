import {
    Badge,
    Button,
    Card,
    Group,
    Kbd,
    Space,
    TextInput,
    Text,
    Grid,
} from "@mantine/core";
import {
    HotkeyItem,
    getHotkeyHandler,
    useHotkeys,
    useViewportSize,
} from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";

const guessesBadgeColor = (guessedCount: number, translationCount: number) => {
    if (guessedCount === 0) return "gray";
    if (guessedCount === translationCount) return "green";
    return "blue";
};

const inputSize = (width: number) => {
    if (width > 600) return "xl";
    return "sm";
};

export const AnswerCard = observer(() => {
    const {
        learnerStore: {
            showAnswer,
            nextWord,
            guessIsCorrect,
            answerRevealed,
            remainingAnswers,
            currentGuess,
            setCurrentGuess,
            canContinue,
            guessedCount,
            translationCount,
            guessedTranslations,
            remainingCount,
        },
    } = useMobxStores();
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

    const onInputChange = (e: any) => {
        if (!remainingAnswers.length || answerRevealed) return;
        setCurrentGuess(e.target.value);
    };

    const Guesses = () => (
        <Group gap={5}>
            <Badge
                size="sm"
                color={guessesBadgeColor(guessedCount, translationCount)}
            >{`${guessedCount} of ${translationCount}`}</Badge>
            {guessedTranslations.map((t) => (
                <Badge size="sm" color="green" tt="none" key={t}>
                    {t}
                </Badge>
            ))}
            {answerRevealed &&
                remainingAnswers.length &&
                remainingAnswers.map((t) => (
                    <Badge size="sm" color="yellow" tt="none" key={t}>
                        {t}
                    </Badge>
                ))}
        </Group>
    );

    const ShowAnswerButton = ({ fullWidth }: { fullWidth?: boolean }) => (
        <Button
            leftSection={<Kbd>1</Kbd>}
            disabled={answerRevealed || !remainingCount}
            variant="default"
            onClick={showAnswer}
            fullWidth={fullWidth}
        >
            Show answer
        </Button>
    );

    const SkipButton = ({ fullWidth }: { fullWidth?: boolean }) => (
        <Button
            leftSection={<Kbd>2</Kbd>}
            variant="light"
            onClick={nextWord}
            fullWidth={fullWidth}
        >
            Skip
        </Button>
    );

    return (
        <Card shadow={"xl"} radius={"md"}>
            <Group>
                <TextInput
                    autoFocus
                    placeholder="Answer..."
                    variant="filled"
                    size={inputSize(width)}
                    w={"100%"}
                    onKeyDown={getHotkeyHandler(hotkeys)}
                    onChange={onInputChange}
                    onFocus={onFocus}
                    value={currentGuess}
                    rightSectionWidth={"10rem"}
                    rightSection={
                        canContinue && (
                            <Group gap="5px" onClick={nextWord}>
                                <Text c="dimmed" size="xs">
                                    Press
                                </Text>
                                <Kbd size="xs">Enter</Kbd>
                                <Text c="dimmed" size="xs">
                                    to continue
                                </Text>
                            </Group>
                        )
                    }
                />
            </Group>
            <Space h={"md"} />
            <Group justify="space-between">
                <Guesses />
                <Group visibleFrom="md">
                    <ShowAnswerButton />
                    <SkipButton />
                </Group>
                <Grid hiddenFrom="md" w="100%">
                    <Grid.Col span={6}>
                        <ShowAnswerButton fullWidth />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <SkipButton fullWidth />
                    </Grid.Col>
                </Grid>
            </Group>
        </Card>
    );
});
