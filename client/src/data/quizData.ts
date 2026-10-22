import { QuizQuestion, SkillName } from '../types';

export const SKILLS_LIST: SkillName[] = [
  'DSA',
  'Programming',
  'SQL',
  'Git',
  'CS Fundamentals'
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // DSA Questions
  {
    id: 1,
    skill: 'DSA',
    question: 'What is the time complexity of binary search on a sorted array of size n?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    answerIndex: 1,
    explanation: 'Binary search halves the search space with each step, yielding a logarithmic time complexity O(log n).'
  },
  {
    id: 2,
    skill: 'DSA',
    question: 'Which abstract data type operates strictly on a Last-In, First-Out (LIFO) discipline?',
    options: ['Queue', 'Stack', 'Heap', 'Graph'],
    answerIndex: 1,
    explanation: 'A Stack follows the LIFO order where elements are pushed and popped from the top.'
  },

  // Programming Questions
  {
    id: 3,
    skill: 'Programming',
    question: 'Which OOP mechanism allows a subclass to provide a specific implementation of a method declared in its parent class?',
    options: ['Encapsulation', 'Overriding', 'Overloading', 'Abstraction'],
    answerIndex: 1,
    explanation: 'Method overriding permits a child class to override a superclass method signature with custom behavior.'
  },
  {
    id: 4,
    skill: 'Programming',
    question: 'Which collection or set structure rejects duplicate elements and guarantees distinct keys?',
    options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'],
    answerIndex: 2,
    explanation: 'A HashSet stores unique values based on hash codes and rejects duplicate entries.'
  },

  // SQL Questions
  {
    id: 5,
    skill: 'SQL',
    question: 'Which SQL clause is used to filter aggregated group records after a GROUP BY statement?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
    answerIndex: 1,
    explanation: 'WHERE filters individual table rows prior to aggregation, while HAVING filters post-aggregation groups.'
  },
  {
    id: 6,
    skill: 'SQL',
    question: 'Which type of JOIN returns only rows where matching values exist in both tables?',
    options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'],
    answerIndex: 2,
    explanation: 'INNER JOIN selects rows that satisfy the matching join predicate in both datasets.'
  },

  // Git Questions
  {
    id: 7,
    skill: 'Git',
    question: 'Which Git command creates a new feature branch and immediately switches your working directory to it?',
    options: ['git branch -d feat', 'git checkout -b feat', 'git merge feat', 'git clone feat'],
    answerIndex: 1,
    explanation: 'git checkout -b <name> (or git switch -c <name>) creates and checks out the branch in a single action.'
  },
  {
    id: 8,
    skill: 'Git',
    question: 'Which Git command transmits committed local branch history up to a configured remote repository?',
    options: ['git pull', 'git fetch', 'git push', 'git add'],
    answerIndex: 2,
    explanation: 'git push transmits commits from your local ref to the remote upstream repository.'
  },

  // CS Fundamentals Questions
  {
    id: 9,
    skill: 'CS Fundamentals',
    question: 'In relational database normalization, which normal form eliminates partial functional dependencies on a composite primary key?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answerIndex: 1,
    explanation: '2NF requires 1NF compliance and that every non-prime attribute is fully functionally dependent on the whole candidate key.'
  },
  {
    id: 10,
    skill: 'CS Fundamentals',
    question: 'Which layer of the standard OSI 7-layer reference model handles IP packet routing across network boundaries?',
    options: ['Transport Layer', 'Network Layer', 'Data Link Layer', 'Session Layer'],
    answerIndex: 1,
    explanation: 'Layer 3 (Network Layer) is responsible for logical addressing, path determination, and packet routing.'
  }
];
