import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We'll try to use the ANON key if service role is missing. It might fail depending on RLS, but let's try.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  const bucketName = "vmatch-files";

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }

  const exists = buckets.find((b) => b.name === bucketName);
  if (exists) {
    console.log(`Bucket '${bucketName}' already exists. Updating to public...`);
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
    });
    if (updateError) {
      console.error("Error making bucket public:", updateError);
    } else {
      console.log(`Bucket '${bucketName}' is now public.`);
    }
    return;
  }

  console.log(`Creating bucket '${bucketName}'...`);
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
    fileSizeLimit: 10485760, // 10MB
  });

  if (error) {
    console.error("Error creating bucket:", error);
  } else {
    console.log("Successfully created bucket:", data);
  }
}

createBucket();
