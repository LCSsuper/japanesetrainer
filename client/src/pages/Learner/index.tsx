import { Box, Card, Center, Grid } from "@mantine/core";

import { PracticeBox } from "./components/PracticeBox";
import { AnswerBox } from "./components/AnswerBox";

const Learner = () => (
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
);

export default Learner;
