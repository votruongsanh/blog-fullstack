import dayjs from "dayjs";

export const formatDate = (dateString: string) => {
  const date = dayjs(dateString).format("DD-MM-YYYY HH:mm:ss");
  return date;
};
