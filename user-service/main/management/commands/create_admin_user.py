from django.contrib.auth.management.commands.createsuperuser import Command as BaseCommand
from django.core.management import call_command
from django.contrib.auth.models import User
from main.models import Profile

class Command(BaseCommand):
    help = 'Create an admin profile for a superuser'

    def handle(self, *args, **options):
        try:
            superuser = User.objects.get(username=options['username'])
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Superuser does not exist.'))
            return

        # Create a profile with 'admin' role for the superuser
        Profile.objects.create(
            user_id=superuser,
            displayed_name=superuser.username,
            user_role='admin'
        )

        self.stdout.write(self.style.SUCCESS('Admin superuser created successfully.'))
