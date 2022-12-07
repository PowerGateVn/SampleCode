import { CopyrightOutlined } from '@ant-design/icons';

import classes from './style.module.less';

const Footer = () => {
	return (
		<footer className={classes.footer}>
			<CopyrightOutlined />
			2022 KlikDokter Backoffice
		</footer>
	);
};

export default Footer;
