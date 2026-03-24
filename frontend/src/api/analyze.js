import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export async function analyzeText({ input_type, content, options }) {
  const { data } = await api.post("/analyze", { input_type, content, options });
  return data;
}

export async function analyzeFile(file, options = {}) {
  const form = new FormData();
  form.append("file", file);
  form.append("mask", options.mask ?? true);
  form.append("block_high_risk", options.block_high_risk ?? true);
  const { data } = await api.post("/analyze/upload", form);
  return data;
}
