# Port running on 8000



# Install Python and Django

# Create Django project using this command in cmd or bash
```
django-admin startproject <project-name>
```

# Use this command to create sitehandler
```
python manage.py startapp <sitehandler-name>
```

# To run the server use this
```
python manage.py runserver
```

## If you have not migrated (only)
[ ] After adding a class Site in models.py file, use the below command
```
python manage.py migrate
```
[ ] Make migrations
```
python manage.py makemigrations <sitehandler-name>
```
# Access database
```
python manage.py shell -- to open it in a shell
from sitehandler.models import Sites
s = Sites.objects.filter(site_url="hello")
len(s)
s[0].cipher
s[0].hashcontent