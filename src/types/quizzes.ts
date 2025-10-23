export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'tricky';

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: QuizDifficulty;
  explanation: string;
  templateId?: string; // If specific to a template
}

// Template-specific quizzes
export const TEMPLATE_SPECIFIC_QUIZZES: Record<string, Quiz[]> = {
  'anbn': [
    {
      question: '🤔 For input "aaabbb", what will be the final stack state?',
      options: ['Empty', 'Contains 3 As', 'Contains 3 Bs', 'Contains 6 symbols'],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'In aⁿbⁿ, each "a" pushes one A, each "b" pops one A. Equal numbers mean empty stack!',
    },
    {
      question: '🎯 Why will "aabb" be ACCEPTED but "aaabba" be REJECTED?',
      options: [
        'Second has more symbols',
        'Second has wrong order',
        'Second has unequal a and b count',
        'Stack underflows in second'
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'aabb has 2a and 2b (equal), but aaabba has 4a and 2b (unequal). Stack will have 2 As left!',
    },
    {
      question: '🔥 TRICK QUESTION: Can "ba" ever be accepted in aⁿbⁿ?',
      options: ['Yes', 'No', 'Only if stack allows', 'Depends on PDA state'],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'NO! We must read all "a"s BEFORE any "b". "b" first means trying to pop from empty stack = REJECT!',
    },
    {
      question: '🧠 If you see stack with 5 As during execution, how many more "b"s do you need?',
      options: ['Exactly 5', 'At least 5', 'At most 5', 'Cannot determine'],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'Each "b" pops exactly one A. Need exactly 5 more "b"s to empty the stack and accept!',
    },
    {
      question: '⚡ What happens if we process "aaa" and then encounter end-of-input (no more "b"s)?',
      options: ['Accept', 'Reject - stack not empty', 'Error', 'Depends on state'],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Stack has 3 As left. For acceptance, stack must be EMPTY. This is REJECTED!',
    }
  ],
  'anb2n': [
    {
      question: '🤯 For "abb", how many As will be on the stack after reading "a"?',
      options: ['1', '2', '4', '0'],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'In aⁿb²ⁿ, each "a" pushes TWO As! So "a" → pushes AA.',
    },
    {
      question: '💡 Why is "abbb" REJECTED but "abbbb" ACCEPTED?',
      options: [
        'First has odd number of bs',
        'First has wrong ratio (need 2b per a)',
        'Second is longer',
        'Stack overflow in first'
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: '"a" pushes 2 As. "abbb" has 3 bs (not 2×1=2), "abbbb" has 4 bs (exactly 2×2=4)!',
    },
    {
      question: '🎓 If stack has 6 As, how many "b"s have been processed?',
      options: ['6', '3', '0', '12'],
      correctAnswer: 2,
      difficulty: 'tricky',
      explanation: 'TRICK! Stack has 6 As means 3 "a"s were pushed. NO "b"s processed yet (each b pops 1 A)!',
    },
    {
      question: '🔍 What makes aⁿb²ⁿ different from aⁿbⁿ?',
      options: [
        'Different push counts',
        'Different states',
        'Different symbols',
        'Different acceptance'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'aⁿb²ⁿ pushes 2 As per "a", while aⁿbⁿ pushes only 1 A per "a". The ratio is key!',
    }
  ],
  'anbncn': [
    {
      question: '🚨 Is aⁿbⁿcⁿ actually solvable by a PDA?',
      options: ['Yes, easily', 'No, not context-free', 'Only with 2 stacks', 'Depends on input'],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'CORRECT! aⁿbⁿcⁿ is NOT context-free. PDAs cannot handle TWO simultaneous counts. This is a famous limit!',
    },
    {
      question: '🤔 Why can PDA do aⁿbⁿ but not aⁿbⁿcⁿ?',
      options: [
        'Too many symbols',
        'Need to match TWO counts simultaneously',
        'Stack too small',
        'Wrong states'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'PDA can match ONE count (a vs b), but aⁿbⁿcⁿ needs matching BOTH n(a)=n(b) AND n(b)=n(c) at once!',
    },
    {
      question: '💭 What would you need to solve aⁿbⁿcⁿ properly?',
      options: ['Bigger stack', 'More states', 'Two stacks (Turing machine)', 'Faster PDA'],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'Need TWO stacks or a Turing machine! One stack for a vs b, another for b vs c.',
    }
  ],
  'anhashbn': [
    {
      question: '🎯 What is the role of "#" symbol in aⁿ#bⁿ?',
      options: ['Decoration', 'Marker to switch from push to pop mode', 'End marker', 'Error symbol'],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'The "#" marks the midpoint! Before "#": push As. After "#": pop As with "b"s.',
    },
    {
      question: '🔥 Will "aa#bb" be accepted?',
      options: ['Yes', 'No - stack has items', 'No - # position wrong', 'Maybe'],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'YES! 2 "a"s push 2 As, "#" switches mode, 2 "b"s pop 2 As. Stack empty = ACCEPT!',
    },
    {
      question: '⚡ TRICK: What if input is "aaa#bb" (more as than bs)?',
      options: ['Accept', 'Reject - stack not empty', 'Reject - invalid #', 'Error'],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: '3 as push 3 As, but only 2 bs pop 2 As. Stack still has 1 A left = REJECT!',
    }
  ],
  'balanced-parens': [
    {
      question: '🧩 Why is "(())" accepted but "())(" rejected?',
      options: [
        'Second is longer',
        'Second tries to pop from empty stack at third symbol',
        'Second has wrong order',
        'First is special case'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: '"(())" works fine. But "())(" → after "))", stack empty, next ")" tries to pop = UNDERFLOW!',
    },
    {
      question: '💡 What data structure does PDA stack mimic for balanced parentheses?',
      options: ['Queue', 'Stack (LIFO)', 'Tree', 'Hash table'],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'PDA stack works like a program stack - Last In First Out! Perfect for matching nested parens.',
    },
    {
      question: '🔥 Can "(((" ever be accepted?',
      options: ['Yes', 'No - stack not empty', 'Only if followed by )))', 'Depends'],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'NO! Input ends with 3 unclosed "(" on stack. For acceptance, stack MUST be empty!',
    },
    {
      question: '🚀 CHALLENGE: Is "()(())" valid? Trace it mentally!',
      options: ['Yes', 'No', 'Only partially', 'Error'],
      correctAnswer: 0,
      difficulty: 'hard',
      explanation: 'YES! ( push → ) pop [empty] → ( push → ( push → ) pop → ) pop [empty]. Stack empty = VALID!',
    }
  ],
  'palindrome': [
    {
      question: '🎭 For "aba", when does PDA know it hit the middle?',
      options: ['After first a', 'When it sees #', 'Non-deterministically guesses', 'After all input'],
      correctAnswer: 2,
      difficulty: 'hard',
      explanation: 'PDAs for palindromes are NON-DETERMINISTIC! They "guess" the middle and verify by popping.',
    },
    {
      question: '💭 Why is palindrome detection harder than aⁿbⁿ?',
      options: [
        'More symbols',
        'Need to guess middle point',
        'Longer inputs',
        'Complex stack operations'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'No marker tells us where middle is! PDA must non-deterministically guess and verify both halves match.',
    },
    {
      question: '🧠 Is "abba" a valid palindrome? What about "abab"?',
      options: ['Both valid', 'First valid, second invalid', 'Both invalid', 'Second valid only'],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: '"abba" reads same forwards/backwards (valid). "abab" ≠ "baba" (invalid)!',
    }
  ]
};

// General quizzes (not template-specific)
export const GENERAL_QUIZZES: Quiz[] = [
  {
    question: '🚨 What happens if the stack is empty and we try to pop?',
    options: ['Push a new symbol', 'Reject immediately (underflow)', 'Continue normally', 'Accept the input'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Stack underflow = instant REJECT! Like popping from empty list in programming.',
  },
  {
    question: '✅ What is THE most common acceptance condition for PDAs?',
    options: ['Stack is full', 'Stack is empty at end', 'Input consumed', 'State is q1'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Stack MUST be empty at end! This ensures all pushed symbols were properly matched/popped.',
  },
  {
    question: '🏃 In batch mode, what does "run length" mean?',
    options: ['Total input length', 'Consecutive identical symbols', 'Stack height', 'Number of states'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Run length = count of consecutive SAME symbols. "aaa" has run length 3, "abb" has "a" run=1, "bb" run=2.',
  },
  {
    question: '🤯 Can a PDA accept the language {aⁿbⁿcⁿ | n ≥ 0}?',
    options: ['Yes', 'No - not context-free', 'Yes with 2 states', 'Yes with more stack symbols'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'FAMOUS RESULT: aⁿbⁿcⁿ is NOT context-free! PDAs cannot handle 2 independent counts simultaneously.',
  },
  {
    question: '💡 What makes PDAs more powerful than Finite Automata?',
    options: ['More states', 'The stack (memory)', 'Faster processing', 'Better transitions'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The STACK gives PDAs memory! FAs have no memory, but PDAs can remember and match patterns.',
  },
  {
    question: '⚡ If a PDA is in state q1 with stack [A, A, B], what is the TOP symbol?',
    options: ['A', 'B', 'Empty', 'All of them'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Stack is LIFO (Last In First Out). Last pushed = top = B. Pop removes B first!',
  },
  {
    question: '🎯 TRICKY: Can input "ε" (empty string) ever be accepted?',
    options: ['Never', 'Yes, if initial stack is empty and state is accepting', 'Only in batch mode', 'Only with special symbol'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'YES! Empty input with empty stack and accepting initial state → ACCEPT. Like aⁿbⁿ with n=0!',
  },
  {
    question: '🔥 What is the main limitation of PDAs compared to Turing Machines?',
    options: [
      'Only one stack',
      'No random access to stack',
      'Cannot solve all problems',
      'All of the above'
    ],
    correctAnswer: 3,
    difficulty: 'hard',
    explanation: 'ALL TRUE! One stack + LIFO access + cannot solve all languages = PDAs limitations.',
  },
  {
    question: '🧩 In deterministic PDA, what is NOT allowed?',
    options: [
      'Multiple transitions on same symbol',
      'Epsilon transitions with input transitions',
      'Non-deterministic choices',
      'All of the above'
    ],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: 'Deterministic PDA = exactly ONE choice per configuration. No ambiguity, no guessing!',
  },
  {
    question: '🌟 Why do we visualize PDA with a boat and river?',
    options: [
      'For fun',
      'Boat position = progress, stack = cargo, sink = reject',
      'Traditional notation',
      'No reason'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Visual metaphor! Boat sails through input (progress), carries stack (cargo). Sink = reject!',
  },
  {
    question: '🚀 CHALLENGE: Can a PDA recognize "ww" (string followed by itself)?',
    options: ['Yes', 'No - need to guess middle', 'Only with marker', 'Depends on alphabet'],
    correctAnswer: 2,
    difficulty: 'tricky',
    explanation: 'Need a MARKER like "w#w"! Pure "ww" without marker is NOT context-free (cannot guess middle deterministically).',
  },
  {
    question: '💭 What is the time complexity of PDA simulation per symbol?',
    options: ['O(1)', 'O(stack size)', 'O(n)', 'O(2ⁿ)'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Each symbol processed in O(1) - constant time! Read, push/pop, transition. Very efficient!',
  },
  {
    question: '🎓 Which is TRUE about non-deterministic PDAs?',
    options: [
      'More powerful than deterministic PDAs',
      'Can accept more languages',
      'Can guess and verify',
      'All of the above'
    ],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: 'NPDAs ARE MORE POWERFUL! They can accept all CFLs, while DPDAs cannot. Guessing = superpower!',
  },
  {
    question: '⚠️ What is the danger of epsilon (ε) transitions in PDAs?',
    options: ['Slower execution', 'Infinite loops possible', 'Stack overflow', 'None'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'ε-transitions can loop forever without consuming input! Need careful design to avoid infinite cycles.',
  },
  {
    question: '🔍 THINK HARD: Can PDAs accept regular languages (like a*b*)?',
    options: ['No', 'Yes - every regular language is context-free', 'Only simple ones', 'Depends on DFA'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'YES! Regular ⊂ Context-Free. PDAs can simulate any FA (just ignore the stack). Superset!',
  }
];

// Get quizzes for a specific template
export const getQuizzesForTemplate = (templateId: string): Quiz[] => {
  const templateQuizzes = TEMPLATE_SPECIFIC_QUIZZES[templateId] || [];
  return [...templateQuizzes, ...GENERAL_QUIZZES];
};

// Get random quiz from available set
export const getRandomQuiz = (templateId: string, difficulty?: QuizDifficulty): Quiz => {
  const availableQuizzes = getQuizzesForTemplate(templateId);
  const filtered = difficulty 
    ? availableQuizzes.filter(q => q.difficulty === difficulty)
    : availableQuizzes;
  
  return filtered[Math.floor(Math.random() * filtered.length)] || availableQuizzes[0];
};

// Get quiz based on current step (progressive difficulty)
export const getProgressiveQuiz = (templateId: string, stepNumber: number, totalSteps: number): Quiz => {
  const progress = stepNumber / totalSteps;
  
  let difficulty: QuizDifficulty;
  if (progress < 0.3) {
    difficulty = 'easy';
  } else if (progress < 0.6) {
    difficulty = 'medium';
  } else if (progress < 0.85) {
    difficulty = 'hard';
  } else {
    difficulty = 'tricky';
  }
  
  return getRandomQuiz(templateId, difficulty);
};
