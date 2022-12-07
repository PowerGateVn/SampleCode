/**
 * This example previously used antd-dayjs-webpack-plugin
 * (https://github.com/ant-design/antd-dayjs-webpack-plugin) to attempt to
 * replace Moment.js with Day.js, but it would crash the page when the user
 * clicked on the DatePicker. Using this custom component (following Ant Design
 * guidelines at https://ant.design/docs/react/replace-moment) instead of the
 * webpack plugin fixes that bug.
 */
import { Form } from 'antd';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import locale from 'antd/lib/date-picker/locale/id_ID';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';

require('antd/es/date-picker/style/index.less');

type Picker = 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
type Size = 'large' | 'middle' | 'small';
type NamePath = string | number | (string | number)[];
type Props = {
	name: NamePath;
	picker?: Picker;
	format?: string;
	disabled?: boolean;
	disabledDate?: (currentDate: any) => boolean;
	useLabel?: boolean;
	label?: string;
	colon?: boolean;
	className?: string;
	rules?: object[];
	size?: Size;
};

const DatePicker = generatePicker(dayjsGenerateConfig);
const DatePickerC = (props: Props) => {
	const isRequired = props.rules
		? props.rules.filter((r: any) => r.required === true).length > 0
		: false;

	return (
		<Form.Item
			label={props.useLabel ? props.label : ''}
			colon={props.colon || false}
			name={props.name}
			required={isRequired}
			rules={props.rules}
		>
			<DatePicker
				locale={locale}
				placeholder={props.label}
				picker={props.picker}
				format={props.format}
				className={props.className}
				inputReadOnly
				disabled={props.disabled}
				disabledDate={props.disabledDate}
				size={props.size}
			/>
		</Form.Item>
	);
};

export default DatePickerC;
