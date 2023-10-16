from django.contrib.auth.management.commands.createsuperuser import Command as BaseCommand
from django.contrib.auth.models import User
from main.models import Profile

class Command(BaseCommand):

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        
        # Create the superuser as usual
        super().handle(*args, **options)

        # Retrieve the created superuser
        superuser = User.objects.get(username=username)

        # Update the user's profile to have the 'admin' role
        profile, created = Profile.objects.get_or_create(user_id=superuser.id)
        if created:
            profile.user_role = 'admin'
            profile.displayed_name = username
            profile.save()

        self.stdout.write(self.style.SUCCESS('Successfully created admin superuser.'))