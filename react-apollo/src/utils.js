export const formatDate = (UTCString) => {
  const [date, time] = UTCString.replace('Z', '').split('T');

  return `${date} - ${time}`;
}