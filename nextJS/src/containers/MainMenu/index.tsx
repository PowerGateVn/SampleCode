import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Col, Form, notification, Popconfirm, Row, Space } from 'antd';

import { ButtonCancel, ButtonOK } from 'src/components/Forms/Button';
import Checkbox from 'src/components/Forms/Checkbox';
import Input from 'src/components/Forms/Input';
import Select from 'src/components/Forms/Select';
import Table, { DrawerType } from 'src/components/Table';
import useColumnSearch from 'src/components/Table/Search';
import conPagination from 'src/constants/pagination';
import { useDeleteMainMenu, useMainMenus } from 'src/hooks';
import tablePayload from 'src/utils/table-payload';

const MainMenu = (props: any) => {
	const [statePagination, setPagination] = useState<any>(conPagination);
	const [stateFilters, setFilters] = useState<any>({});
	const [stateSorter, setSorter] = useState<any>({});
	const [records, setRecords] = useState<any>(null);
	const {
		isLoading: fetchingDelete,
		data: dataDelete,
		mutate: deleteHandler,
	} = useDeleteMainMenu();
	const { isLoading: fetchingList, data: dataList, mutate: getList } = useMainMenus();

	const { router } = props;
	const selectOpt = [
		{
			label: 'Data 1',
			value: 'd1',
		},
		{
			label: 'Data 2',
			value: 'd2',
		},
	];
	const checkboxOpt = [
		{
			label: 'Tampilkan hanya apotek yang inaktif',
			value: 'd1',
		},
	];

	const getDetailHandler = (type: DrawerType, uid: string) => {
		router.push(`/main-menu/${type}/${uid}`);
	};

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		const pgResult = { ...statePagination, ...pagination };
		const payload = tablePayload(pgResult, filters, sorter);

		setPagination(pgResult);
		setFilters(filters);
		setSorter(sorter);

		getList(payload);
	};

	useEffect(() => {
		handleTableChange(statePagination, stateFilters, stateSorter);
	}, []);

	useEffect(() => {
		if (dataDelete) {
			const {
				meta: { message },
			} = dataDelete;

			notification.success({
				message: 'Success',
				description: message,
			});
		}
	}, [dataDelete]);

	useEffect(() => {
		if (dataList) {
			const {
				meta: { pagination },
				data: { records: recordsR },
			} = dataList;

			if (pagination) {
				const pgResult = {
					...statePagination,
					...{ total: pagination.total_records },
				};
				setRecords(recordsR);
				setPagination(pgResult);
			}
		}
	}, [dataList]);

	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			width: '30%',
			filterMultiple: false,
			filters: [
				{ text: 'Dashboard', value: 'Dashboard' },
				{ text: 'Add Main Menu', value: 'Add Main Menu' },
			],
			sorter: (a: any, b: any) => a.title.length - b.title.length,
			render: (text: string, record: any) => (
				<a onClick={() => getDetailHandler('detail', record.uid)}>{text}</a>
			),
		},
		{
			title: 'Path',
			dataIndex: 'path',
			key: 'path',
			sortDirections: ['descend'],
			sorter: (a: any, b: any) => a.path.length - b.path.length,
			...useColumnSearch('title'),
		},
		{
			title: 'Action',
			key: 'action',
			align: 'center',
			width: 58,
			render: (record: any) => (
				<Space size="middle" className="ant-table-action">
					<EditOutlined onClick={() => getDetailHandler('edit', record.uid)} />
					<Popconfirm
						title="Are you sure?"
						okText="Yes"
						cancelText="No"
						placement="left"
						onConfirm={() => deleteHandler(record.uid)}
					>
						<DeleteOutlined />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Card className="table-filter">
				<Form autoComplete="off" layout="vertical">
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col className="gutter-row" span={8}>
							<Input useLabel name="search_text1" label="Text1" />
						</Col>
						<Col className="gutter-row" span={8}>
							<Input useLabel name="search_text2" label="Text2" />
						</Col>
						<Col className="gutter-row" span={8}>
							<Select
								useLabel
								name="search_select"
								label="Select"
								placeholder="Select"
								options={selectOpt}
							/>
						</Col>
						<Col className="gutter-row" span={14}>
							<Checkbox name="search_checkbox" options={checkboxOpt} />
						</Col>
					</Row>
					<Row justify="end">
						<Col>
							<Form.Item>
								<Space>
									<ButtonOK
										text="Search"
										htmlType="submit"
										loading={fetchingDelete || fetchingList}
									/>
									<ButtonCancel text="Reset" />
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>
			<Table
				loading={fetchingDelete || fetchingList}
				columns={columns}
				data={records}
				pagination={statePagination}
				onChange={handleTableChange}
				refreshAction={() => handleTableChange(statePagination, stateFilters, stateSorter)}
			/>
		</>
	);
};

export default MainMenu;
