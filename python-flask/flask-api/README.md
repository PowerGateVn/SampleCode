#flask-module-structure
- Run if using Pipenv
```
pipenv shell
pipenv install
export FLASK_APP=app.py
flask run
```

- OR Run if using requirements
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run
```
- Install posgresql
- Migration
```
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
```




