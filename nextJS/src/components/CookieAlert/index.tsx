import { useState } from 'react';
import Link from 'next/link';
import { Alert, Button } from 'antd';

import CookieSettings from 'src/utils/cookie-settings-storage';

const CookieAlert = () => {
	const [show, setShow] = useState<boolean>(!CookieSettings.accepted);

	if (!show) {
		return null;
	}

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 0,
				right: 0,
				left: 0,
				zIndex: 999,
			}}
		>
			<Alert
				style={{
					borderRadius: 0,
				}}
				type="warning"
				showIcon={false}
				message={
					// eslint-disable-next-line max-len
					<div className="container d-block d-md-flex text-center text-md-left justify-content-between align-items-center">
						<div className="mr-0 mr-md-2 fs-sm mb-2 mb-md-0">
							We use cookies to make interactions with our
							websites and services easy and meaningful, to better
							understand how they are used and to tailor
							advertising. You can read more and make your cookie
							choices
							<Link href="/cookie-policy">
								<a> here</a>
							</Link>
							. By continuing to use this site you are giving us
							your consent to do this.
						</div>
						<Button
							type="primary"
							size="small"
							onClick={() => {
								CookieSettings.accepted = true;
								setShow(false);
							}}
						>
							Accept
						</Button>
					</div>
				}
			/>
		</div>
	);
};

export default CookieAlert;
