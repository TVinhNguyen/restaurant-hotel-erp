// Mock data cho Employee Evaluation System
export interface EmployeeEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationPeriod: string; // e.g., "Q1 2025", "2024 Annual"
  evaluationDate: string;
  status: 'draft' | 'completed' | 'reviewed' | 'approved';

  // Performance Categories
  workQuality: {
    score: number; // 1-5
    comments: string;
  };
  productivity: {
    score: number;
    comments: string;
  };
  communication: {
    score: number;
    comments: string;
  };
  teamwork: {
    score: number;
    comments: string;
  };
  problemSolving: {
    score: number;
    comments: string;
  };
  punctuality: {
    score: number;
    comments: string;
  };
  initiative: {
    score: number;
    comments: string;
  };

  // Overall Assessment
  overallScore: number; // Average of all categories
  overallComments: string;
  strengths: string[];
  areasForImprovement: string[];
  goals: string[];

  // Manager's Decision
  recommendedAction:
    | 'promotion'
    | 'salary_increase'
    | 'training'
    | 'maintain'
    | 'improvement_plan'
    | 'warning';
  salaryRecommendation?: number;
  trainingRecommendations?: string[];

  // Employee Acknowledgment
  employeeAcknowledged: boolean;
  employeeComments?: string;
  employeeAcknowledgedDate?: string;
}

export const mockEvaluations: EmployeeEvaluation[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    evaluatorId: 'hr1',
    evaluatorName: 'HR Manager',
    evaluationPeriod: 'Q3 2025',
    evaluationDate: '2025-08-28',
    status: 'completed',

    workQuality: {
      score: 4.5,
      comments:
        'Consistently delivers high-quality code with minimal bugs. Shows attention to detail.'
    },
    productivity: {
      score: 4.0,
      comments:
        'Meets deadlines and delivers projects on time. Could improve task prioritization.'
    },
    communication: {
      score: 4.2,
      comments:
        'Good communication skills, actively participates in meetings and provides clear updates.'
    },
    teamwork: {
      score: 4.8,
      comments:
        'Excellent team player, helps colleagues and contributes to positive team atmosphere.'
    },
    problemSolving: {
      score: 4.6,
      comments:
        'Strong analytical skills, finds creative solutions to complex technical problems.'
    },
    punctuality: {
      score: 4.3,
      comments:
        'Generally punctual, occasional late arrivals but notifies in advance.'
    },
    initiative: {
      score: 4.1,
      comments:
        'Shows good initiative in learning new technologies and suggesting improvements.'
    },

    overallScore: 4.36,
    overallComments:
      'An is a valuable team member who consistently performs well. Shows strong technical skills and good team collaboration.',
    strengths: [
      'Strong technical expertise',
      'Excellent teamwork skills',
      'Problem-solving abilities',
      'Quality-focused approach'
    ],
    areasForImprovement: [
      'Task prioritization and time management',
      'Leadership skills development',
      'Public speaking confidence'
    ],
    goals: [
      'Lead a small project team by Q4 2025',
      'Complete advanced React certification',
      'Mentor a junior developer'
    ],

    recommendedAction: 'salary_increase',
    salaryRecommendation: 28000000,
    trainingRecommendations: [
      'Leadership Development Program',
      'Advanced React Course'
    ],

    employeeAcknowledged: true,
    employeeComments:
      'Thank you for the feedback. I agree with the assessment and look forward to taking on more leadership responsibilities.',
    employeeAcknowledgedDate: '2025-08-29'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    evaluatorId: 'ceo1',
    evaluatorName: 'CEO',
    evaluationPeriod: 'Q3 2025',
    evaluationDate: '2025-08-27',
    status: 'approved',

    workQuality: {
      score: 4.7,
      comments:
        'Exceptional work quality in HR processes and employee relations management.'
    },
    productivity: {
      score: 4.5,
      comments: 'Highly productive, manages multiple HR functions efficiently.'
    },
    communication: {
      score: 4.9,
      comments:
        'Outstanding communication skills, effectively handles sensitive employee matters.'
    },
    teamwork: {
      score: 4.6,
      comments:
        'Works well across departments, builds strong relationships with all teams.'
    },
    problemSolving: {
      score: 4.4,
      comments:
        'Good at resolving HR conflicts and finding practical solutions.'
    },
    punctuality: {
      score: 4.8,
      comments: 'Always punctual and sets a good example for the team.'
    },
    initiative: {
      score: 4.7,
      comments:
        'Proactive in implementing new HR policies and improving processes.'
    },

    overallScore: 4.66,
    overallComments:
      'Bình is an outstanding HR Manager who has significantly improved our HR processes and employee satisfaction.',
    strengths: [
      'Exceptional communication skills',
      'Strong leadership abilities',
      'Process improvement focus',
      'Employee relations expertise'
    ],
    areasForImprovement: [
      'Digital HR tools proficiency',
      'Strategic planning skills',
      'Data analytics capabilities'
    ],
    goals: [
      'Implement digital HR transformation',
      'Develop company culture initiatives',
      'Create comprehensive training programs'
    ],

    recommendedAction: 'promotion',
    salaryRecommendation: 35000000,
    trainingRecommendations: [
      'HR Analytics Course',
      'Strategic HR Management',
      'Digital Transformation in HR'
    ],

    employeeAcknowledged: true,
    employeeComments:
      'I appreciate the recognition and look forward to driving HR innovation in our organization.',
    employeeAcknowledgedDate: '2025-08-28'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Lê Minh Cường',
    evaluatorId: 'hr1',
    evaluatorName: 'HR Manager',
    evaluationPeriod: 'Q3 2025',
    evaluationDate: '2025-08-25',
    status: 'reviewed',

    workQuality: {
      score: 3.8,
      comments:
        'Good work quality but needs more consistency in campaign execution.'
    },
    productivity: {
      score: 3.5,
      comments: 'Meeting basic requirements but could improve output volume.'
    },
    communication: {
      score: 4.0,
      comments: 'Good presentation skills and client communication.'
    },
    teamwork: {
      score: 3.7,
      comments:
        'Works well in team but could be more collaborative in brainstorming sessions.'
    },
    problemSolving: {
      score: 3.9,
      comments: 'Creative thinking but needs to be more systematic in approach.'
    },
    punctuality: {
      score: 3.2,
      comments: 'Frequent late arrivals and missed some important meetings.'
    },
    initiative: {
      score: 4.2,
      comments: 'Shows good initiative in proposing new marketing ideas.'
    },

    overallScore: 3.76,
    overallComments:
      'Cường shows potential but needs improvement in consistency and time management.',
    strengths: [
      'Creative marketing ideas',
      'Good presentation skills',
      'Client relationship building'
    ],
    areasForImprovement: [
      'Time management and punctuality',
      'Consistency in work quality',
      'Team collaboration',
      'Project planning skills'
    ],
    goals: [
      'Improve punctuality to 95% or above',
      'Complete project management certification',
      'Increase campaign success rate by 20%'
    ],

    recommendedAction: 'training',
    trainingRecommendations: [
      'Time Management Workshop',
      'Project Management Fundamentals',
      'Advanced Marketing Analytics'
    ],

    employeeAcknowledged: false
  }
];

export const evaluationCategories = [
  { key: 'workQuality', label: 'Work Quality', weight: 20 },
  { key: 'productivity', label: 'Productivity', weight: 18 },
  { key: 'communication', label: 'Communication', weight: 15 },
  { key: 'teamwork', label: 'Teamwork', weight: 15 },
  { key: 'problemSolving', label: 'Problem Solving', weight: 12 },
  { key: 'punctuality', label: 'Punctuality', weight: 10 },
  { key: 'initiative', label: 'Initiative', weight: 10 }
];

export const scoreDescriptions = {
  1: {
    label: 'Poor',
    color: '#ff4d4f',
    description: 'Below expectations, immediate improvement needed'
  },
  2: {
    label: 'Below Average',
    color: '#ff7a45',
    description: 'Below expectations, improvement required'
  },
  3: {
    label: 'Average',
    color: '#faad14',
    description: 'Meets basic expectations'
  },
  4: { label: 'Good', color: '#52c41a', description: 'Exceeds expectations' },
  5: {
    label: 'Excellent',
    color: '#1890ff',
    description: 'Far exceeds expectations, exceptional performance'
  }
};

// Utility functions
export const getMockEvaluations = (): EmployeeEvaluation[] => {
  return mockEvaluations;
};

export const getMockEvaluationsByEmployee = (
  employeeId: string
): EmployeeEvaluation[] => {
  return mockEvaluations.filter(
    evaluation => evaluation.employeeId === employeeId
  );
};

export const getMockEvaluationById = (
  id: string
): EmployeeEvaluation | undefined => {
  return mockEvaluations.find(evaluation => evaluation.id === id);
};

export const addMockEvaluation = (
  evaluation: Omit<EmployeeEvaluation, 'id' | 'overallScore'>
): EmployeeEvaluation => {
  // Calculate overall score
  const scores = [
    evaluation.workQuality.score,
    evaluation.productivity.score,
    evaluation.communication.score,
    evaluation.teamwork.score,
    evaluation.problemSolving.score,
    evaluation.punctuality.score,
    evaluation.initiative.score
  ];
  const overallScore =
    scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const newEvaluation: EmployeeEvaluation = {
    ...evaluation,
    id: (mockEvaluations.length + 1).toString(),
    overallScore: Math.round(overallScore * 100) / 100
  };

  mockEvaluations.push(newEvaluation);
  return newEvaluation;
};

export const updateMockEvaluation = (
  id: string,
  data: Partial<EmployeeEvaluation>
): EmployeeEvaluation | null => {
  const index = mockEvaluations.findIndex(evaluation => evaluation.id === id);
  if (index !== -1) {
    mockEvaluations[index] = { ...mockEvaluations[index], ...data };

    // Recalculate overall score if any category scores were updated
    const evaluation = mockEvaluations[index];
    const scores = [
      evaluation.workQuality.score,
      evaluation.productivity.score,
      evaluation.communication.score,
      evaluation.teamwork.score,
      evaluation.problemSolving.score,
      evaluation.punctuality.score,
      evaluation.initiative.score
    ];
    evaluation.overallScore =
      Math.round(
        (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100
      ) / 100;

    return mockEvaluations[index];
  }
  return null;
};
