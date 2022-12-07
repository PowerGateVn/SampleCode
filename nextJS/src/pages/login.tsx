import type { ReactNode } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Head from 'src/components/Head';
import Login from 'src/containers/Auth/Login';

const LoginPage = (props: NextPage) => {
	return (
		<>
			<Head title="Login" />
			<Login {...props} />
		</>
	);
};

LoginPage.getLayout = ({ children }: { children: ReactNode }) => children;

export const getServerSideProps: GetServerSideProps = async ({
	locale,
}: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['auth', 'common'])),
	},
});

export default LoginPage;
