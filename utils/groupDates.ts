import moment from 'moment';

// Expect format:
// dates: [{"day":"2012-10-22","downloads":279},
//         {"day":"2012-10-23","downloads":2042}]
// period: 'week'
export const groupDownloadsByPeriod = (dates, period: moment.unitOfTime.StartOf = 'week') => {
  const downloadsGroupedByPeriod = {};

  dates.forEach((date) => {
    const startOfPeriodDate = moment(date.day).startOf(period).format('YYYY-MM-DD');

    downloadsGroupedByPeriod[startOfPeriodDate] = downloadsGroupedByPeriod[startOfPeriodDate]
      ? downloadsGroupedByPeriod[startOfPeriodDate] + date.downloads
      : date.downloads;
  });

  return Object.entries(downloadsGroupedByPeriod).map(([key, value]) => ({
    period: moment(key).toDate(),
    downloads: value,
  }));
};
