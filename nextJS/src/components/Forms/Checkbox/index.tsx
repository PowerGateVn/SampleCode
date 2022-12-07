import { Checkbox, Form } from 'antd';

interface DataType {
	value: any;
	label: string;
}

type Props = {
	name: string;
	options: DataType[];
	disabled?: boolean;
	useLabel?: boolean;
	label?: string;
	colon?: boolean;
	className?: string;
	rules?: object[];
};

const CheckboxC = (props: Props) => {
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
			<Checkbox.Group
				className={props.className}
				disabled={props.disabled}
				options={props.options}
			/>
		</Form.Item>
	);
};

export default CheckboxC;
