import type { ReactNode } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Button, Col, Result, Row } from 'antd';

const ForbiddenPage = () => (
	<>
		<Head>
			<title>404: This page could not be found</title>
		</Head>
		<Row justify="center" align="middle" style={{ height: '100%' }}>
			<Col>
				<Result
					status="404"
					title="404"
					subTitle="Sorry, the page you visited does not exist."
					extra={
						<Button type="primary" onClick={() => Router.push('/')}>
							Back Home
						</Button>
					}
				/>
			</Col>
		</Row>
	</>
);

ForbiddenPage.getLayout = ({ children }: { children: ReactNode }) => children;

export default ForbiddenPage;
