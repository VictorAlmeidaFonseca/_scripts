import { startOfMonth, endOfMonth, eachWeekOfInterval, format, addDays } from "date-fns";

export function getWeeklyPeriodsOfMonth({ year, month }) {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  const weeks = eachWeekOfInterval(
    {
      start: startDate,
      end: endDate,
    },
    { weekStartsOn: 1 } // 0 = domingo, 1 = segunda-feira
  );

  return weeks.map((weekStart, index, array) => {
    const weekEnd = addDays(weekStart, 6); // O fim da semana é 6 dias após o início
    const isLastWeek = index === array.length - 1;

    let formattedStart = format(weekStart, "dd");
    let formattedEnd = format(weekEnd, "dd");

    // Se o mês do início e do fim são diferentes, incluir o mês no formato
    if (weekStart.getMonth() !== weekEnd.getMonth()) {
      formattedStart += `/${format(weekStart, "MM")}`;
      formattedEnd += `/${format(weekEnd, "MM")}`;
    } else if (Number(formattedStart) > Number(formattedEnd) && isLastWeek && weekEnd.getDate() === endDate.getDate()) {
      // Se o mês for o mesmo e for a última semana, incluir o mês no final
      formattedEnd += `/${format(weekEnd, "MM")}`;
    }

    if(index === 0 && formattedStart.includes('/') && formattedEnd.includes('/')) return

    return `${formattedStart}-${formattedEnd}`;
  }).filter(Boolean)
}