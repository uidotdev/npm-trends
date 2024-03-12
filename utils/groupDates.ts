import dayjs from 'dayjs';

// Expect format:
// dates: [{"day":"2012-10-22","downloads":279},
//         {"day":"2012-10-23","downloads":2042}]
// period: 'week'
export const groupDownloadsByPeriod = (
  dates,
  period: 'week' | 'month' | 'year' = 'week',
  relative: boolean = false,
) => {
  const downloadsGroupedByPeriodRecord: Record<string, number> = {};

  dates.forEach((date) => {
    const startOfPeriodDate = dayjs(date.day).startOf(period).format('YYYY-MM-DD');

    downloadsGroupedByPeriodRecord[startOfPeriodDate] = downloadsGroupedByPeriodRecord[startOfPeriodDate]
      ? downloadsGroupedByPeriodRecord[startOfPeriodDate] + date.downloads
      : date.downloads;
  });

  const downloadsGroupedByPeriod = Object.entries(downloadsGroupedByPeriodRecord).map(([key, value]) => ({
    period: dayjs(key).toDate(),
    downloads: value,
  }));

  if (relative) {
    const initialDownloads = downloadsGroupedByPeriod[0].downloads;
    const maxDownloads = Math.max(...downloadsGroupedByPeriod.map(({ downloads }) => downloads));

    return downloadsGroupedByPeriod.map(({ period, downloads }) => ({
      period,
      downloads: ((downloads - initialDownloads) * 100) / maxDownloads,
    }));
  }

  return downloadsGroupedByPeriod;
};
