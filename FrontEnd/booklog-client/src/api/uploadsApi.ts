import { http } from "./http";

export async function uploadCoverApi(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await http.post<{ url: string }>("/uploads/cover", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url; // "/uploads/xxxxx.png"
}
