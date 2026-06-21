export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";

  return new Date(dateTime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};