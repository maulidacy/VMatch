import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Use any to avoid strict type coupling with parent component
type ProjectItem = any;

export function EditDraftModal({
  project,
  onClose,
  onSave,
}: {
  project: ProjectItem;
  onClose: () => void;
  onSave: (updated: ProjectItem) => void;
}) {
  const [formData, setFormData] = useState({
    project_name: project.name || "",
    project_type: project.type || "",
    location: project.location || "",
    room_size: project.roomSize || "",
    design_style: project.designStyle || "",
    budget: project.estimatedCost || "",
    start_target: project.startDate || "",
    finish_target: project.estimatedFinish || "",
    notes: project.notes || "",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("project_requests")
        .update({
          project_name: formData.project_name,
          project_type: formData.project_type,
          location: formData.location,
          room_size: formData.room_size,
          design_style: formData.design_style,
          budget: formData.budget,
          start_target: formData.start_target,
          finish_target: formData.finish_target,
          notes: formData.notes,
        })
        .eq("id", project.id);

      if (error) throw error;

      onSave({
        ...project,
        name: formData.project_name,
        type: formData.project_type,
        location: formData.location,
        roomSize: formData.room_size,
        designStyle: formData.design_style,
        estimatedCost: formData.budget,
        startDate: formData.start_target,
        estimatedFinish: formData.finish_target,
        notes: formData.notes,
      });
      onClose();
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-[14px] border border-[#E8E2D9] bg-[#FCFBF9] px-4 py-3.5 text-[13px] text-[#31332C] transition-all focus:border-[#725F54] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#725F54] placeholder:text-[#A39C94]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#31332C]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#31332C]">Edit Draft Proyek</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#7B756E] transition hover:bg-[#F5F2ED]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Nama Proyek</label>
              <input
                required
                className={inputClass}
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Jenis Proyek</label>
              <input
                required
                className={inputClass}
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Lokasi</label>
              <input
                className={inputClass}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Ukuran Ruangan</label>
              <input
                className={inputClass}
                value={formData.room_size}
                onChange={(e) => setFormData({ ...formData, room_size: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Style Desain</label>
              <input
                className={inputClass}
                value={formData.design_style}
                onChange={(e) => setFormData({ ...formData, design_style: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Budget</label>
              <input
                className={inputClass}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#31332C]">Catatan Tambahan</label>
            <textarea
              className={inputClass}
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-[#7B756E] hover:bg-[#F5F2ED]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#725F54] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#5A4A42] disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
