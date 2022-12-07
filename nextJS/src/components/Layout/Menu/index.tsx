import { useEffect, useState } from 'react';
import { Menu } from 'antd';

import MENUS from 'src/constants/menus';

import IconMenu from './Icon';

type Props = {
	router: any;
	onVisible?: (toggle: boolean) => void;
};

const { SubMenu } = Menu;
const MenuC = (props: Props) => {
	const [activeMenu, setActiveMenu] = useState<any>(undefined);
	const [activeSMenu, setActiveSMenu] = useState<any>(undefined);
	const { router, onVisible } = props;

	const menuActive = (path: string) => {
		const pathArr = path.split('/');
		const menu = pathArr[1];
		let menuS = undefined;

		if (menu) {
			const getMKey = MENUS.find((m) => m.path === '/' + menu);

			if (getMKey) {
				const getSMKey = getMKey.submenus.find(
					(sm) => sm.path === '/' + (pathArr[2] || 'index'),
				);

				menuS = getSMKey?.key;
			}
		}

		setActiveMenu(menu);
		setActiveSMenu(menuS);
	};

	const onOpenChange = (keys: any) => {
		const keysLen = keys.length;
		const openKeys = keys[keysLen - 1];
		const menu = openKeys;

		setActiveMenu(menu);
		setActiveSMenu(undefined);
	};

	const onClick = (path: string) => {
		const setPath = path.replace('/index', '');
		if (onVisible) {
			onVisible(false);
		}

		menuActive(setPath);
		router.push(setPath);
	};

	useEffect(() => {
		const { asPath, pathname } = router;
		let mAct = asPath;

		if (pathname.indexOf('/[action]/[uid]') !== - 1) {
			mAct = pathname.replace('/[action]/[uid]', '/add');
		}

		menuActive(mAct);
	}, [router, router.asPath]);

	return (
		<Menu
			mode="inline"
			openKeys={[activeMenu]}
			selectedKeys={[activeSMenu]}
			className="menu-left"
			onOpenChange={onOpenChange}
		>
			{MENUS.map((m) => {
				if (m.submenus.length) {
					return (
						<SubMenu
							key={m.key}
							title={m.title}
							icon={<IconMenu type={m.icon} />}
						>
							{m.submenus.map((sm: any) => (
								<Menu.Item
									key={sm.key}
									onClick={() => onClick(m.path + sm.path)}
								>
									{sm.title}
								</Menu.Item>
							))}
						</SubMenu>
					);
				}

				return (
					<Menu.Item
						key={m.key}
						icon={<IconMenu type={m.icon} />}
						onClick={() => onClick(m.path)}
					>
						{m.title}
					</Menu.Item>
				);
			})}
		</Menu>
	);
};

export default MenuC;
