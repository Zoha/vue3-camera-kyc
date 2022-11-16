import type { ApiResponse } from "@/customTypes";
import { getVerificationToken } from "@/utils/getVerificationToken";

export async function uploadVideo(blob: Blob) {
  const token = getVerificationToken();

  const fd = new FormData();
  fd.append("file", blob);
  fd.append("__RequestVerificationToken", token);

  const res = await fetch((window as any).apiUrls.sendVideoApiUrl, {
    method: "POST",
    body: fd,
  });

  const resJson: ApiResponse = await res.json();

  if (resJson.redirectUrl) {
    window.location.href = resJson.redirectUrl;
  }
}
