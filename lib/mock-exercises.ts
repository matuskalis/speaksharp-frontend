import { Exercise } from "@/lib/types";

// Mock exercises for different skills
export const mockExercises: Exercise[] = [
  // Multiple Choice - Grammar
  {
    id: "mc-1",
    type: "multiple_choice",
    level: "intermediate",
    skill: "grammar",
    question: "Choose the correct form: She ___ to the store yesterday.",
    options: ["go", "goes", "went", "going"],
    correctAnswer: "went",
    explanation: "We use the simple past tense 'went' because 'yesterday' indicates a completed action in the past.",
    hint: "Look at the time indicator in the sentence.",
  },
  {
    id: "mc-2",
    type: "multiple_choice",
    level: "intermediate",
    skill: "grammar",
    question: "Which sentence is grammatically correct?",
    options: [
      "If I would have known, I would have called.",
      "If I had known, I would have called.",
      "If I knew, I would have called.",
      "If I have known, I would have called.",
    ],
    correctAnswer: "If I had known, I would have called.",
    explanation: "This is a third conditional sentence. We use 'had + past participle' in the if-clause and 'would have + past participle' in the main clause.",
    hint: "Think about conditional structures.",
  },
  {
    id: "mc-3",
    type: "multiple_choice",
    level: "beginner",
    skill: "grammar",
    question: "Complete the sentence: I ___ English for three years.",
    options: ["study", "am studying", "have been studying", "studied"],
    correctAnswer: "have been studying",
    explanation: "We use present perfect continuous for actions that started in the past and continue to the present, especially with 'for + duration'.",
    hint: "'For three years' suggests ongoing action.",
  },
  {
    id: "mc-4",
    type: "multiple_choice",
    level: "intermediate",
    skill: "grammar",
    question: "Select the correct option: Neither the teacher ___ the students were ready.",
    options: ["nor", "or", "and", "but"],
    correctAnswer: "nor",
    explanation: "'Neither...nor' is a correlative conjunction used to join two negative alternatives.",
    hint: "'Neither' pairs with a specific word.",
  },
  {
    id: "mc-5",
    type: "multiple_choice",
    level: "advanced",
    skill: "grammar",
    question: "Which is correct? The data ___ inconclusive.",
    options: ["is", "are", "was", "were"],
    correctAnswer: "is",
    explanation: "In modern English, 'data' is commonly treated as an uncountable noun and takes singular verb agreement, though 'are' is also acceptable in formal contexts.",
    hint: "Consider modern usage conventions.",
  },

  // Fill in the Blank - Vocabulary
  {
    id: "fib-1",
    type: "fill_blank",
    level: "intermediate",
    skill: "vocabulary",
    question: "The new policy will _____ significant changes to the organization.",
    correctAnswer: "bring about",
    explanation: "'Bring about' is a phrasal verb meaning to cause something to happen.",
    hint: "Think of a phrasal verb meaning 'cause'.",
  },
  {
    id: "fib-2",
    type: "fill_blank",
    level: "intermediate",
    skill: "vocabulary",
    question: "Despite the _____ weather, we decided to go hiking.",
    correctAnswer: "inclement",
    explanation: "'Inclement' means unpleasantly cold or wet, often used to describe bad weather.",
    hint: "A formal word for 'bad' when describing weather.",
  },
  {
    id: "fib-3",
    type: "fill_blank",
    level: "beginner",
    skill: "grammar",
    question: "She asked me if I _____ help her with the project.",
    correctAnswer: "could",
    explanation: "In reported speech, 'can' changes to 'could' when the reporting verb is in the past tense.",
    hint: "This is reported speech. What happens to 'can'?",
  },
  {
    id: "fib-4",
    type: "fill_blank",
    level: "advanced",
    skill: "vocabulary",
    question: "The professor's _____ explanation made the complex topic easy to understand.",
    correctAnswer: "lucid",
    explanation: "'Lucid' means clear and easy to understand, especially of writing or speech.",
    hint: "A word meaning 'clear' or 'easily understood'.",
  },
  {
    id: "fib-5",
    type: "fill_blank",
    level: "intermediate",
    skill: "grammar",
    question: "By the time she arrives, we _____ already finished dinner.",
    correctAnswer: "will have",
    explanation: "The future perfect tense 'will have + past participle' is used for actions completed before a future time reference.",
    hint: "What tense do we use for completed future actions?",
  },

  // Sentence Correction
  {
    id: "sc-1",
    type: "sentence_correction",
    level: "intermediate",
    skill: "grammar",
    question: "Find and correct the error: 'Me and him went to the store.'",
    correctAnswer: "He and I went to the store.",
    explanation: "Subject pronouns (I, he) are used as the subject of a sentence, not object pronouns (me, him). Also, it's polite to put others before yourself.",
  },
  {
    id: "sc-2",
    type: "sentence_correction",
    level: "intermediate",
    skill: "grammar",
    question: "Correct this sentence: 'Everyone should bring their own lunch.'",
    correctAnswer: "Everyone should bring his or her own lunch.",
    explanation: "'Everyone' is singular and traditionally takes singular pronouns. However, 'their' is increasingly accepted as a gender-neutral singular pronoun.",
    hint: "Consider pronoun-antecedent agreement.",
  },
  {
    id: "sc-3",
    type: "sentence_correction",
    level: "advanced",
    skill: "grammar",
    question: "Fix the error: 'The team are playing good today.'",
    correctAnswer: "The team is playing well today.",
    explanation: "In American English, collective nouns like 'team' take singular verbs. Also, 'well' (adverb) modifies the verb 'playing', not 'good' (adjective).",
  },
  {
    id: "sc-4",
    type: "sentence_correction",
    level: "beginner",
    skill: "grammar",
    question: "Correct the mistake: 'I have went to Paris twice.'",
    correctAnswer: "I have gone to Paris twice.",
    explanation: "The present perfect tense uses 'have/has + past participle'. The past participle of 'go' is 'gone', not 'went' (which is simple past).",
  },
  {
    id: "sc-5",
    type: "sentence_correction",
    level: "intermediate",
    skill: "grammar",
    question: "Fix this sentence: 'Between you and I, this is a secret.'",
    correctAnswer: "Between you and me, this is a secret.",
    explanation: "'Between' is a preposition and requires object pronouns. 'Me' is correct, not 'I'.",
  },
];

// Get exercises by type
export function getExercisesByType(type: Exercise["type"]): Exercise[] {
  return mockExercises.filter((ex) => ex.type === type);
}

// Get exercises by skill
export function getExercisesBySkill(skill: string): Exercise[] {
  return mockExercises.filter((ex) => ex.skill === skill);
}

// Get exercises by level
export function getExercisesByLevel(level: string): Exercise[] {
  return mockExercises.filter((ex) => ex.level === level);
}

// Get a random selection of exercises
export function getRandomExercises(count: number = 5): Exercise[] {
  const shuffled = [...mockExercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get a practice session (mixed types)
export function getPracticeSession(count: number = 5): Exercise[] {
  // Ensure variety - try to get different types
  const byType: Record<string, Exercise[]> = {};
  mockExercises.forEach((ex) => {
    if (!byType[ex.type]) byType[ex.type] = [];
    byType[ex.type].push(ex);
  });

  const selected: Exercise[] = [];
  const types = Object.keys(byType);
  let typeIndex = 0;

  while (selected.length < count && selected.length < mockExercises.length) {
    const type = types[typeIndex % types.length];
    const available = byType[type].filter((ex) => !selected.includes(ex));
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available[randomIndex]);
    }
    typeIndex++;
  }

  return selected.sort(() => Math.random() - 0.5);
}
