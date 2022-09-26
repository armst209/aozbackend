import dayjs from "dayjs";

const getCurrentDateTimeInEST = () => {
  let currentDate = dayjs().toDate();
  currentDate.setTime(
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000
  );
  const offset = -480; //Timezone offset for EST in minutes.
  const estDate = new Date(currentDate.getTime() + offset * 60 * 1000);

  return estDate;
};

export default getCurrentDateTimeInEST;
