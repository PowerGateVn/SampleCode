import Link from 'next/link';
import { Dropdown, Menu } from 'antd';

import Image from 'src/components/Image';

import classes from './style.module.less';

type Props = {
	router: any;
};

const menu = ({ router }: Props) => (
	<Menu selectedKeys={[router?.locale]}>
		<Menu.Item key="id">
			<Link href={router?.asPath} locale="id">
				<a>
					<span
						aria-label="Bahasa Indonesia"
						style={{ marginRight: 8 }}
					>
						🇮🇩
					</span>
					Bahasa Indonesia
				</a>
			</Link>
		</Menu.Item>
		<Menu.Item key="en">
			<Link href={router?.asPath} locale="en">
				<a>
					<span aria-label="English" style={{ marginRight: 8 }}>
						🇺🇸
					</span>
					English
				</a>
			</Link>
		</Menu.Item>
	</Menu>
);

const SelectLang = (props: Props) => {
	return (
		<Dropdown
			overlay={menu(props)}
			placement="bottomRight"
			className={classes.lang}
		>
			<a onClick={(e) => e.preventDefault()}>
				<Image
					width={18}
					height={18}
					src="/icons/lang-white.svg"
					alt="Lang Icon"
				/>
			</a>
		</Dropdown>
	);
};

export const SelectLangLogin = (props: Props) => {
	return (
		<Dropdown
			overlay={menu(props)}
			placement="bottomRight"
			className={`${classes.lang} ${classes.login}`}
		>
			<a onClick={(e) => e.preventDefault()}>
				<Image
					width={18}
					height={18}
					src="/icons/lang-black.svg"
					alt="Lang Icon"
				/>
			</a>
		</Dropdown>
	);
};

export default SelectLang;
