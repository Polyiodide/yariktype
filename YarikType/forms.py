from django import forms

class LoginForm(forms.Form):
    email = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'email'}))
    password = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'password'}))

class RegisterForm(forms.Form):
    username = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'username'}))
    email = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'email'}))
    verify_email = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'verify email'}))
    password = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'password'}))
    verify_password = forms.CharField(label='', max_length=200, widget=forms.TextInput(attrs={'placeholder': 'verify password'}))
