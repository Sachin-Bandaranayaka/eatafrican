-- Add user_agent column to activity_logs table
ALTER TABLE activity_logs ADD COLUMN user_agent TEXT;
