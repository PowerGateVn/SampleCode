import Router from 'next/router';
import { useEffect } from 'react';

import useBeforeUnload from 'react-use/lib/useBeforeUnload';

const useWarnIfUnsavedChanges = (
	unsavedChanges: boolean,
	message = 'You have unsaved changes, are you sure?',
) => {
	useBeforeUnload(unsavedChanges, message);

	useEffect(() => {
		const routeChangeStart = () => {
			if (unsavedChanges) {
				const r = window.confirm(message);

				if (!r) {
					Router.events.emit('routeChangeError');
					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw 'Abort route change. Please ignore this error.';
				}
			}
		};

		Router.events.on('routeChangeStart', routeChangeStart);

		return () => {
			Router.events.off('routeChangeStart', routeChangeStart);
		};
	}, [message, unsavedChanges]);
};

export { useWarnIfUnsavedChanges };
