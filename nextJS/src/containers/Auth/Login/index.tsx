import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import { ButtonOK } from 'src/components/Forms/Button';
import Input from 'src/components/Forms/Input';
import Image from 'src/components/Image';
import { SelectLangLogin } from 'src/components/SelectLang';
import { actionLogin } from 'src/redux/actions/auth';

import classes from './style.module.less';

const Login = (props: any) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState<boolean>(false);

	const { router } = props;
	const { t } = useTranslation(['auth', 'common']);

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			await dispatch(await actionLogin({ ...values }));
			router.push('/');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={`${classes.container} d-flex align-items-center justify-content-center`}
		>
			<SelectLangLogin router={router} />
			<div className={classes.content}>
				<div className={classes['login-top']}>
					<Image
						width={119}
						height={22}
						src="/images/kd-logo.svg"
						alt="Logo KlikDokter"
					/>
					<div className="text-muted">KlikDokter Backoffice</div>
				</div>
				<div className={classes['login-main']}>
					<Form
						name="login_form"
						autoComplete="off"
						onFinish={onFinish}
					>
						<Input
							name="username"
							useLabel={false}
							label={t('auth:login:form:field:username:label')}
							size="large"
							rules={[
								{
									required: true,
									message: t(
										'auth:login:form:field:username:msg_required',
									),
								},
							]}
							prefix={<UserOutlined />}
						/>
						<Input
							name="password"
							type="password"
							useLabel={false}
							label={t('auth:login:form:field:password:label')}
							size="large"
							rules={[
								{
									required: true,
									message: t(
										'auth:login:form:field:password:msg_required',
									),
								},
							]}
							prefix={<LockOutlined />}
						/>
						<Form.Item>
							<ButtonOK
								text={t('auth:login:form:button:submit')}
								htmlType="submit"
								size="large"
								loading={loading}
								block
							/>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
