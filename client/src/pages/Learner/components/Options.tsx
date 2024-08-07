import {
    ActionIcon,
    Button,
    Group,
    Modal,
    Space,
    Switch,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

import { useMobxStores } from "../../../hooks/useMobxStores";
import { useState } from "react";

const OptionsModalContent = ({
    onClose,
    onAccept,
    araa,
    sr,
    swt,
    r,
}: {
    onClose: any;
    onAccept: any;
    araa: boolean;
    sr: boolean;
    swt: boolean;
    r: boolean;
}) => {
    const [allowRomanizationAsAnswer, setAllowRomanizationAsAnswer] =
        useState(araa);
    const [showRomanization, setShowRomanization] = useState(sr);
    const [showWordType, setShowWordType] = useState(swt);
    const [randomize, setRandomize] = useState(r);

    return (
        <>
            <Switch
                label="Show romanization"
                checked={showRomanization}
                onChange={() => setShowRomanization(!showRomanization)}
            />
            <Space h="sm" />
            <Switch
                label="Show word type"
                checked={showWordType}
                onChange={() => setShowWordType(!showWordType)}
            />
            <Space h="sm" />
            <Group>
                <Switch
                    label="Randomize words"
                    checked={randomize}
                    onChange={() => setRandomize(!randomize)}
                />
                <Text c="dimmed" size="sm">
                    (will restart practice)
                </Text>
            </Group>
            <Space h="sm" />
            <Switch
                label="Allow romanization as answer"
                checked={allowRomanizationAsAnswer}
                onChange={() =>
                    setAllowRomanizationAsAnswer(!allowRomanizationAsAnswer)
                }
            />
            <Space h="sm" />
            <Group justify="end">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() =>
                        onAccept({
                            sr: showRomanization,
                            swt: showWordType,
                            r: randomize,
                            araa: allowRomanizationAsAnswer,
                        })
                    }
                >
                    OK
                </Button>
            </Group>
        </>
    );
};

export const OptionsButton = observer(() => {
    const { settingsStore, learnerStore } = useMobxStores();
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Practice options">
                <OptionsModalContent
                    araa={settingsStore.allowRomanizationAsAnswer}
                    sr={settingsStore.showRomanization}
                    swt={settingsStore.showWordType}
                    r={settingsStore.randomize}
                    onClose={close}
                    onAccept={({
                        sr,
                        swt,
                        r,
                        araa,
                    }: {
                        sr: boolean;
                        swt: boolean;
                        r: boolean;
                        araa: boolean;
                    }) => {
                        settingsStore.save("showRomanization", sr);
                        settingsStore.save("showWordType", swt);
                        settingsStore.save("allowRomanizationAsAnswer", araa);
                        let restartPractice = r !== settingsStore.randomize;
                        settingsStore.save("randomize", r);
                        if (restartPractice) learnerStore.reset();
                        close();
                    }}
                />
            </Modal>
            <ActionIcon flex={0} size="lg" variant="subtle" onClick={open}>
                <IconAdjustmentsHorizontal />
            </ActionIcon>
        </>
    );
});
