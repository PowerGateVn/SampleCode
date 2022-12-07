import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';

type FilterDropdownType = {
	setSelectedKeys: (val: string[]) => void;
	selectedKeys: string;
	confirm: () => void;
	clearFilters: () => void;
};

let searchedColumn = '';
let searchText = '';
const searchInput: { current: Input | null } = { current: null };

const handleSearch = (dataIndex: string, selectedKeys: string, confirm: () => void) => {
	searchedColumn = dataIndex;
	searchText = selectedKeys[0];
	confirm();
};

const handleReset = (clearFilters: () => void) => {
	searchText = '';
	clearFilters();
};

const useColumnSearch = (dataIndex: string) => ({
	filterDropdown: ({
		setSelectedKeys,
		selectedKeys,
		confirm,
		clearFilters,
	}: FilterDropdownType) => (
		<div style={{ padding: 8 }}>
			<Input
				ref={(node) => {
					searchInput.current = node;
				}}
				placeholder={`Search ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
				onPressEnter={() => handleSearch(dataIndex, selectedKeys, confirm)}
				style={{ marginBottom: 8, display: 'block' }}
			/>
			<Space>
				<Button
					type="primary"
					onClick={() => handleSearch(dataIndex, selectedKeys, confirm)}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90 }}
				>
					Search
				</Button>
				<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</Space>
		</div>
	),
	filterIcon: (filtered: boolean) => (
		<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
	),
	onFilterDropdownVisibleChange: (visible: boolean) => {
		if (visible) {
			setTimeout(() => searchInput.current?.select(), 100);
		}
	},
	render: (text: string) => {
		return searchedColumn === dataIndex ? (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[searchText]}
				autoEscape
				textToHighlight={text ? text.toString() : ''}
			/>
		) : (
			text
		);
	},
});

export default useColumnSearch;
