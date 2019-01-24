from django.contrib import admin

from . import models


@admin.register(models.Preference)
class PreferencesAdmin(admin.ModelAdmin):
    fields = (
        'user', 'allow_capture', 'request_hold', 'expressed_at', 'created_at', 'updated_at'
    )
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ('user__username', 'expressed_at')
    list_display = ('user', 'expressed_at', 'allow_capture', 'request_hold')
    ordering = ('user', '-expressed_at')
    autocomplete_fields = ('user',)
