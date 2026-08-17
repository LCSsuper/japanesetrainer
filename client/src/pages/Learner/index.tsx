import { Box, Card, Center, Grid } from "@mantine/core";

import { PracticeBox } from "./components/PracticeBox";
import { AnswerBox } from "./components/AnswerBox";
import { TransitionOnMount } from "../../components/generic/TransitionOnMount";

const Learner = () => (
    <TransitionOnMount>
        <Box>
            <Center>
                <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                    <Grid.Col>
                        <Card shadow={"xl"} radius={"md"}>
                            <PracticeBox />
                            <AnswerBox />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Center>
        </Box>
    </TransitionOnMount>
);

export default Learner;
