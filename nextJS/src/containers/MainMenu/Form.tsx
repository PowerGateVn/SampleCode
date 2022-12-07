import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import { Card, Form, Space } from 'antd';

import { ButtonCancel, ButtonOK } from 'src/components/Forms/Button';
import Checkbox from 'src/components/Forms/Checkbox';
import DatePicker from 'src/components/Forms/DatePicker';
import Input from 'src/components/Forms/Input';
import Radio from 'src/components/Forms/Radio';
import Select from 'src/components/Forms/Select';

const MainMenuForm = () => {
	const { quill, quillRef } = useQuill();
	const dataOpt = [
		{
			label: 'Data 1',
			value: 'd1',
		},
		{
			label: 'Data 2',
			value: 'd2',
		},
	];

	useEffect(() => {
		if (quill) {
			quill.on('text-change', () => {
				console.log(quill.root.innerHTML);
			});
		}
	}, [quill]);

	return (
		<Card className="form-card">
			<Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
				<Input useLabel name="text" label="Text" />
				<Input useLabel name="number" label="Number" type="number" />
				<Input useLabel name="password" label="Password" type="password" />
				<Select useLabel name="select" label="Select" placeholder="Select" options={dataOpt} />
				<DatePicker useLabel name="datepicker" label="Date Picker" />
				<Input useLabel name="textarea" label="Textarea" type="textarea" />
				<Form.Item label="Editor" name="editor">
					<div className="texteditor">
						<div ref={quillRef} />
					</div>
				</Form.Item>
				<Checkbox useLabel name="checkbox" label="Checkbox" options={dataOpt} />
				<Radio useLabel name="radio" label="Radio" options={dataOpt} />

				<Form.Item
					wrapperCol={{
						sm: { offset: 4, span: 20 },
					}}
				>
					<Space>
						<Form.Item>
							<ButtonOK text="Submit" htmlType="submit" />
						</Form.Item>
						<Form.Item>
							<ButtonCancel text="Cancel" />
						</Form.Item>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default MainMenuForm;
