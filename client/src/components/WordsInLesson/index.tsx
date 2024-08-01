import { Lesson, Translation } from "../../types";
import { Translations } from "../Translations";

export const WordsInLesson = ({
    lesson,
    getWordsInLesson,
}: {
    lesson: Lesson;
    getWordsInLesson: (lesson: Lesson) => Translation[];
}) => <Translations translations={getWordsInLesson(lesson)} />;
