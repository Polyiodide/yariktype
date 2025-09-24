from django.core.exceptions import PermissionDenied
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, FileResponse
from django.views.generic import TemplateView

from . import forms
from . import models
from os import listdir

# Create your views here.

def login_req(func):
    def wrapper(request, *args, **kwargs):
        user = request.session.get('user', None)
        if not user: return redirect('index')

        return func(request, *args, **kwargs)
    return wrapper

def login_redirect(func):
    def wrapper(request, *args, **kwargs):
        user = request.session.get('user', None)
        if user: return redirect('profile', user['username'])

        return func(request, *args, **kwargs)
    return wrapper

class ContextView(TemplateView):
    extra_context = {}
    def get(self, request):
        self.extra_context['user'] = request.session.get('user', None)
        return super().get(request)

def list_themes(request):
    data = {}
    data['themes'] = tuple(map(lambda x: x[:-4], listdir('YarikType/static/yariktype/themes')))
    return JsonResponse(data)

def list_dictionaries(request):
    data = {}
    data['dictonaries'] = tuple(map(lambda x: x[:-5], listdir('YarikType/static/yariktype/dictionaries')))
    return JsonResponse(data)

def dictionary(request, slug):
    return FileResponse(open('YarikType/static/yariktype/dictionaries/'+slug, "rb"))

def list_users(request):
    if 'mode' not in request.GET:
        raise PermissionDenied()

    mode = request.GET['mode']
    match mode:
        case '15':
            mode = 'record_first'
        case '30':
            mode = 'record_second'
        case '60':
            mode = 'record_third'
        case '120':
            mode = 'record_fourth'
        case _:
            raise PermissionDenied()
    print(mode)

    data = {}
    array = models.User.objects.all().order_by(mode)
    for idx, user in enumerate(array):
        data[idx] = {'wpm': user.record_first, 'username': user.username}
    return JsonResponse(data)

class AppView(ContextView):
    template_name = 'yariktype/index.html'

class LeaderboardsView(ContextView):
    template_name = 'yariktype/leaderboards.html'

class SettingsView(ContextView):
    template_name = 'yariktype/settings.html'

class TestView(ContextView):
    template_name = 'yariktype/test.html'

    def get(self, request):
        print(self.extra_context)
        return super().get(request)

class ProfileView(ContextView):
    template_name = 'yariktype/profile.html'
    def get(self, request, slug):
        profile = get_object_or_404(models.User, username=slug)
        self.extra_context['profile'] = profile

        return super().get(request)

@login_req
def logout(request):
    request.session.clear()
    return redirect('index')

@login_redirect
def login(request):
    if request.method == 'POST':
        form = forms.LoginForm(request.POST)
        if form.is_valid():
            if not models.User.objects.filter(email=form.cleaned_data['email']):
                return HttpResponse('no such user')

            if models.User.objects.get(email=form.cleaned_data['email']).password != form.cleaned_data['password']:
                return HttpResponse('wrong password')

            user = models.User.objects.get(email=form.cleaned_data['email'])

            user = {
                'username': user.username
            }

            request.session['user'] = user

            return redirect('index')
    else:
        form = forms.LoginForm()

    context = get_context(request)
    context['form'] = form
    context['title'] = 'Login'
    context['action'] = 'login'
    return render(request, 'yariktype/auth.html', context=context)

@login_redirect
def register(request):
    if request.method == 'POST':
        form = forms.RegisterForm(request.POST)
        if form.is_valid():
            if form.cleaned_data['email'] != form.cleaned_data['verify_email']:
                return HttpResponse('wrong email')

            if form.cleaned_data['password'] != form.cleaned_data['verify_password']:
                return HttpResponse('wrong password')

            user = models.User(username=form.cleaned_data['username'],
                               password=form.cleaned_data['password']
            )
            user.save()

            user = {
                'username': user.username
            }

            request.session['user'] = user

            return redirect('index')
    else:
        form = forms.RegisterForm()

    context = get_context(request)
    context['form'] = form
    context['title'] = 'Register'
    context['action'] = 'register'
    return render(request, 'yariktype/auth.html', context=context)
