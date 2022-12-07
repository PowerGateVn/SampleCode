import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Head from 'src/components/Head';
import Home from 'src/containers/Home';

const HomePage = () => {
	return (
		<>
			<Head title="Dashboard" />
			<Home />
		</>
	);
};

HomePage.getPageProps = () => {
	return {
		pageHeader: false,
	};
};

export const getServerSideProps: GetServerSideProps = async ({
	locale,
}: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

export default HomePage;
