import board from "../consts/board.js";
import { personRoles, ATTENDANTS, AUDIO_AND_VIDEO, MICROPHONES, PLATAFORM_ATTENDANT } from "../consts/roles.js";
import { findPersonAssignByWeek, findMonthAssignment, bulkCreateAssignment } from "../db/queries.js";
import { jsonToCSV } from "../scripts/csv.js";

export const dbFlow = async ({ month, year, weeks }) => {
  let csvData = "week,category,names\n";

  const monthlyAssignment = await findMonthAssignment({ month, year });
  const assignWeeks = monthlyAssignment.map((assign) => assign.week);

  const allAssign = weeks.every((week) => assignWeeks.includes(week));
  if (allAssign) {
    monthlyAssignment.forEach((data) => {
      csvData += `${data.week},${data.role},"${data.person}"\n`;
    });
    return { csvData, jsonData: monthlyAssignment };
  }
};

export const generateFlow = async ({ weeks, lastWeek, year, month, alert }) => {
  for await (const [week, assignmet] of Object.entries(board)) {
    if (!assignmet.BUSSY.length) continue;

    const avaliables = Object.keys(personRoles);

    do {
      const random = Math.floor(Math.random() * avaliables.length);

      const currentPerson = avaliables[random];
      if (!currentPerson) break;

      const remove = avaliables.splice(random, 1);

      const assignFromLastWeekOfLastMonth = await findPersonAssignByWeek({
        year,
        month,
        week: lastWeek,
      });

      const personAssign = [
        ...assignFromLastWeekOfLastMonth,
        ...assignmet.ATTENDANTS,
        ...assignmet.AUDIO_AND_VIDEO,
        ...assignmet.BUSSY,
        ...assignmet.MICROPHONES,
        ...assignmet.PLATAFORM_ATTENDANT,
      ];

      const alreadyAssign = personAssign.includes(currentPerson);
      if (alreadyAssign) continue;

      const hasLastWeek = week > 1;
      if (hasLastWeek) {
        const lastWeek = board[week - 1];
        const lastWeekPersonAssign = [
          ...lastWeek.ATTENDANTS,
          ...lastWeek.AUDIO_AND_VIDEO,
          ...lastWeek.MICROPHONES,
          ...lastWeek.PLATAFORM_ATTENDANT,
        ];

        const alreadyAssign = lastWeekPersonAssign.includes(currentPerson);
        if (alreadyAssign) continue;
      }

      const canMicrophone = personRoles[currentPerson].includes(MICROPHONES);
      if (canMicrophone) {
        const addMicrophone = await assignMicrophone(currentPerson, assignmet.MICROPHONES);
        if (addMicrophone) continue;
      }

      const canAttendant = personRoles[currentPerson].includes(ATTENDANTS);
      if (canAttendant) {
        const addAttendants = await assignAttendants(currentPerson, assignmet.ATTENDANTS);
        if (addAttendants) continue;
      }

      const canAudioAndVideo = personRoles[currentPerson].includes(AUDIO_AND_VIDEO);
      if (canAudioAndVideo) {
        const addAudioAndVideo = await assignAudioAndVideo(currentPerson, assignmet.AUDIO_AND_VIDEO);
        if (addAudioAndVideo) continue;
      }

      const canPlataformAttendant = personRoles[currentPerson].includes(PLATAFORM_ATTENDANT);
      if (canPlataformAttendant) {
        const addPlataformAttendant = await assignPlataformAttendant(currentPerson, assignmet.PLATAFORM_ATTENDANT);
        if (addPlataformAttendant) continue;
      }

      const done = await isFull(assignmet);
      if (done) break;
    } while (true);
  }

  const formatedBoard = {};
  weeks.forEach((week, index) => {
    if (board[index]) formatedBoard[week] = board[index];
  });

  const assigments = [];

  for await (const [week, categories] of Object.entries(formatedBoard)) {
    for (const [category, names] of Object.entries(categories)) {
      
      const formattedNames = !names.length && !categories.BUSSY.length ? alert : names.join(" / ");
      assigments.push({
        week,
        month,
        year,
        role: category,
        person: formattedNames,
      });
    }
  }

  if (assigments.length > 0) {
    await bulkCreateAssignment({ assigments });
    const csvData = jsonToCSV({ formatedBoard });
    return { csvData, jsonData: assigments };
  }
};

async function assignMicrophone(person, all) {
  if (all.length === 3) return false;
  all.push(person);
  return true;
}

async function assignAttendants(person, all) {
  if (all.length === 2) return false;
  all.push(person);
  return true;
}

async function assignAudioAndVideo(person, all) {
  if (all.length === 2) return false;
  all.push(person);
  return true;
}

async function assignPlataformAttendant(person, all) {
  if (all.length === 1) return false;
  all.push(person);
  return true;
}

async function isFull(assignmets) {
  return (
    assignmets.MICROPHONES.length === 3 &&
    assignmets.ATTENDANTS.length === 2 &&
    assignmets.AUDIO_AND_VIDEO.length === 2 &&
    assignmets.PLATAFORM_ATTENDANT.length === 1
  );
}
