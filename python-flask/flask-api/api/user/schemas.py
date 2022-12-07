update_user_schema = {
    "type": "object",
    "properties": {
        "first_name": {"type": "string"},
        "last_name": {"type": "string"},
        "phone_number": {"type": "string"},
        "date_of_birth": {"type": "string"},
    },
    "required": ["first_name", "last_name", "phone_number", "date_of_birth"]
}
