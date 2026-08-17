import { Group, Button, Box, ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconMoon, IconSun } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { useMobxStores } from "../../hooks/useMobxStores";

export const Header = observer(() => {
    const { routerStore, settingsStore } = useMobxStores();
    return (
        <Box className="">
            <header>
                <Group justify="space-between" h="100%" p={10}>
                    <Box>
                        {routerStore.currentRoute !== "menu" && (
                            <Button
                                variant="light"
                                pl={7}
                                onClick={() =>
                                    routerStore.setCurrentRoute("menu")
                                }
                            >
                                <IconChevronLeft />
                                menu
                            </Button>
                        )}
                    </Box>
                    <Box>
                        <Group gap={"xs"}>
                            <ActionIcon
                                variant="light"
                                size={"lg"}
                                onClick={() =>
                                    settingsStore.save(
                                        "darkmode",
                                        !settingsStore.darkmode,
                                    )
                                }
                            >
                                {settingsStore.darkmode ? (
                                    <IconSun />
                                ) : (
                                    <IconMoon />
                                )}
                            </ActionIcon>
                        </Group>
                    </Box>
                </Group>
            </header>
        </Box>
    );
});
