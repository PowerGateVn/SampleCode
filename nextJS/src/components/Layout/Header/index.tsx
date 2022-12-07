import React, { useCallback } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
	BellOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Layout, Menu, Space } from 'antd';

import Image from 'src/components/Image';
import SelectLang from 'src/components/SelectLang';
import AuthStorage from 'src/utils/auth-storage';

import classes from './style.module.less';

type Props = {
	xs: boolean;
	router: any;
	visible: boolean;
	onVisible: (toggle: boolean) => void;
};

const { Header } = Layout;

const HeaderC = (props: Props) => {
	const { xs, router, visible, onVisible } = props;
	const { t } = useTranslation(['auth', 'common']);
	const auth = useSelector((state: RootStateOrAny) => state.auth);
	const dispatch = useDispatch();

	const handleLogout = useCallback(async () => {
		AuthStorage.destroy(() => {
			setTimeout(() => {
				dispatch({ type: 'LOGOUT_SUCCESS' });
			}, 1000);

			if (router?.pathname !== '/login') {
				router.push('/login');
			}
		});
	}, [dispatch, router]);

	const notifUser = (
		<Menu>
			<Menu.Item key="1">Notification</Menu.Item>
		</Menu>
	);

	const menuUser = (
		<Menu>
			<Menu.Item key="1" icon={<SettingOutlined />}>
				{t('common:setting')}
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
				{t('auth:logout')}
			</Menu.Item>
		</Menu>
	);

	return (
		<Header className={classes['header-fixed']}>
			<Link href="/">
				<a className={classes.logo}>
					<Image
						width={119}
						height={22}
						src="/images/kd-logo.svg"
						alt="Logo KlikDokter"
					/>
				</a>
			</Link>
			{xs &&
				React.createElement(
					visible ? MenuUnfoldOutlined : MenuFoldOutlined,
					{
						className: classes.trigger,
						onClick: () => onVisible(!visible),
					},
				)}
			<div className={classes.space} />
			<Space>
				<Dropdown
					overlay={notifUser}
					trigger={['click']}
					placement="bottomRight"
				>
					<div className={classes.bell}>
						<BellOutlined className={classes['bell-icon']} />
						<Badge
							count={5}
							overflowCount={99}
							size="small"
							className={classes['bell-badge']}
						/>
					</div>
				</Dropdown>
				<Dropdown overlay={menuUser} className={classes.lang}>
					<div className={classes['user-setting']}>
						<Avatar size={24} icon={<UserOutlined />} />
						<div>{auth.firstName}</div>
					</div>
				</Dropdown>
				<SelectLang router={router} />
			</Space>
		</Header>
	);
};

export default HeaderC;
