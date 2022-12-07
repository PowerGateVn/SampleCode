const moment = require('moment');

/**
 * check whether current time is in period of earliest and latest time.
 *
 * earliest and latest are time string in format HH:mm, using 24-hours notion.
 * if latest time is lower than start time, it will be using next day's time.
 *
 * when earliest or latest is undefined or null, it will return false.
 *
 * @param {number} timezone
 * @param {string} earliest
 * @param {string} latest
 */
function checkNowIsInPeriod(timezone, earliest, latest) {
  if (!earliest || !latest) {
    return false;
  }

  const [hourEarliest, minuteEarliest] = earliest
    .split(':')
    .map(a => parseInt(a, 10));

  const [hourLatest, minuteLatest] = latest
    .split(':')
    .map(a => parseInt(a, 10));

  let earliestPickUpTime = moment(new Date())
    .utcOffset(timezone * 60)
    .set({
      hours: hourEarliest,
      minutes: minuteEarliest
    });

  let latestPickUpTime = moment(new Date())
    .utcOffset(timezone * 60)
    .set({ hour: hourLatest, minute: minuteLatest });

  // timeDiff: earliestTime.getTime() - latestTime.getTime()
  // difference between earlier time and latest time.
  const timeDiff = moment(earliestPickUpTime.toDate()).diff(
    latestPickUpTime.toDate(),
    'seconds'
  );

  const now = moment(new Date()).utcOffset(timezone * 60);

  // if timeDiff is bigger than 0, it means the earliest time
  // is in future of latest time, we need some post processing of them
  // so that earliest time will be earlier than latest time.
  if (timeDiff > 0) {
    const timeDiffSinceEarliestPickupTime = moment(now.toDate()).diff(
      earliestPickUpTime.toDate(),
      'seconds'
    );
    if (timeDiffSinceEarliestPickupTime < 0) {
      // if current time does not pass the earliest time
      // what we need to do is to check from previous day's earliest time to
      // current day's latest time
      // i.e. 11:00pm of (T-1) to 10:pm of T.
      // if we check 11:00pm of T to 10:00pm of T+1, it will never succeed.
      // take current time as 10:30pm and 8:30pm as example:
      // 10:30pm is not in the range, but 8:30 are in the range.
      earliestPickUpTime = moment(new Date())
        .utcOffset(timezone * 60)
        .subtract(1, 'days')
        .set({
          hours: hourLatest,
          minute: minuteLatest
        });
    } else {
      // however if current time is pass the earliest time
      // for example, if earliest time is 7:00pm and latest time is 6:00am
      // and current time is 10:pm.
      // what we need to do is to check again current day's range
      // i.e. 7:00pm of T to 6:00am of T+1
      latestPickUpTime = moment(new Date())
        .utcOffset(timezone * 60)
        .add(1, 'days')
        .set({
          hours: hourLatest,
          minute: minuteLatest
        });
    }
  }
  // if earliest pickup time is earlier than latest pickup time
  // we can just check against the range.
  return now.isBetween(earliestPickUpTime, latestPickUpTime);
}

export default {
  checkNowIsInPeriod
};
