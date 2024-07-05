import { observer } from "mobx-react-lite";
import { useMobxStores } from "../../hooks/useMobxStores";
import {
    Badge,
    Box,
    Button,
    Card,
    Center,
    Divider,
    Grid,
    Group,
    RangeSlider,
    Space,
    Switch,
    Text,
    Title,
} from "@mantine/core";
import { IconInfoCircle, IconLibrary } from "@tabler/icons-react";

const Menu = observer(() => {
    const {
        routerStore: { setCurrentRoute },
        learnerStore: { reset, setEnglishToLanguage, library },
        settingsStore: {
            flag,
            language,
            showDescription,
            setShowDescription,
            range,
            setRange,
        },
    } = useMobxStores();

    return (
        <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
            <Grid.Col span={6}>
                <Card shadow="xl">
                    <Title order={1}>Language Trainer</Title>
                    <Space h={"sm"} />
                    <Text>
                        The easiest way to start learning a language is by
                        practicing common words. This way you can quickly build
                        a vocabulary and start speaking the language.
                    </Text>
                    <Space h={"xl"} />
                    <Title order={2}>
                        <Group gap={7}>
                            <IconLibrary />
                            <Title order={3}>Library options</Title>
                        </Group>
                        <Space h={"xs"} />
                        <Text c="dimmed">
                            <Group gap={5}>
                                <IconInfoCircle size={18} />
                                {`This library contains ${library.length}
                                        words.`}
                            </Group>
                        </Text>
                        <Space h={"sm"} />
                        <Text>Selected range of words to practice:</Text>
                        <RangeSlider
                            min={0}
                            max={library.length}
                            value={range}
                            onChange={(newRange: number[]) => {
                                setRange(newRange[0], newRange[1]);
                            }}
                        />
                        <Space h={"lg"} />
                        <Switch
                            checked={showDescription}
                            onChange={() =>
                                setShowDescription(!showDescription)
                            }
                            label="Show romanization"
                        />
                        <Space h={"sm"} />
                        <Group justify="space-between">
                            <Switch disabled checked label="Randomize words" />
                            <Badge color="gray">coming soon</Badge>
                        </Group>
                        <Space h={"sm"} />
                        <Group justify="space-between">
                            <Button disabled variant="gradient">
                                Open library
                            </Button>
                            <Badge color="gray">coming soon</Badge>
                        </Group>
                    </Title>
                </Card>
            </Grid.Col>
            <Grid.Col span={6}>
                <Grid>
                    <Grid.Col>
                        <Card shadow="xl">
                            <Group justify="space-between" align="top">
                                <Title
                                    order={2}
                                >{`Practice ${flag} to 🇺🇸`}</Title>
                                <Badge color="green">easy</Badge>
                            </Group>
                            <Divider />
                            <Text>
                                {`The words are shown in ${language} and
                                        you have to type the translation in
                                        english.`}
                            </Text>
                            <Group justify="right" pt={5}>
                                <Button
                                    variant="gradient"
                                    onClick={() => {
                                        setEnglishToLanguage(false);
                                        reset();
                                        setCurrentRoute("learner");
                                    }}
                                >
                                    Practice!
                                </Button>
                            </Group>
                        </Card>
                    </Grid.Col>
                    <Grid.Col>
                        <Card shadow="xl">
                            <Group justify="space-between" align="top">
                                <Title
                                    order={2}
                                >{`Practice 🇺🇸 to ${flag}`}</Title>
                                <Badge color="orange">hard</Badge>
                            </Group>
                            <Divider />
                            <Text>
                                {`The words are shown in english and you
                                        have to type the translation in ${language}`}
                            </Text>
                            <Group justify="space-between" align="end" pt={5}>
                                <Text c="dimmed" size="xs">
                                    Can contain more words <br />
                                    due to multiple translations
                                </Text>
                                <Button
                                    variant="gradient"
                                    onClick={() => {
                                        setEnglishToLanguage(true);
                                        reset();
                                        setCurrentRoute("learner");
                                    }}
                                >
                                    Practice!
                                </Button>
                            </Group>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Grid.Col>
        </Grid>
    );
});

export default Menu;
