
export const Hours = () => {
  const hours: number[] = [];
  for (let i = 0; i < 24; i++) hours.push(i);
  return hours;
};

export const Minutes = () => {
  const minutes: number[] = [];
  for (let i = 0; i < 6; i++) minutes.push(i * 10);
  return minutes;
};

export const Months = () => {
  let currentDate = new Date();
  const months: { id: number; name: string | undefined }[] = [];
  const firstMonth = currentDate.getMonth();
  months.push({
    id: currentDate.getMonth(),
    name: monthsNames.get(currentDate.getMonth()),
  });
  currentDate.setDate(currentDate.getDate() + 14);

  // If you add 14 days and previous month equal new month, nothing push
  if (firstMonth !== currentDate.getMonth()) {
    months.push({
      id: currentDate.getMonth(),
      name: monthsNames.get(currentDate.getMonth()),
    });
  }
  return months;
};

export const Days = (monthId: number) => {
  let currentDate = new Date();
  const allDays: number[] = [];
  for (let i = 0; i < 14; i++) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getMonth() === monthId) allDays.push(currentDate.getDate());
  }
  return allDays;
};

export const MeetingDurationMinutes = () => {
  const minutes: number[] = [];
  for (let i = 1; i < 19; i++) minutes.push(i * 10);
  return minutes;
};

export const TimeZone = () => {
  let currentDate = new Date();
  return currentDate.getTimezoneOffset();
};

export const ConvertedEndDate = (
  dayOfMonth: number,
  month: number,
  hourOfDay: number,
  minute: number,
  meetingDurationMinutes: number
) => {
  const date = new Date();
  const minutes = Number(minute) + Number(meetingDurationMinutes);
  const newDate = new Date(
    date.getFullYear(),
    month,
    dayOfMonth,
    hourOfDay,
    minutes
  );
  return {
    dayOfMonth: newDate.getDate(),
    hourOfDay: newDate.getHours(),
    minute: newDate.getMinutes(),
    month: Number(newDate.getMonth()) + 1,
    timeZoneOffset: TimeZone(),
  };
};

let monthsNames = new Map([
  [0, "Январь"],
  [1, "Февраль"],
  [2, "Март"],
  [3, "Апрель"],
  [4, "Май"],
  [5, "Июнь"],
  [6, "Июль"],
  [7, "Август"],
  [8, "Сентябрь"],
  [9, "Октябрь"],
  [10, "Ноябрь"],
  [11, "Декабрь"],
]);


