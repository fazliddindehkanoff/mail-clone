from django.contrib import admin

from . import models

admin.site.register(models.Email)
admin.site.register(models.User)
