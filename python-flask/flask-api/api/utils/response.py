def unauthorized(message=""):
    return message, 401


def error_bad_request(message=""):
    return message, 400 


def error_not_found(message=""):
    return message, 404


def error_server_error(message=""):
    return message, 500


def success_created(message=""):
    return message, 201

def success(message={}):
    return  message, 200
