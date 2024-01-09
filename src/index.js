import { writeFile } from "fs";
import { getWeeklyPeriodsOfMonth } from "./scripts/weeks.js";
import { dbFlow, generateFlow } from "./scripts/flow.js";
import { createPdf } from "./scripts/pdf.js";

import { sequelize } from "./db/model.js";

async function handler() {
  await sequelize.sync();

  const year = 2024;
  const month = 2;
  const weeks = getWeeklyPeriodsOfMonth({ year, month });
  const lastMonthWeeks = getWeeklyPeriodsOfMonth({ year: 2024, month: 1 });
  const lastWeek = lastMonthWeeks[lastMonthWeeks.length - 1];
  const alert = false;

  let jsonData;

  const fromDb = await dbFlow({ month, year, weeks });
  if (fromDb) {
    jsonData = fromDb.jsonData;
  } else {
    const generate = await generateFlow({ weeks, lastWeek, year, month, alert });
    if (generate) jsonData = generate.jsonData;
  }

  await createPdf({ jsonData, weeks, alert });
}

handler()
  .then((_) => console.log("work"))
  .catch((e) => console.log(e));
