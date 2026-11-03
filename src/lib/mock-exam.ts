import type { IExamSet } from '@/data/practice';
import type { IListeningSet } from '@/data/listening';

export const MOCK_EXAM_SECONDS = 130 * 60;

export interface ObjectiveExamQuestion {
  id: string;
  no: number;
  section: 'listening' | 'reading';
  prompt: string;
  options: string[];
  answer: number;
  analysis: string;
  contextTitle?: string;
  contextText?: string;
  contextSource?: string;
}

export function buildObjectiveQuestions(
  exam: IExamSet,
  listening?: IListeningSet,
): ObjectiveExamQuestion[] {
  const listeningQuestions = (listening?.sections ?? []).flatMap((section) => (
    section.questions.map((question) => ({
      id: `${listening!.id}-${section.part}-${question.no ?? question.id}`,
      no: question.no ?? 0,
      section: 'listening' as const,
      prompt: question.prompt,
      options: question.options,
      answer: question.answer,
      analysis: question.analysis,
      contextTitle: section.title,
    }))
  ));

  const readingQuestions = exam.passages.flatMap((passage) => (
    passage.questions.map((question) => ({
      id: question.id,
      no: question.no,
      section: 'reading' as const,
      prompt: question.prompt,
      options: question.options,
      answer: question.answer,
      analysis: question.analysis,
      contextTitle: passage.title,
      contextText: passage.passage,
      contextSource: passage.source,
    }))
  ));

  return [...listeningQuestions, ...readingQuestions];
}

export function scoreObjectiveQuestions(
  questions: ObjectiveExamQuestion[],
  answers: Record<string, number>,
) {
  const score = (section: ObjectiveExamQuestion['section']) => {
    const sectionQuestions = questions.filter((question) => question.section === section);
    const correct = sectionQuestions.filter((question) => answers[question.id] === question.answer).length;
    return { correct, total: sectionQuestions.length };
  };
  const listening = score('listening');
  const reading = score('reading');
  return {
    listening,
    reading,
    correct: listening.correct + reading.correct,
    total: listening.total + reading.total,
    answered: questions.filter((question) => answers[question.id] !== undefined).length,
  };
}

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest].map((value) => String(value).padStart(2, '0')).join(':');
}
