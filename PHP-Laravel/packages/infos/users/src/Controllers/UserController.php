<?php
namespace Infos\Users\Controllers;

use Illuminate\Http\Request;
use Sentinel;
use Input;
use Redirect;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Validator;
use \Infos\Users\Repository\Db\UserRepository;
use Reminder;
use URL;
use \Infos\Users\Models\UserModel;
use Response;

/**
 * Class UserController
 */
class UserController extends Controller {

    /**
     * UserController constructor.
     */
    public function __construct() {
        // set contructor here
    }

    /**
     * index get list user
     */
    public function index() {
        // get list all user
        $userRes =  new UserRepository();
        $apiFormat['data']    = $userRes->getListAllUser();
        $apiFormat['status']  = \Config::get('constants.api.SUCCESS_STATUS');
        $apiFormat['message'] = \Config::get('constants.api.SUCCESS_MESSAGE');
        $apiFormat['code']    = \Config::get('constants.api.SUCCESS_CODE');
        return Response::json($apiFormat);
    }

    public function updateUserInfos($id, Request $request) {
        // get data post
        $data['name'] = $request->get('name');

        // edit information of user
        $userRes =  new UserRepository();
        if (!$userRes->editUserInfor($id, $data)) {
            $apiFormat['data']    = [];
            $apiFormat['status']  = \Config::get('constants.api.ERROR_STATUS');
            $apiFormat['message'] = \Config::get('constants.api.ERROR_MESSAGE');
            $apiFormat['code']    = \Config::get('constants.api.ERROR_CODE');
        } else {
            $apiFormat['data']    = UserModel::find($id);
            $apiFormat['status']  = \Config::get('constants.api.SUCCESS_STATUS');
            $apiFormat['message'] = \Config::get('constants.api.SUCCESS_MESSAGE');
            $apiFormat['code']    = \Config::get('constants.api.SUCCESS_CODE');
        }
        return Response::json($apiFormat);
    }
}