signup_schema = {
    "type": "object",
    "properties": {
        "email": {"type": "string", "format": "email"},
        "password": {"type": "string", "minLength": 6},
        "first_name": {"type": "string"},
        "last_name": {"type": "string"},
    },
    "required": ["email", "password", "first_name", "last_name"]
}

signin_schema = {
    "type": "object",
    "properties": {
        "email": {"type": "string", "format": "email"},
        "password": {"type": "string", "minLength": 6}
    },
    "required": ["email", "password"]
}
