import datetime
from api import db
from werkzeug.security import check_password_hash, generate_password_hash
from api.utils.constants import UUID_V4_LENGTH


class UserBasic(db.Model):
    __tablename__ = "UserBasic"
    id = db.Column(db.String(UUID_V4_LENGTH), primary_key=True)
    create_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    email = db.Column(db.String(120), nullable=False, unique=True)
    hash_password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(10), nullable=False)
    deactivate = db.Column(db.Boolean, nullable=False, default=False)

    advance = db.relationship("UserAdvance", backref="basic", lazy=True, uselist=False)

    def __repr__(self) -> str:
        return f'<User {self.email} - Role {self.role}>'

    def set_password(self, password: str) -> None:
        self.hash_password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.hash_password, password)

    @property
    def dict(self):
        return {
            "id": self.id, "create_at": self.create_at,
            "role": self.role, "first_name": self.advance.first_name,
            "last_name": self.advance.last_name, "date_of_birth": self.advance.date_of_birth,
            "phone_number": self.advance.phone_number
        }


class UserAdvance(db.Model):
    __tablename__ = "UserAdvance"
    id = db.Column(db.String(UUID_V4_LENGTH), primary_key=True)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    date_of_birth = db.Column(db.String(10))
    phone_number = db.Column(db.String(11))
    user_basic_id = db.Column(db.String(UUID_V4_LENGTH), db.ForeignKey('UserBasic.id'))

    def __repr__(self) -> str:
        return f'<UserAdvance {self.id} {self.first_name} {self.last_name}>'

    @property
    def dict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "date_of_birth": self.date_of_birth,
            "phone_number": self.phone_number
        }

