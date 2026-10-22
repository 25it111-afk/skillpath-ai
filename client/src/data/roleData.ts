import { TargetRoleData } from '../types';

export const TARGET_ROLES: Record<string, TargetRoleData> = {
  'Software Engineer': {
    title: 'Software Engineer',
    description: 'Build robust systems, solve complex algorithms, and engineer reliable full-stack applications.',
    iconName: 'Code2',
    benchmarks: {
      DSA: 80,
      Programming: 70,
      SQL: 60,
      Git: 60,
      'CS Fundamentals': 70
    },
    keyHighlights: ['Data Structures & Algorithmic Problem Solving', 'OOP & System Architecture', 'Production Git Workflows']
  },
  'Data Analyst': {
    title: 'Data Analyst',
    description: 'Transform complex datasets into actionable insights with SQL queries, statistical models, and metrics.',
    iconName: 'BarChart3',
    benchmarks: {
      DSA: 40,
      Programming: 60,
      SQL: 85,
      Git: 40,
      'CS Fundamentals': 50
    },
    keyHighlights: ['Advanced SQL Aggregations & Joins', 'Data Processing Pipelines', 'Business Analytics & Metrics']
  },
  'Web Developer': {
    title: 'Web Developer',
    description: 'Create responsive, high-performance web applications with modern frontend frameworks and APIs.',
    iconName: 'Globe',
    benchmarks: {
      DSA: 50,
      Programming: 80,
      SQL: 50,
      Git: 70,
      'CS Fundamentals': 50
    },
    keyHighlights: ['Modern JavaScript/TypeScript & Frameworks', 'REST API Integration', 'Version Control & CI/CD Basics']
  }
};
