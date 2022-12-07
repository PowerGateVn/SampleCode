import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Table, Tooltip } from 'antd';

type Size = 'large' | 'middle' | 'small';
export type DrawerType = 'detail' | 'add' | 'edit' | 'close';
type TableProps = {
	loading?: boolean;
	size?: Size;
	rowSelection?: object;
	columns: object[];
	data: object[];
	pagination: any;
	onChange: (pagination: any, filters: any, sorter: any) => void;
	addAction?: (type: DrawerType) => void;
	refreshAction: (pagination?: any, filters?: any, sorter?: any) => void;
};

const tableTopAction = (tb: TableProps) => (
	<>
		{tb.addAction && (
			<Tooltip title="Add">
				<Button
					type="text"
					size="small"
					shape="circle"
					onClick={() => tb.addAction && tb.addAction('add')}
				>
					<PlusCircleOutlined />
				</Button>
			</Tooltip>
		)}
		<Tooltip title="Refresh">
			<Button
				type="text"
				size="small"
				shape="circle"
				onClick={tb.refreshAction}
			>
				<ReloadOutlined />
			</Button>
		</Tooltip>
	</>
);

const TableC = (tb: TableProps) => {
	return (
		<Card
			className="table-card"
			bordered={false}
			extra={tableTopAction(tb)}
		>
			<Table
				rowKey={(record: any) => record.uid}
				loading={tb.loading}
				size={tb.size || 'middle'}
				rowSelection={tb.rowSelection}
				columns={tb.columns}
				dataSource={tb.data}
				pagination={tb.pagination}
				onChange={tb.onChange}
			/>
		</Card>
	);
};

export default TableC;
