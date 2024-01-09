export function jsonToCSV({ formatedBoard }) {
  let csvData = "week,category,names\n";

  for (const [week, categories] of Object.entries(formatedBoard)) {
    for (const [category, names] of Object.entries(categories)) {
      const formattedNames = names.join(" / ");
      csvData += `${week},${category},"${formattedNames}"\n`;
    }
  }

  return csvData;
}
