import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Head from 'src/components/Head';
import MainMenuAdd from 'src/containers/MainMenu/Form';

const AddPage = (props: any) => {
	const { pageTitle } = props;

	return (
		<>
			<Head title={pageTitle} />
			<MainMenuAdd />
		</>
	);
};

AddPage.getPageProps = () => {
	return {
		pageTitle: 'Form',
	};
};

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

export default AddPage;
