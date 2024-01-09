import { Assignment } from "./model.js";

export const bulkCreateAssignment = async ({ assigments }) => {
  if (!Array.isArray(assigments)) throw new Error(`assigments must be an array`);
  const result = await Assignment.bulkCreate(assigments);
  return result;
};

export const saveBussyPersonAssignment = async ({ bussy }) => {
  if (!Array.isArray(bussy)) throw new Error(`bussy must be an array`);
  const result = await Assignment.bulkCreate(bussy);
  return result;
};

export const checkIfAlreadyAssignByWeek = async ({ week, month, year }) => {
  const result = await Assignment.findAndCountAll({
    where: {
      week,
      month,
      year,
    },
  });

  return result.count === 5;
};

export const findPersonAssignByWeek = async ({ week, year, month }) => {
  const result = await Assignment.findAll({
    attributes: ["person"],
    where: {
      week,
      month,
      year,
    },
  });

  return result
    .map((data) => data.dataValues)
    .map(({ person }) => {
      person.includes("/")
        ? person
            .split("/")
            .flat()
            .map((item) => item.trim())
        : person;
    });
};

export const findMonthAssignment = async ({ month, year }) => {
  const result = await Assignment.findAll({
    attributes: ["week", "role", "person"],
    where: {
      month,
      year,
    },
  });

  return result.map((data) => data.dataValues);
};

export const findWeekAssignment = async ({ week }) => {
  const result = await Assignment.findAll({
    attributes: ["id"],
    where: { week },
  });

  return !!result.length
}
