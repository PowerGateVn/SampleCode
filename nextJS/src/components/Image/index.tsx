import Image from 'next/image';

const ImageC = (props: any) => {
	const { ...attrs } = props;

	return <Image width={120} height={120} alt="Image" {...attrs} />;
};

export default ImageC;
