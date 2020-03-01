// Expect format:
// dates: [{"day":"2012-10-22","downloads":279},
//         {"day":"2012-10-23","downloads":2042}]
// period: 'week'
// start: '2015-5-14'
export const groupDates = (dates, period, start) => {
  const groupedDates = [];
  const startDate = Date.parse(start);

  let currentPeriod = startDate.is().sunday() ? startDate : startDate.next().sunday();
  let currentPeriodDownloads = 0;

  dates.forEach(date => {
    const dayObj = new Date(date.day);

    checkForCorrectPeriod();

    function checkForCorrectPeriod() {
      if (dayObj.isAfter(currentPeriod)) {
        // go to next period if this date does not fall in currentPeriod
        const currentPeriodFormatted = currentPeriod.toString('MMM d');
        groupedDates.push({ period: currentPeriodFormatted, downloads: currentPeriodDownloads });
        currentPeriod = currentPeriod.next().sunday();
        currentPeriodDownloads = 0;
        checkForCorrectPeriod();
      } else {
        currentPeriodDownloads += date.downloads;
      }
    }
  });

  return groupedDates;
};
