<?php

namespace Infos\Users\Middleware;

use Closure;
use \Infos\Users\Models\UserModel;
use Sentinel;
use Response;

/**
 * Class IsLoginMiddleware
 * @package Infos\Users\Middleware
 */
class IsLoginMiddleware {

    /**
     *  handle middleware
     * @param $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $headers = getallheaders();

        $loginToken = (!empty($request->get('login_token'))) ? $request->get('login_token') : (isset($headers['login_token']) ? $headers['login_token'] : '');
        $isDenyAccess = false;
        if (!empty($loginToken)) {
            $user = UserModel::where('login_token', $loginToken)->first();
            if (isset($user)) {
                $isDenyAccess = true;
                $_SESSION["user"] = $user['id'];
            }
        }
        if (empty($isDenyAccess)) {
            $apiFormat['status'] = \Config::get('constants.api.ACCESS_DENIED_STATUS');
            $apiFormat['message'] = \Config::get('constants.api.ACCESS_DENIED_MESSAGE');
            $apiFormat['code'] = \Config::get('constants.api.ACCESS_DENIED_CODE');
            return Response::json($apiFormat);
        }
        return $next($request);
    }

}
