from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField


# Create your models here.

class NotesUser(models.Model):
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)

	files = JSONField(default=list, null=True, blank=True)

	user = models.OneToOneField(User, on_delete = models.CASCADE)