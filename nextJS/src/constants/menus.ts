const menus = [
	{
		key: 'dashboard',
		path: '/',
		title: 'Dashboard',
		icon: 'AreaChartOutlined',
		submenus: [],
	},
	{
		key: 'main-menu',
		path: '/main-menu',
		title: 'Main Menu',
		icon: 'MedicineBoxOutlined',
		submenus: [
			{
				key: 'mm_add',
				path: '/add',
				title: 'Add Entity',
			},
			{
				key: 'mm_manage',
				path: '/manage',
				title: 'Manage Entities',
			},
			{
				key: 'mm_form',
				path: '/form',
				title: 'Form',
			},
		],
	},
];

export default menus;
