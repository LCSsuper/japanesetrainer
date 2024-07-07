import {
    Badge,
    Button,
    Card,
    Divider,
    Group,
    Text,
    Title,
} from "@mantine/core";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { PracticeMode } from "../../../types";

const PracticeTitle = ({
    flag,
    mode,
}: {
    flag: string;
    mode: PracticeMode;
}) => {
    if (mode === "lang_to_eng") {
        return <Title order={2}>{`Practice ${flag} to 🇺🇸`}</Title>;
    }

    return <Title order={2}>{`Practice 🇺🇸 to ${flag}`}</Title>;
};

const DifficultyBadge = ({ mode }: { mode: PracticeMode }) => {
    if (mode === "lang_to_eng") {
        return <Badge color="green">easy</Badge>;
    }

    return <Badge color="orange">hard</Badge>;
};

const PracticeText = ({
    language,
    mode,
}: {
    language: string;
    mode: PracticeMode;
}) => {
    if (mode === "lang_to_eng") {
        return (
            <Text>
                {`The words are shown in ${language} and
                you have to type the translation in
                english.`}
            </Text>
        );
    }

    return (
        <Text>
            {`The words are shown in english and
            you have to type the translation in
            ${language}.`}
        </Text>
    );
};

export const PracticeCard = observer(({ mode }: { mode: PracticeMode }) => {
    const {
        libraryStore: { flag, language },
        learnerStore: { reset, setPracticeMode },
        routerStore: { setCurrentRoute },
    } = useMobxStores();

    return (
        <Card shadow="xl">
            <Group justify="space-between" align="top">
                <PracticeTitle flag={flag} mode={mode} />
                <DifficultyBadge mode={mode} />
            </Group>
            <Divider />
            <PracticeText language={language} mode={mode} />
            <Group justify="space-between" align="end" pt={5}>
                <Text c="dimmed" size="xs">
                    {mode === "eng_to_lang" && (
                        <>
                            Can contain more words <br />
                            due to multiple translations
                        </>
                    )}
                </Text>
                <Button
                    variant="gradient"
                    onClick={() => {
                        setPracticeMode(mode);
                        reset();
                        setCurrentRoute("learner");
                    }}
                >
                    Practice!
                </Button>
            </Group>
        </Card>
    );
});
