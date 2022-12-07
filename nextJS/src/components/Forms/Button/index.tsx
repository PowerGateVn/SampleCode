import { Button } from 'antd';

type Type = 'dashed' | 'default' | 'ghost' | 'link' | 'primary' | 'text';
type HTMLType = 'button' | 'reset' | 'submit';
type Size = 'large' | 'middle' | 'small';
type Props = {
	text: string;
	type?: Type;
	htmlType?: HTMLType;
	block?: boolean;
	loading?: boolean;
	size?: Size;
	className?: string;
	onClick?: (record?: any) => void;
};

const ButtonC = (props: Props) => {
	return (
		<Button
			type={props.type}
			block={props.block}
			htmlType={props.htmlType}
			loading={props.loading}
			size={props.size}
			className={props.className}
			onClick={props.onClick}
		>
			{props.text}
		</Button>
	);
};

export const ButtonOK = (props: Props) => {
	return (
		<ButtonC
			text={props.text}
			type="primary"
			block={props.block}
			htmlType={props.htmlType}
			loading={props.loading}
			size={props.size}
			className={props.className}
			onClick={props.onClick}
		/>
	);
};

export const ButtonCancel = (props: Props) => {
	return (
		<ButtonC
			text={props.text}
			block={props.block}
			htmlType={props.htmlType}
			loading={props.loading}
			size={props.size}
			className={props.className}
			onClick={props.onClick}
		/>
	);
};

export default ButtonC;
