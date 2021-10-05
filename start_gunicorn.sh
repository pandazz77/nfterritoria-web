#!/bin/bash
source /home/nfterritoria/django-site/VENV/bin/activate
exec gunicorn -c "/home/nfterritoria/django-site/gunicorn_config.py" nfterritoria.wsgi
