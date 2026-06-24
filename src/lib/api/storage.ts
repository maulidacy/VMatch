import { createClient } from "@/lib/supabase/client";

const supabase = () => createClient();

/**
 * Uploads a file to a Supabase Storage bucket.
 * @param bucketName The name of the storage bucket (e.g. "vmatch-files")
 * @param path The path where the file will be stored (e.g. "progress/uuid.jpg")
 * @param file The file object to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToStorage(
  bucketName: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase()
    .storage
    .from(bucketName)
    .upload(path, file, {
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw error;
  }

  // Get the public URL for the uploaded file
  const { data } = supabase().storage.from(bucketName).getPublicUrl(path);
  
  return data.publicUrl;
}
