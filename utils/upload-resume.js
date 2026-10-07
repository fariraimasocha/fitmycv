import { extractResumeText } from "@/utils/extract-resume-client";

const STAGES = [
  { id: "preparing", label: "Preparing your file", start: 0, end: 8 },
  { id: "uploading", label: "Uploading PDF", start: 8, end: 42 },
  { id: "extracting", label: "Reading your PDF", start: 42, end: 58 },
  { id: "parsing", label: "Sorting your experience into sections", start: 58, end: 88 },
  { id: "saving", label: "Getting your details ready", start: 88, end: 100 },
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
 * Read a CV and send its text for parsing, with staged progress callbacks.
 * Pass `file` (a PDF read here in the browser) or `text` (pasted).
 *
 * ponytail: the PDF never leaves the browser. Posting the file to the Worker
 * died mid-body for some users (stuck at 5%, status 0), and pdf.js burns
 * Worker CPU. The browser already reads PDFs for the free tools.
 */
export async function uploadResumeWithProgress({ file, text }, onUpdate) {
  onUpdate({ progress: 2, stage: "preparing", label: STAGES[0].label });
  const rawText = text ?? (await extractResumeText(file));
  return postText(rawText, onUpdate);
}

function postText(rawText, onUpdate) {
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

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/resume/upload");
    xhr.setRequestHeader("Content-Type", "application/json");

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
            label: "Done. Check your details.",
          });
          resolve(body);
          return;
        }
        reject(new Error(body.error || "Couldn't upload your CV. Try again."));
      } catch {
        reject(new Error("Couldn't upload your CV. Try again."));
      }
    };

    xhr.onerror = () => {
      stopServerProgress();
      reject(
        new Error("Couldn't upload your CV. The connection dropped. Try again.")
      );
    };

    // A hung socket fails with a real message instead of spinning forever.
    xhr.timeout = 90000;
    xhr.ontimeout = () => {
      stopServerProgress();
      reject(new Error("Couldn't upload your CV. It took too long to read. Try again."));
    };

    xhr.onabort = () => {
      stopServerProgress();
      reject(new Error("Upload cancelled"));
    };

    emit(5, "preparing");
    xhr.send(JSON.stringify({ text: rawText }));
  });
}

export { STAGES as UPLOAD_STAGES };
