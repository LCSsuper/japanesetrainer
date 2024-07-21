import { Lesson, Word } from "../../types";
import { Words } from "../Words";

export const WordsInLesson = ({
    lesson,
    getWordsInLesson,
}: {
    lesson: Lesson;
    getWordsInLesson: (lesson: Lesson) => Word[];
}) => <Words words={getWordsInLesson(lesson)} />;
