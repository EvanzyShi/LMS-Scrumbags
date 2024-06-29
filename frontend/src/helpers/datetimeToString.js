const datetimeToString = (date) => {
  const formattedDate = new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC', // Adjust to your desired timezone
  });

  return formattedDate;
};

export default datetimeToString;