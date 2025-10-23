// PDA Types and Templates

export type StackSymbol = 'A' | 'X' | 'Y' | 'Z';

export type PDAState = 'q0' | 'q1' | 'q2' | 'q3' | 'qaccept' | 'qreject';

export interface MicroStep {
  step: number;
  symbol: string;
  operation: string;
  stackBefore: StackSymbol[];
  stackAfter: StackSymbol[];
  state: PDAState;
  explanation: string;
  error?: string;
}

export interface PDATemplate {
  id: string;
  name: string;
  description: string;
  examples: string[];
  rule: (symbol: string, stack: StackSymbol[], state: PDAState) => {
    push?: StackSymbol[];
    pop?: number;
    newState: PDAState;
    accept?: boolean;
    reject?: boolean;
  };
}

export const PDA_TEMPLATES: PDATemplate[] = [
  {
    id: 'anbn',
    name: 'aⁿ bⁿ',
    description: 'Push 1 A per a, pop 1 A per b. Accept if stack empty.',
    examples: ['aabb', 'aaabbb', 'ab'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'anb2n',
    name: 'aⁿ b²ⁿ',
    description: 'Push 2 A per a, pop 1 A per b.',
    examples: ['abb', 'aabbbb', 'aaabbbbbb'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A', 'A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'anb3n',
    name: 'aⁿ b³ⁿ',
    description: 'Push 3 A per a, pop 1 A per b.',
    examples: ['abbb', 'aabbbbbb'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A', 'A', 'A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'an_hash_bn',
    name: 'aⁿ # bⁿ',
    description: 'Push a until #, then pop b.',
    examples: ['aa#bb', 'aaa#bbb'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if (state === 'q0' && symbol === '#') {
        return { newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'a2n_bn',
    name: 'a²ⁿ bⁿ',
    description: 'Push 1 A per 2 a, pop 1 A per b.',
    examples: ['aabb', 'aaaabb', 'aaaaaabbb'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q2') && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q2' };
      }
      if (state === 'q2' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'palindrome',
    name: 'w # reverse(w)',
    description: 'Mirror pattern: push until #, then match pop.',
    examples: ['aba#aba', 'aa#aa', 'abba#abba'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && (symbol === 'a' || symbol === 'b')) {
        return { push: [symbol === 'a' ? 'A' : 'X'], newState: 'q0' };
      }
      if (state === 'q0' && symbol === '#') {
        return { newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'a') {
        if (stack.length === 0 || stack[stack.length - 1] !== 'A') {
          return { newState: 'qreject', reject: true };
        }
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'b') {
        if (stack.length === 0 || stack[stack.length - 1] !== 'X') {
          return { newState: 'qreject', reject: true };
        }
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'alternating',
    name: '(ab)ⁿ',
    description: 'Alternating a,b pairs with stack push/pop.',
    examples: ['ab', 'abab', 'ababab'],
    rule: (symbol, stack, state) => {
      if ((state === 'q0' || state === 'q1') && symbol === 'a') {
        return { push: ['A'], newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q0' };
      }
      if (state === 'q0' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'extra_bs',
    name: 'aⁿ bⁿ⁺ᵏ',
    description: 'More b than a, detect extra b in stack.',
    examples: ['aabbb', 'abb', 'aaabbbbbb'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length > 0) {
          return { pop: 1, newState: 'q1' };
        }
        return { push: ['X'], newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        const extraBs = stack.filter(s => s === 'X').length;
        return { newState: extraBs > 0 ? 'qaccept' : 'qreject', accept: extraBs > 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'mixed_xy',
    name: 'aⁿ bⁿ + xᵐ yᵐ',
    description: 'Two patterns with X,Y stack symbols.',
    examples: ['aabb', 'xxyy', 'aabbxxyy'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length > 0 && stack[stack.length - 1] === 'A') {
          return { pop: 1, newState: 'q1' };
        }
        return { newState: 'qreject', reject: true };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'x') {
        return { push: ['X'], newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'y') {
        if (stack.length > 0 && stack[stack.length - 1] === 'X') {
          return { pop: 1, newState: 'q1' };
        }
        return { newState: 'qreject', reject: true };
      }
      if (state === 'q1' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'nested',
    name: 'aⁿ bᵐ aᵐ bⁿ',
    description: 'Nested pattern demonstration.',
    examples: ['abba', 'aabbaa', 'aaabbbaaabbb'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        return { push: ['X'], newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'a') {
        if (stack.length > 0 && stack[stack.length - 1] === 'X') {
          return { pop: 1, newState: 'q2' };
        }
        return { newState: 'qreject', reject: true };
      }
      if (state === 'q2' && symbol === 'a') {
        if (stack.length > 0 && stack[stack.length - 1] === 'X') {
          return { pop: 1, newState: 'q2' };
        }
        return { newState: 'q3' };
      }
      if (state === 'q2' && symbol === 'b') {
        return { newState: 'q3' };
      }
      if (state === 'q3' && symbol === 'b') {
        if (stack.length > 0 && stack[stack.length - 1] === 'A') {
          return { pop: 1, newState: 'q3' };
        }
        return { newState: 'qreject', reject: true };
      }
      if (state === 'q3' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'simple_balance',
    name: 'Balanced Parentheses ()',
    description: 'Push on (, pop on ). Accept if balanced.',
    examples: ['()', '(())', '((()))'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === '(') {
        return { push: ['A'], newState: 'q0' };
      }
      if (state === 'q0' && symbol === ')') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q0' };
      }
      if (state === 'q0' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'even_as',
    name: 'Even number of a',
    description: 'Count a using stack, accept if even.',
    examples: ['aa', 'aaaa', 'aaaaaa'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'a') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q0' };
      }
      if (state === 'q0' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'triple_match',
    name: 'aⁿ bⁿ cⁿ (limited)',
    description: 'Shows PDA limits - can only match 2.',
    examples: ['abc', 'aabbcc'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, push: ['X'], newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'c') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === '') {
        return { 
          newState: stack.length === 0 ? 'qaccept' : 'qreject', 
          accept: stack.length === 0 
        };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'multi_marker',
    name: 'aⁿ bⁿ c dᵐ',
    description: 'Marker c separates two patterns.',
    examples: ['aaabbbcd', 'abbcdd'],
    rule: (symbol, stack, state) => {
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if ((state === 'q0' || state === 'q1') && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q1' };
      }
      if (state === 'q1' && symbol === 'c') {
        if (stack.length !== 0) return { newState: 'qreject', reject: true };
        return { newState: 'q2' };
      }
      if (state === 'q2' && symbol === 'd') {
        return { push: ['X'], newState: 'q2' };
      }
      if (state === 'q2' && symbol === '') {
        return { newState: 'qaccept', accept: true };
      }
      return { newState: 'qreject', reject: true };
    }
  },
  {
    id: 'custom',
    name: 'Custom Template',
    description: 'Define your own push/pop rules.',
    examples: ['custom'],
    rule: (symbol, stack, state) => {
      // Default simple rule
      if (state === 'q0' && symbol === 'a') {
        return { push: ['A'], newState: 'q0' };
      }
      if (state === 'q0' && symbol === 'b') {
        if (stack.length === 0) return { newState: 'qreject', reject: true };
        return { pop: 1, newState: 'q0' };
      }
      if (state === 'q0' && symbol === '') {
        return { newState: stack.length === 0 ? 'qaccept' : 'qreject', accept: stack.length === 0 };
      }
      return { newState: 'qreject', reject: true };
    }
  }
];
