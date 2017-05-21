
export const groupDates = function(dates, period, start, end){
	// Expect format:
	// dates: [{"day":"2012-10-22","downloads":279},
	//         {"day":"2012-10-23","downloads":2042}]
	// period: 'week'
	// start: '2015-5-14'
	// end: '2015-11-17'
	var groupedDates = []
	var startDate = Date.parse(start);
	var endDate = Date.parse(end);
	var currentPeriod = startDate.is().sunday() ? startDate : startDate.next().sunday();
	var currentPeriodDownloads = 0;
	dates.forEach(function(date, i){
		var dayObj = new Date(date.day);
	
		checkForCorrectPeriod();

		function checkForCorrectPeriod(){
			if( dayObj.isAfter(currentPeriod) ){
				// go to next period if this date does not fall in currentPeriod
				var currentPeriodFormatted = currentPeriod.toString("MMM d");
				groupedDates.push({period: currentPeriodFormatted, downloads: currentPeriodDownloads});
				currentPeriod = currentPeriod.next().sunday();
				currentPeriodDownloads = 0;
				checkForCorrectPeriod();
			}else{				
				currentPeriodDownloads += date.downloads;
				return;
			}
		}

	});

	return groupedDates;
}