const STAGES = [
  { id: "preparing", label: "Preparing your file", start: 0, end: 8 },
  { id: "uploading", label: "Uploading PDF", start: 8, end: 42 },
  { id: "extracting", label: "Extracting text from PDF", start: 42, end: 58 },
  { id: "parsing", label: "Structuring your experience with AI", start: 58, end: 88 },
  { id: "saving", label: "Saving your CV", start: 88, end: 100 },
];

function getStageForProgress(progress) {
  return (
    STAGES.find((stage) => progress >= stage.start && progress < stage.end) ??
    STAGES[STAGES.length - 1]
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mapUploadProgress(ratio) {
  const uploading = STAGES.find((s) => s.id === "uploading");
  return uploading.start + ratio * (uploading.end - uploading.start);
}

/**
 * Upload a resume PDF with staged progress callbacks.
 * Upload bytes use real XHR progress; server-side work advances through labeled stages.
 */
export function uploadResumeWithProgress(file, onUpdate) {
  return new Promise((resolve, reject) => {
    let progress = 0;
    let serverTimer = null;
    let currentStageId = "preparing";

    const emit = (nextProgress, stageId) => {
      progress = clamp(nextProgress, 0, 99);
      if (stageId) currentStageId = stageId;
      const stage = STAGES.find((s) => s.id === currentStageId) ?? getStageForProgress(progress);
      onUpdate({
        progress,
        stage: stage.id,
        label: stage.label,
      });
    };

    const startServerProgress = () => {
      if (serverTimer) return;
      emit(STAGES.find((s) => s.id === "extracting").start, "extracting");

      serverTimer = setInterval(() => {
        if (progress >= 92) return;

        if (progress < 58) {
          emit(progress + 1.2, "extracting");
        } else if (progress < 88) {
          emit(progress + 0.9, "parsing");
        } else {
          emit(progress + 0.5, "saving");
        }
      }, 450);
    };

    const stopServerProgress = () => {
      if (serverTimer) {
        clearInterval(serverTimer);
        serverTimer = null;
      }
    };

    emit(2, "preparing");

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/resume/upload");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const ratio = event.loaded / event.total;
      emit(mapUploadProgress(ratio), "uploading");
    };

    xhr.upload.onload = () => {
      startServerProgress();
    };

    xhr.onload = () => {
      stopServerProgress();

      try {
        const body = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) {
          emit(100, "saving");
          onUpdate({
            progress: 100,
            stage: "complete",
            label: "Complete — your CV is ready",
          });
          resolve(body);
          return;
        }
        reject(new Error(body.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => {
      stopServerProgress();
      reject(new Error("Network error while uploading"));
    };

    xhr.onabort = () => {
      stopServerProgress();
      reject(new Error("Upload cancelled"));
    };

    emit(5, "preparing");
    xhr.send(formData);
  });
}

export { STAGES as UPLOAD_STAGES };
