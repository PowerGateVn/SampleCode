import Head from 'next/head';

import Meta from 'src/components/Head/Meta';
import METADATA from 'src/constants/metadata';

type Props = {
	title?: string;
};

const HeadShare = (props: Props) => {
	const { title } = props;

	return (
		<Head>
			<title>{(title ? title + ' | ' : '') + METADATA.APP_NAME}</title>
			<Meta />
		</Head>
	);
};

export default HeadShare;
