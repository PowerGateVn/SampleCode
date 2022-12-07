from logging import exception
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from api.utils.constants import SERVER_ERROR_MESSAGE

from api.utils.response import error_server_error

db = SQLAlchemy()
migrate = Migrate()

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    from api.user import user_route
    app.register_blueprint(user_route)

    from api.auth import auth_route
    app.register_blueprint(auth_route)

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.session.remove()

    @app.errorhandler(500)
    def handle_server_error(e):
        print(e)
        return error_server_error(SERVER_ERROR_MESSAGE)

    return app
