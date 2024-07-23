import {
    Button,
    Group,
    Kbd,
    Space,
    TextInput,
    Text,
    Grid,
    Box,
    Flex,
} from "@mantine/core";
import {
    HotkeyItem,
    getHotkeyHandler,
    useHotkeys,
    useViewportSize,
} from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { useState } from "react";
import { OptionsButton } from "./Options";

const inputSize = (width: number) => {
    if (width > 600) return "xl";
    return "sm";
};

export const AnswerBox = observer(() => {
    const {
        learnerStore: {
            showAnswer,
            nextWord,
            answerRevealed,
            remainingAnswers,
            currentGuess,
            setCurrentGuess,
            canContinue,
            remainingCount,
        },
    } = useMobxStores();
    const { width } = useViewportSize();
    const [error, setError] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const hotkeys: HotkeyItem[] = [
        ["1", () => showAnswer()],
        ["2", () => nextWord()],
        [
            "enter",
            () => {
                if (!canContinue) {
                    onError();
                    return;
                }
                nextWord();
            },
        ],
    ];

    useHotkeys(hotkeys);

    const onError = () => {
        setError(true);
        setCurrentGuess("");

        if (timeoutId) clearTimeout(timeoutId);
        setTimeoutId(
            setTimeout(() => {
                setError(false);
            }, 1000)
        );
    };

    const onFocus = () => {
        setTimeout(() => {
            document.documentElement.scrollTop = 0;
        }, 100);
    };

    const onInputChange = (e: any) => {
        if (!remainingAnswers.length || answerRevealed) return;
        setCurrentGuess(e.target.value);
    };

    const ShowAnswerButton = ({
        fullWidth,
        flex,
    }: {
        fullWidth?: boolean;
        flex?: number;
    }) => (
        <Button
            leftSection={<Kbd>1</Kbd>}
            disabled={answerRevealed || !remainingCount}
            variant="default"
            onClick={showAnswer}
            fullWidth={fullWidth}
            flex={flex}
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
        <Box>
            <Group>
                <form autoComplete="off" style={{ width: "100%" }}>
                    <TextInput
                        autoComplete="off"
                        error={error}
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
                </form>
            </Group>
            <Space h="sm" />
            <Group justify="end">
                <Group visibleFrom="md">
                    <OptionsButton />
                    <ShowAnswerButton />
                    <SkipButton />
                </Group>
                <Grid hiddenFrom="md" w="100%">
                    <Grid.Col span={8}>
                        <Flex gap="md">
                            <OptionsButton />
                            <ShowAnswerButton flex={1} />
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <SkipButton fullWidth />
                    </Grid.Col>
                </Grid>
            </Group>
        </Box>
    );
});
