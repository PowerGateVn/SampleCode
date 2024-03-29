import METADATA from 'src/constants/metadata';

const Meta = () => {
	return (
		<>
			<meta name="description" content={METADATA.APP_DESCRIPTION} />
			<meta content={METADATA.KEY_WORDS} name="keywords" />

			{/* Twitter */}
			<meta name="twitter:card" content="summary" />
			<meta
				name="twitter:site"
				content={'@' + METADATA.APP_NAME.toLowerCase()}
			/>
			<meta name="twitter:title" content={METADATA.APP_NAME} />
			<meta
				name="twitter:description"
				content={METADATA.APP_DESCRIPTION}
			/>
			<meta name="twitter:image" content={METADATA.IMG_SHARE} />

			{/* Facebook */}
			<meta property="fb:app_id" content={METADATA.FB_APP_ID} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={METADATA.APP_NAME} />
			<meta
				property="og:description"
				content={METADATA.APP_DESCRIPTION}
			/>
			<meta property="og:image" content={METADATA.IMG_SHARE} />
			<meta property="og:image:width" content="200" />
			<meta property="og:image:height" content="200" />
			<meta property="og:locale" content="id_ID" />
			<meta property="og:url" content={METADATA.WEB_URL} />
		</>
	);
};

export default Meta;
