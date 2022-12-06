<?php
namespace Infos\Users\Repository\Db;

use \DB;
use \Infos\Users\Repository\Interfaces\UserRepositoryInterface;
use Infos\Users\Models\UserModel;

/**
 * Class UserRepository
 * @package Infors\Users\Repository\Db
 */
class UserRepository implements UserRepositoryInterface {

    /**
     * getListAllUser
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function  getListAllUser() {
        //make logic for search
        $userList = UserModel::all();
        return $userList;
    }

    /**
     * editUserInfor
     * @param $id
     * @param $data
     * @return mixed
     */
    public function editUserInfor($id, $data) {
        $data['updated_at'] = date('Y-m-d H:i:s');
        return DB::table('users')
                 ->where('id', $id)
                 ->update($data);
    }
}
