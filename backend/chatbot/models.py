from djongo import models

# Create your models here.
class ChatMessage(models.Model):
    text = models.CharField(max_length=255)
    is_bot = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
