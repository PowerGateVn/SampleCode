import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Head from 'src/components/Head';
import MainMenuAdd from 'src/containers/MainMenu/Add';
import ucwords from 'src/utils/ucwords';

const AddPage = (props: any) => {
	const { router, pageTitle } = props;

	return (
		<>
			<Head title={pageTitle} />
			<MainMenuAdd {...props} type={router?.query?.action} />
		</>
	);
};

AddPage.getPageProps = (context: any) => {
	const type = context?.query?.action;

	if (context.res && type !== 'add') {
		context.res.writeHead(302, { Location: '/' });
		context.res.end();
	}

	return {
		pageTitle: `${ucwords(type)} Main Menu`,
	};
};

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

export default AddPage;
