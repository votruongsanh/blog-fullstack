import dayjs from "dayjs";

export const formatDate = (dateString: string) => {
  const date = dayjs(dateString).format("DD-MM-YYYY HH:mm:ss");
  return date;
};

export const deepClone = <T>(v: T): T => {
  if (typeof structuredClone === "function") return structuredClone(v);
  try {
    return JSON.parse(JSON.stringify(v));
  } catch {
    return v;
  }
};
