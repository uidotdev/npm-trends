import moment from 'moment';

import { npmDownloadsURL } from 'utils/proxy';
import Fetch from './Fetch';

class PackageDownloads {
  static fetchDownloads = async (packageName, startDate, endDate) => {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    const apiDaysLimit = 540;
    const days = moment.duration(endMoment.diff(startMoment)).asDays();

    const requiredApiCalls = Math.ceil(days / apiDaysLimit);

    const responses = [];

    for (let i = 1; i <= requiredApiCalls; i += 1) {
      const callStartMoment = endMoment.clone().subtract(i * apiDaysLimit - 1, 'days');
      const callEndMoment = endMoment.clone().subtract((i - 1) * apiDaysLimit, 'days');

      const callStartDate = callStartMoment.isBefore(startMoment)
        ? startMoment.format('YYYY-MM-DD')
        : callStartMoment.format('YYYY-MM-DD');
      const callEndDate = callEndMoment.format('YYYY-MM-DD');

      const response = PackageDownloads.fetchFromApi(packageName, `${callStartDate}:${callEndDate}`);

      responses.push(response);
    }

    // Wait for responses to return and combine into single array
    const fetchedDownloads = await Promise.all(responses);

    fetchedDownloads.reverse();

    return {
      package: packageName,
      downloads: fetchedDownloads.reduce((acc, val) => acc.concat(val.downloads), []),
    };
  };

  static fetchFromApi = async (packageName, period): Promise<any> => {
    const url = npmDownloadsURL(`range/${period}/${packageName}`);
    return Fetch.getJSON(url);
  };

  static fetchPoint = async (packageName, period = 'last-month'): Promise<any> => {
    const url = npmDownloadsURL(`point/${period}/${packageName}`);
    return Fetch.getJSON(url);
  };
}

export default PackageDownloads;
