-- Add room_maintenance table to track maintenance requests
CREATE TABLE IF NOT EXISTS inventory.room_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES inventory.rooms(id) ON DELETE CASCADE,
  issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('ac', 'plumbing', 'electrical', 'furniture', 'cleaning', 'other')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  description TEXT NOT NULL,
  reported_by VARCHAR(100) NOT NULL,
  reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  assigned_to VARCHAR(100),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  cost NUMERIC(12,2),
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_room_maintenance_room_id ON inventory.room_maintenance(room_id);
CREATE INDEX IF NOT EXISTS idx_room_maintenance_status ON inventory.room_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_room_maintenance_priority ON inventory.room_maintenance(priority);
CREATE INDEX IF NOT EXISTS idx_room_maintenance_reported_at ON inventory.room_maintenance(reported_at DESC);

-- Add some sample maintenance data (optional, for testing)
-- INSERT INTO inventory.room_maintenance (room_id, issue_type, priority, description, reported_by, estimated_hours)
-- SELECT id, 'ac', 'high', 'Air conditioning not cooling properly', 'Housekeeping Staff', 4
-- FROM inventory.rooms
-- LIMIT 1;
