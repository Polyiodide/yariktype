from django.urls import path
from . import views


urlpatterns = [
    path('', views.AppView.as_view(), name='index'),
    path('leaderboards', views.LeaderboardsView.as_view(), name='leaderboards'),
    path('settings', views.SettingsView.as_view(), name='settings'),
    path('profile/<slug:slug>', views.ProfileView.as_view(), name='profile'),
    path('login', views.LoginView.as_view(), name='login'),
    path('register', views.RegisterView.as_view(), name='register'),
    path('logout', views.logout, name='logout'),
    path('themes', views.TestView.as_view()),
    path('languages/<str:slug>', views.dictionary),
    path('list_themes', views.list_themes),
    path('list_dicts', views.list_dictionaries),
    path('list_users', views.list_users),
]
