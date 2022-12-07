import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Head from 'src/components/Head';
import MainMenu from 'src/containers/MainMenu';

const MainMenuPage = (props: any) => {
	const { pageTitle } = props;

	return (
		<>
			<Head title={pageTitle} />
			<MainMenu {...props} />
		</>
	);
};

MainMenuPage.getPageProps = () => {
	return {
		pageTitle: 'Manage Main Menu',
	};
};

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

export default MainMenuPage;
