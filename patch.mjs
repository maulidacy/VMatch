import fs from 'fs';

let content = fs.readFileSync('src/app/dashboard/user/components/proyek-view.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  'getMyProjects,\n  getProgressLogs,',
  'getMyProjects,\n  getMyProjectRequests,\n  getProgressLogs,'
);
content = content.replace(
  'Project as DBProject,\n  QcChecklist as DBQcChecklist,',
  'Project as DBProject,\n  ProjectRequest as DBProjectRequest,\n  QcChecklist as DBQcChecklist,'
);

// 2. Types and Tabs
content = content.replace(
  'type ProjectFilter = "semua" | "aktif" | "menunggu" | "selesai";',
  'type ProjectFilter = "semua" | "aktif" | "menunggu" | "selesai" | "draft";'
);
content = content.replace(
  '{ id: "menunggu", label: "Menunggu" },\n  { id: "selesai", label: "Selesai" },',
  '{ id: "menunggu", label: "Menunggu" },\n  { id: "draft", label: "Draft" },\n  { id: "selesai", label: "Selesai" },'
);

// 3. Mapper
const mapperCode = `
function mapDbProjectRequestToItem(r: DBProjectRequest): ProjectItem {
  const filterMap: Record<string, ProjectFilter> = {
    "Draft": "draft",
    "Baru Masuk": "menunggu",
    "Review": "menunggu",
    "Estimasi": "menunggu",
  };

  return {
    id: r.id,
    filter: filterMap[r.status] || "menunggu",
    name: r.project_name || "Proyek Tanpa Nama",
    type: r.project_type || "-",
    status: r.status,
    progress: 0,
    location: r.location || "-",
    roomSize: r.room_size || "-",
    designStyle: r.design_style || "-",
    estimatedCost: r.budget || "-",
    estimatedDuration: "-",
    vendorPartner: "Belum dipilih",
    vendor_id: r.selected_vendor_id || null,
    startDate: "Menunggu jadwal",
    estimatedFinish: "Menunggu jadwal",
    nextStep: r.status === "Draft" ? "Lengkapi form dan kirim request." : "Menunggu update dari tim VMatch.",
    solution: r.ai_brief_summary || "Solusi akan ditampilkan setelah brief disetujui.",
    createdAt: r.submitted_at || new Date().toISOString(),
  };
}
`;
content = content.replace(
  'function mapDbProjectToItem(p: DBProject): ProjectItem {',
  mapperCode + '\nfunction mapDbProjectToItem(p: DBProject): ProjectItem {'
);

// 4. loadProjects
content = content.replace(
  `      const dbProjects = await getMyProjects(userId);\n      const mapped = dbProjects.map(mapDbProjectToItem);\n      setProjects(mapped);`,
  `      const [dbProjects, dbRequests] = await Promise.all([
        getMyProjects(userId),
        getMyProjectRequests(userId)
      ]);
      const mappedProjects = dbProjects.map(mapDbProjectToItem);
      const mappedRequests = dbRequests.map(mapDbProjectRequestToItem);
      
      const combined = [...mappedProjects, ...mappedRequests].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setProjects(combined);`
);

// 5. rabStatus & loadProjectDetail
content = content.replace(
  `  // RAB review state
  const [rabStatus, setRabStatus] = useState<RabReviewStatus>(
    projectData.filter === "menunggu" ? "RAB Diterima" : 
    projectData.filter === "selesai" ? "Disetujui" : "Menunggu RAB"
  );`,
  `  // RAB review state
  const isRequest = ["Baru Masuk", "Draft", "Review", "Estimasi"].includes(projectData.status);
  const [rabStatus, setRabStatus] = useState<RabReviewStatus>(
    isRequest ? "Menunggu RAB" :
    projectData.filter === "menunggu" ? "RAB Diterima" : 
    projectData.filter === "selesai" ? "Disetujui" : "Menunggu RAB"
  );`
);

content = content.replace(
  `    const loadProjectDetail = async () => {\n      try {`,
  `    const loadProjectDetail = async () => {
      if (["Baru Masuk", "Draft", "Review", "Estimasi"].includes(initialProjectData.status)) {
        return; // Don't load full details for pending requests
      }
      try {`
);

// 6. createDocuments
content = content.replace(
  `  ];\n}\n\nexport default function ProjectDetail`,
  `  ];\n\n  const isReq = ["Baru Masuk", "Draft", "Review", "Estimasi"].includes(projectData.status);\n  if (isReq) {\n    return allDocs.filter(doc => doc.status === "Tersedia");\n  }\n  return allDocs;\n}\n\nexport default function ProjectDetail`
);
content = content.replace(
  `  const dateStr = projectData.createdAt ? formatIndoDate(projectData.createdAt) : "Terbaru";\n\n  return [`,
  `  const dateStr = projectData.createdAt ? formatIndoDate(projectData.createdAt) : "Terbaru";\n\n  const allDocs: DocumentItem[] = [`
);

fs.writeFileSync('src/app/dashboard/user/components/proyek-view.tsx', content);
