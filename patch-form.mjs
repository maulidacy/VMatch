import fs from 'fs';

let content = fs.readFileSync('src/app/dashboard/user/components/new-project-form.tsx', 'utf-8');

// 1. Add state for showConfirmModal
content = content.replace(
  '    const [isRegenerating, setIsRegenerating] = useState(false);',
  '    const [isRegenerating, setIsRegenerating] = useState(false);\n    const [showConfirmModal, setShowConfirmModal] = useState(false);'
);

// 2. Change handleUseBrief
content = content.replace(
  `    const handleUseBrief = () => {
        setIsBriefSelected(true);
        setRequestStatus("selected");
        toast.success(
            "Brief ini sudah dipilih untuk review. Ini belum mengirim request proyek.",
        );
    };`,
  `    const handleUseBrief = () => {
        setShowConfirmModal(true);
    };`
);

// 3. Remove ReviewSubmitCard and add Manual submit buttons & Confirm Modal
const renderBlock = `            {mode === "ai" ? (
                <AiBriefForm
                    description={aiDescription}
                    onDescriptionChange={setAiDescription}
                    uploadedFiles={uploadedFiles}
                    onFilesChange={setUploadedFiles}
                    generatedBrief={generatedBrief}
                    isGenerating={isGenerating}
                    onGenerateBrief={handleGenerateBrief}
                >
                    {generatedBrief && briefResult && (
                        <BriefResultCard
                            data={briefResult}
                            isSelected={isBriefSelected}
                            isRegenerating={isRegenerating}
                            onChangeData={handleChangeBriefData}
                            onUseBrief={handleUseBrief}
                            onRegenerate={handleRegenerateBrief}
                        />
                    )}
                </AiBriefForm>
            ) : (
                <div className="space-y-6 w-full">
                    <ManualBriefForm
                        form={manualForm}
                        selectedInspiration={selectedInspiration}
                        onRemoveReference={handleRemoveReference}
                        onChange={(key, value) =>
                            setManualForm((prev) => ({ ...prev, [key]: value }))
                        }
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isGenerating || submitting}
                            className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9] disabled:opacity-50"
                        >
                            Simpan Draft
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmitRequest}
                            disabled={isGenerating || submitting}
                            className="h-11 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42] disabled:opacity-50"
                        >
                            {submitting ? "Mengirim..." : "Kirim Request Proyek"}
                        </button>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="font-serif text-[22px] font-semibold text-[#31332C]">
                            Konfirmasi Request
                        </h3>
                        <p className="mt-3 text-[13px] leading-6 text-[#7B756E]">
                            Brief kamu sudah siap! Apakah kamu ingin menyimpannya sebagai draft untuk dilanjutkan nanti, atau langsung mengirim request proyek sekarang?
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                }}
                                className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#725F54] transition hover:bg-[#FCFBF9]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    handleSaveDraft();
                                }}
                                disabled={isGenerating || submitting}
                                className="h-11 rounded-xl border border-[#E4D8CD] px-5 text-[12px] font-semibold text-[#31332C] transition hover:bg-[#FCFBF9] disabled:opacity-50"
                            >
                                Simpan Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    handleSubmitRequest();
                                }}
                                disabled={isGenerating || submitting}
                                className="h-11 rounded-xl bg-[#725F54] px-5 text-[12px] font-semibold text-white transition hover:bg-[#5A4A42] disabled:opacity-50"
                            >
                                Kirim Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}`;

content = content.replace(
  /            \{mode === "ai" \? \([\s\S]*?            <\/section>\n        <\/div>\n    \);\n}/,
  renderBlock
);

fs.writeFileSync('src/app/dashboard/user/components/new-project-form.tsx', content);
