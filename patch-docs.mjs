import fs from 'fs';

let content = fs.readFileSync('src/app/dashboard/user/components/proyek-view.tsx', 'utf-8');

// 1. Add fields to ProjectItem
content = content.replace(
  '  solution: string;\n  createdAt: string;',
  '  solution: string;\n  createdAt: string;\n  uploadedFiles?: string[];\n  notes?: string | null;\n  aiDescription?: string | null;\n  aiBriefSummary?: string | null;'
);

// 2. Update mapDbProjectRequestToItem
content = content.replace(
  'createdAt: r.submitted_at || new Date().toISOString(),\n  };',
  'createdAt: r.submitted_at || new Date().toISOString(),\n    uploadedFiles: (r as any).uploaded_files || [],\n    notes: r.notes,\n    aiDescription: r.ai_description,\n    aiBriefSummary: r.ai_brief_summary,\n  };'
);

// 3. Update createDocuments to check isRequest for Solusi Awal VMatch
content = content.replace(
  '    {\n      id: "doc-2",\n      title: "Solusi Awal VMatch",\n      category: "Solusi Proyek",\n      status: "Tersedia",\n      date: dateStr,',
  '    {\n      id: "doc-2",\n      title: "Solusi Awal VMatch",\n      category: "Solusi Proyek",\n      status: ["Baru Masuk", "Draft", "Review", "Estimasi"].includes(projectData.status) ? "Belum tersedia" : "Tersedia",\n      date: dateStr,'
);

// 4. Update Document tab to show modal
// First, find where handleDownload is defined. It's inside DocumentTab or ProjectDetail.
// Actually, handleDownload is inside `DocumentTab` ? No, wait, in my previous view it was:
// `const handleDownload = (doc: DocumentItem) => { ... }` inside `ProjectDetail`? No, let me grep for handleDownload.
