import dayjs from 'dayjs';

// Expect format:
// dates: [{"day":"2012-10-22","downloads":279},
//         {"day":"2012-10-23","downloads":2042}]
// period: 'week'
export const groupDownloadsByPeriod = (dates, period: 'week' | 'month' | 'year' = 'week') => {
  const downloadsGroupedByPeriod = {};

  dates.forEach((date) => {
    const startOfPeriodDate = dayjs(date.day).startOf(period).format('YYYY-MM-DD');

    downloadsGroupedByPeriod[startOfPeriodDate] = downloadsGroupedByPeriod[startOfPeriodDate]
      ? downloadsGroupedByPeriod[startOfPeriodDate] + date.downloads
      : date.downloads;
  });

  return Object.entries(downloadsGroupedByPeriod).map(([key, value]) => ({
    period: dayjs(key).toDate(),
    downloads: value,
  }));
};
