import { Form, Select } from 'antd';

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
	placeholder?: string;
	loading?: boolean;
	mode?: 'multiple' | 'tags' | undefined;
};

const SelectC = (props: Props) => {
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
			<Select
				className={props.className}
				disabled={props.disabled}
				placeholder={props.placeholder}
				loading={props.loading}
				mode={props.mode}
			>
				{props.options.map((o, i) => (
					<Select.Option value={o.value} key={i}>
						{o.label}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	);
};

export default SelectC;
