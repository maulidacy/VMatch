const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://okgceuqocdtoawqctzlr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZ2NldXFvY2R0b2F3cWN0emxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTcxNTIsImV4cCI6MjA5MzM3MzE1Mn0.n1lXV-NOe4kOWo8qz9mnLS6a3T0ILiltU7oYp5lrQYI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('project_requests')
    .insert({
      customer_id: '123e4567-e89b-12d3-a456-426614174000',
      project_name: 'Test Project',
      project_type: 'Kamar Mandi',
      design_style: 'Classic',
      location: 'Belum ditentukan',
      room_size: null,
      budget: 'Di bawah Rp30 juta',
      material_preference: null,
      material_package: null,
      reference_name: null,
      start_target: null,
      finish_target: null,
      notes: null,
      ai_description: 'test',
      ai_brief_summary: 'test',
      inspiration_reference: null,
      status: 'Draft',
      uploaded_files: null
    });
  console.log('Error:', error);
}

run();
