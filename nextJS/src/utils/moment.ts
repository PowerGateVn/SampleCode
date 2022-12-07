import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.locale('id');

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(updateLocale);

dayjs.tz.setDefault('Asia/Jakarta');

dayjs.updateLocale('en', {
	weekdaysMin: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
	months: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'Mei',
		'Jun',
		'Jul',
		'Agu',
		'Sep',
		'Okt',
		'Nov',
		'Des',
	],
});

export const FORMAT_DATE = 'YYYY-MM-DD';

export default dayjs;
