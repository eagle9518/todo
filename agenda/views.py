from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


def home(request):
    if request.user.is_authenticated:
        return redirect('todos')
    return render(request, 'base.html')


@login_required
def todos(request):
    return render(request, 'todo.html')
