import type { ComponentType } from 'react';
import cookie from 'react-cookies';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch } from 'react-redux';
import { useAsync } from 'react-use';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';

import MainLayout from 'src/components/Layout/MainLayout';
import wrapperStore from 'src/redux';
import { actionGetUserAuth } from 'src/redux/actions/auth';
import AuthStorage from 'src/utils/auth-storage';

type NextPageWithLayout = NextPage & {
	getLayout?: ComponentType<any>;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

require('src/styles/index.less');

const queryClient = new QueryClient();
const urlsIgnore = process.env.IGNORE_URL ? process.env.IGNORE_URL.split(',') : [];

const MyApp = (props: AppPropsWithLayout) => {
	const { Component, pageProps } = props;
	const router = useRouter();
	const dispatch = useDispatch();
	const Layout = Component.getLayout ?? MainLayout;

	useAsync(async () => {
		if (AuthStorage.loggedIn) {
			try {
				await dispatch(await actionGetUserAuth());
			} catch (error: any) {
				if (error) {
					AuthStorage.destroy();
					dispatch({ type: 'LOGOUT_SUCCESS' });

					if (router.pathname !== '/login') {
						router.push('/login');
					}
				}
			}
		}
	}, [AuthStorage.loggedIn]);

	return (
		<QueryClientProvider client={queryClient}>
			<Layout {...pageProps} router={router}>
				<>
					<Head>
						<meta
							name="viewport"
							// eslint-disable-next-line max-len
							content="width=device-width, initial-scale=1, shrink-to-fit=no, height=device-height, user-scalable=0"
						/>
					</Head>
					<Component {...pageProps} router={router} />
					<ReactQueryDevtools initialIsOpen={false} />
				</>
			</Layout>
		</QueryClientProvider>
	);
};

MyApp.getInitialProps = async ({ ctx, Component }: any) => {
	if (!process.browser) {
		cookie.plugToRequest(ctx.req, ctx.res);
	}

	if (!AuthStorage.loggedIn && !urlsIgnore.includes(ctx.pathname)) {
		if (ctx.res) {
			ctx.res.writeHead(302, { Location: '/login' });
			ctx.res.end();
		}
	}

	if (AuthStorage.loggedIn && urlsIgnore.includes(ctx.pathname)) {
		if (ctx.res) {
			ctx.res.writeHead(302, { Location: '/' });
			ctx.res.end();
		}
	}

	// calls page's `getPageProps` (custom function) and fills `appProps.pageProps`
	// coz, can't use `getInitialProps` and `getServerSideProps` together
	let pageProps = {};

	if (Component?.getPageProps) {
		pageProps = await Component?.getPageProps(ctx);
	}

	const propsData = {
		...pageProps,
	};

	let layoutProps = {};

	if (Component?.getLayout) {
		layoutProps = await Component?.getLayout?.getPageProps?.({
			...ctx,
			pageProps: propsData,
		});
	} else {
		layoutProps = await MainLayout?.getPageProps?.({
			...ctx,
			pageProps: propsData,
		});
	}

	return {
		pageProps: {
			...layoutProps,
			...propsData,
		},
	};
};

export default wrapperStore.withRedux(appWithTranslation(MyApp));
