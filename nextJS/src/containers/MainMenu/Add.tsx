import { useEffect, useState } from 'react';
import { Card, Form, Space } from 'antd';

import { ButtonCancel, ButtonOK } from 'src/components/Forms/Button';
import Input from 'src/components/Forms/Input';
import { useMainMenu } from 'src/hooks';
import ucwords from 'src/utils/ucwords';

const MainMenuAdd = (props: any) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [form] = Form.useForm();
	const { isLoading: fetchingDetail, data: dataDetail, mutate: getDetail } = useMainMenu();
	const { router, type } = props;

	useEffect(() => {
		if (type !== 'add') {
			getDetail(router?.query?.uid);
		}
	}, []);

	useEffect(() => {
		if (dataDetail) {
			form.setFieldsValue(dataDetail?.data?.record);
		}
	}, [dataDetail]);

	const onFinish = async (values: any) => {
		setLoading(true);

		console.log(values);

		setTimeout(() => {
			setLoading(false);
			router.push('/main-menu/manage');
		}, 2000);
	};

	const backHandler = () => {
		router.push('/main-menu/manage');
	};

	return (
		<Card className="form-card">
			<Form
				form={form}
				layout="horizontal"
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 20 }}
				onFinish={onFinish}
			>
				<Input
					useLabel
					name="title"
					label="Title"
					readOnly={type === 'detail'}
					rules={[
						{
							required: type !== 'detail',
							message: 'Title is required',
						},
					]}
				/>
				<Input
					useLabel
					name="path"
					label="Path"
					readOnly={type === 'detail'}
					rules={[
						{
							required: type !== 'detail',
							message: 'Path is required',
						},
					]}
				/>

				<Form.Item
					wrapperCol={{
						sm: { offset: 4, span: 20 },
					}}
				>
					<Space>
						{type !== 'detail' && (
							<Form.Item>
								<ButtonOK
									text={ucwords(type)}
									htmlType="submit"
									loading={loading || fetchingDetail}
								/>
							</Form.Item>
						)}
						{type !== 'add' && (
							<Form.Item>
								<ButtonCancel text="Back" onClick={backHandler} />
							</Form.Item>
						)}
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default MainMenuAdd;
