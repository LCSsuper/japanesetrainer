import { Box, Center, Grid } from "@mantine/core";
import { WordCard } from "./components/WordCard";
import { AnswerCard } from "./components/AnswerCard";

const Learner = () => (
    <Box>
        <Center>
            <Grid w={"50rem"} maw={"100vw"} p={"1rem"}>
                <Grid.Col>
                    <WordCard />
                </Grid.Col>
                <Grid.Col>
                    <AnswerCard />
                </Grid.Col>
            </Grid>
        </Center>
    </Box>
);

export default Learner;
