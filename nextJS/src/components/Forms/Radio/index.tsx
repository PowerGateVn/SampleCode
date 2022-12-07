import { Form, Radio, Space } from 'antd';

interface DataType {
	value: any;
	label: string;
}

type DirType = 'horizontal' | 'vertical';
type Props = {
	name: string;
	options: DataType[];
	disabled?: boolean;
	useLabel?: boolean;
	label?: string;
	colon?: boolean;
	direction?: DirType;
	className?: string;
	rules?: object[];
};

const RadioC = (props: Props) => {
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
			<Radio.Group className={props.className} disabled={props.disabled}>
				<Space direction={props.direction || 'horizontal'}>
					{props.options.map((o, i) => (
						<Radio value={o.value} key={i}>
							{o.label}
						</Radio>
					))}
				</Space>
			</Radio.Group>
		</Form.Item>
	);
};

export default RadioC;
