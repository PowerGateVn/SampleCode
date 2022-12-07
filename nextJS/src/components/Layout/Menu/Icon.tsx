import { FC } from 'react';
import { AreaChartOutlined, MedicineBoxOutlined, QuestionCircleOutlined } from '@ant-design/icons';

interface IconMenuProps {
	type: string;
}

const IconMenu: FC<IconMenuProps> = (props: IconMenuProps) => {
	const Icons = {
		AreaChartOutlined: <AreaChartOutlined />,
		MedicineBoxOutlined: <MedicineBoxOutlined />,
	};

	const getIcon = (type: string) => {
		// Default Icon when not found
		let comp = <QuestionCircleOutlined />;

		let typeNew = type;

		// Default is Outlined when no theme was appended (ex: 'smile')
		if (!typeNew.match(/.+(Outlined|Filled|TwoTone)$/i)) {
			typeNew += 'Outlined';
		}

		// If found by key then return value which is component
		const found = Object.entries(Icons).find(([k]) => k.toLowerCase() === typeNew.toLowerCase());
		if (found) {
			[, comp] = found;
		}

		return comp;
	};

	return getIcon(props.type);
};

export default IconMenu;
