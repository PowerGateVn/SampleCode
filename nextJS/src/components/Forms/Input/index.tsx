import type { ReactNode } from 'react';
import { Form, Input, InputNumber } from 'antd';

type Size = 'large' | 'middle' | 'small';
type NamePath = string | number | (string | number)[];
type Props = {
	refInput?: any;
	name: NamePath;
	type?: string;
	readOnly?: boolean;
	disabled?: boolean;
	useLabel?: boolean;
	label?: string;
	colon?: boolean;
	className?: string;
	rules?: object[];
	size?: Size;
	min?: number;
	max?: number;
	rows?: number;
	maxLength?: number;
	showCount?: boolean;
	prefix?: ReactNode;
	suffix?: ReactNode;
};

const InputC = (props: Props) => {
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
			{props.type === 'number' ? (
				<InputNumber
					type="number"
					placeholder={props.label}
					className={props.className}
					readOnly={props.readOnly}
					disabled={props.disabled}
					size={props.size}
					min={props.min}
					max={props.max}
				/>
			) : props.type === 'password' ? (
				<Input.Password
					placeholder={props.label}
					className={props.className}
					readOnly={props.readOnly}
					disabled={props.disabled}
					size={props.size}
					prefix={props.prefix}
					suffix={props.suffix}
				/>
			) : props.type === 'textarea' ? (
				<Input.TextArea
					ref={props.refInput}
					placeholder={props.label}
					className={props.className}
					readOnly={props.readOnly}
					disabled={props.disabled}
					size={props.size}
					rows={props.rows}
					maxLength={props.maxLength}
					showCount={props.showCount}
				/>
			) : (
				<Input
					ref={props.refInput}
					placeholder={props.label}
					className={props.className}
					readOnly={props.readOnly}
					disabled={props.disabled}
					size={props.size}
					prefix={props.prefix}
					suffix={props.suffix}
				/>
			)}
		</Form.Item>
	);
};

export default InputC;
