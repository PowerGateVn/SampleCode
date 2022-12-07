import { useMutation, useQueryClient } from 'react-query';

import { MAIN_MENU } from 'src/constants/services';
import fetchAPI from 'src/utils/fetch-api';

const useMainMenu = () => {
	const queryClient = useQueryClient();
	const fetchSpecialization = (uID: string) =>
		fetchAPI({
			url: `/${MAIN_MENU.service}/${MAIN_MENU.model.detail}/${uID}`,
		});

	return useMutation((id: string) => fetchSpecialization(id), {
		onSettled: (detail) => {
			queryClient.setQueryData(['main_menu', detail.data.record.uid], detail.data.record);
		},
	});
};

const useMainMenus = () => {
	const queryClient = useQueryClient();
	const fetchMainMenus = (payload: object) => {
		return fetchAPI({
			url: `/${MAIN_MENU.service}/${MAIN_MENU.model.list}/`,
			payload,
		});
	};

	return useMutation((payload: object) => fetchMainMenus(payload), {
		onSettled: (list) => {
			queryClient.setQueryData('main_menu_list', list.data.records);
		},
	});
};

const useDeleteMainMenu = () => {
	const queryClient = useQueryClient();
	const deleteUser = (uID: string) =>
		fetchAPI({
			url: `/${MAIN_MENU.service}/${MAIN_MENU.model.delete}/${uID}`,
			options: {
				method: 'DELETE',
			},
		});

	return useMutation((id: string) => deleteUser(id), {
		onMutate: async (id) => {
			await queryClient.cancelQueries('main_menu_list'); // cancel any in-flight or pending query to the `main_menu_list` key

			const prev = queryClient.getQueryData('main_menu_list'); // retrieve the cached data

			queryClient.setQueryData('main_menu_list', (old: any[] = []) => {
				return old.filter((item) => item.uid !== id); // remove the main_menu_list from the previous list
			});

			return prev;
		},
		onError: (err, variables, previousValue) => {
			queryClient.setQueryData('main_menu_list', previousValue); // rollback the cache to the previous state
		},
		onSettled: () => {
			queryClient.invalidateQueries('main_menu_list'); // refetch the collection on the background
		},
	});
};

export { useDeleteMainMenu, useMainMenu, useMainMenus };
