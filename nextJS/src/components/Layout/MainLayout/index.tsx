import { useState } from 'react';
import Link from 'next/link';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Breadcrumb, Drawer, Grid, Layout, PageHeader } from 'antd';

import Footer from 'src/components/Layout/Footer';
import Header from 'src/components/Layout/Header';
import Menu from 'src/components/Layout/Menu';
import ucwords from 'src/utils/ucwords';

// import CookieAlert from 'src/components/CookieAlert';
import classes from './style.module.less';

type PageProps = {
	ctx: any;
	pageProps: object;
};

const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;

const MainLayout = (props: any) => {
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	const { router, children, pageTitle, pageHeader } = props;
	const { xs, sm, lg } = useBreakpoint();

	let collapsedWidth = 48;
	let marginLeft = 200;
	if (xs) {
		collapsedWidth = 0;
		marginLeft = 0;

		if (!collapsed) {
			setCollapsed(true);
		}
	} else if (sm || lg) {
		if (collapsed) {
			marginLeft = 48;
		} else {
			marginLeft = 200;
		}
	}

	const onCollapse = (toggle: boolean) => {
		setCollapsed(toggle);
	};

	const onVisible = (toggle: boolean) => {
		setVisible(toggle);
	};

	const getBreadcrumb = () => {
		const asPath = router?.asPath.split('/');
		const pathname = router?.pathname;

		asPath?.shift();
		if (pathname.indexOf('/[action]/[uid]') !== -1) {
			asPath?.pop();
		}

		return asPath?.map((r: any) => {
			return {
				path: '/' + r,
				breadcrumbName: ucwords(r),
			};
		});
	};

	const itemRender = () => {
		const bc = getBreadcrumb();
		return bc.map((r: any, i: number) => {
			if (bc.length === i + 1) {
				return <span key={i}>{r.breadcrumbName}</span>;
			}

			return (
				<Breadcrumb.Item key={i}>
					<Link href={r.path}>{r.breadcrumbName}</Link>
				</Breadcrumb.Item>
			);
		});
	};

	return (
		<Layout className={classes.container}>
			<Header xs={xs || false} router={router} visible={visible} onVisible={onVisible} />
			<Layout className={classes['layout-body']} hasSider>
				<Sider
					trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					collapsible
					collapsed={collapsed}
					collapsedWidth={collapsedWidth}
					onCollapse={onCollapse}
					breakpoint="lg"
					className={classes['sider-fixed']}
				>
					<Menu router={router} />
				</Sider>
				<Drawer
					closeIcon={null}
					placement="left"
					width={208}
					visible={visible}
					onClose={() => onVisible(false)}
				>
					<Menu router={router} onVisible={() => onVisible(false)} />
				</Drawer>
				<Layout className={classes['layout-content']} style={{ marginLeft }}>
					{pageHeader && (
						<PageHeader
							breadcrumb={{ routes: getBreadcrumb() }}
							breadcrumbRender={itemRender}
							title={pageTitle}
						/>
					)}
					<Content>{children}</Content>
					<Footer />
				</Layout>
			</Layout>
			{/* <CookieAlert /> */}
		</Layout>
	);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
MainLayout.getPageProps = (context: PageProps) => {
	return {
		pageHeader: true,
	};
};

export default MainLayout;
