-- Xóa table cũ và tạo lại
DROP TABLE IF EXISTS hr.employee_evaluations;

CREATE TABLE IF NOT EXISTS hr.employee_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  employee_name VARCHAR(150),
  evaluator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  evaluator_name VARCHAR(150),
  evaluation_period VARCHAR(50), -- "Q1 2025", "2024 Annual"
  evaluation_date DATE,
  status VARCHAR(20) CHECK (status IN ('draft','completed','reviewed','approved')) DEFAULT 'draft',

  -- Performance Categories (7 categories)
  work_quality_score DECIMAL(2,1) CHECK (work_quality_score BETWEEN 1 AND 5),
  work_quality_comments TEXT,
  productivity_score DECIMAL(2,1) CHECK (productivity_score BETWEEN 1 AND 5),
  productivity_comments TEXT,
  communication_score DECIMAL(2,1) CHECK (communication_score BETWEEN 1 AND 5),
  communication_comments TEXT,
  teamwork_score DECIMAL(2,1) CHECK (teamwork_score BETWEEN 1 AND 5),
  teamwork_comments TEXT,
  problem_solving_score DECIMAL(2,1) CHECK (problem_solving_score BETWEEN 1 AND 5),
  problem_solving_comments TEXT,
  punctuality_score DECIMAL(2,1) CHECK (punctuality_score BETWEEN 1 AND 5),
  punctuality_comments TEXT,
  initiative_score DECIMAL(2,1) CHECK (initiative_score BETWEEN 1 AND 5),
  initiative_comments TEXT,

  -- Overall Assessment
  overall_score DECIMAL(3,2),
  overall_comments TEXT,
  strengths TEXT[], -- PostgreSQL array
  areas_for_improvement TEXT[],
  goals TEXT[],

  -- Manager's Decision
  evaluated_by UUID REFERENCES core.employees(id) ON DELETE SET NULL,
  recommended_action VARCHAR(30) CHECK (recommended_action IN ('promotion','salary_increase','training','maintain','improvement_plan','warning')),
  salary_recommendation DECIMAL(12,2),
  training_recommendations TEXT[],

  -- Employee Acknowledgment
  employee_acknowledged BOOLEAN DEFAULT FALSE,
  employee_comments TEXT,
  employee_acknowledged_date DATE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluations_employee_id ON hr.employee_evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluator_id ON hr.employee_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON hr.employee_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_period ON hr.employee_evaluations(evaluation_period);
CREATE INDEX IF NOT EXISTS idx_evaluations_date ON hr.employee_evaluations(evaluation_date);
CREATE INDEX IF NOT EXISTS idx_evaluations_overall_score ON hr.employee_evaluations(overall_score);