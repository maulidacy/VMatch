import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://okgceuqocdtoawqctzlr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZ2NldXFvY2R0b2F3cWN0emxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTcxNTIsImV4cCI6MjA5MzM3MzE1Mn0.n1lXV-NOe4kOWo8qz9mnLS6a3T0ILiltU7oYp5lrQYI'
);

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('vmatch-files', { public: true });
  console.log('Bucket creation:', { data, error });
}

createBucket();
