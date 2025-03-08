export function formateDate(time: number) {
  if (!time) {
    return "";
  }
  let date = new Date(time);
  let year: number | string = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();
  year = year < 10 ? "0" + year : year;
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  return `${year}-${month}-${day}`;
}
export function formateTime(time: number) {
  let dateMsg = formateDate(time);
  let date = new Date(time);
  let hour: number | string = date.getHours();
  let minute: number | string = date.getMinutes();
  let second: number | string = date.getSeconds();
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return `${dateMsg} ${hour}:${minute}:${second}`;
}
