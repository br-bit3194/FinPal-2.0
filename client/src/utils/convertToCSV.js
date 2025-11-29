export const convertToCSV = (data) => {
  const header = Object.keys(data[0]).join(","); // title, amount, createdAt
  const rows = data.map((row) =>
    Object.values(row).join(",")
  );
  return [header, ...rows].join("\n");
};
