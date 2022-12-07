import type { ReactNode } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Button, Col, Result, Row } from 'antd';

const ForbiddenPage = () => {
	return (
		<>
			<Head>
				<title>403: Forbidden/Access Denied</title>
			</Head>
			<Row justify="center" align="middle" style={{ height: '100%' }}>
				<Col>
					<Result
						status="403"
						title="403"
						subTitle="Sorry, you are not authorized to access this page."
						extra={
							<Button
								type="primary"
								onClick={() => Router.push('/')}
							>
								Back Home
							</Button>
						}
					/>
				</Col>
			</Row>
		</>
	);
};

ForbiddenPage.getLayout = ({ children }: { children: ReactNode }) => children;

export default ForbiddenPage;
