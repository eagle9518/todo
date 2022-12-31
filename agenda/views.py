import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from agenda.models import Date, Todo
from datetime import date
from django.db import connection


def home(request):
    if request.user.is_authenticated:
        return redirect('todos')
    return render(request, 'base.html')


@login_required
def todos(request):
    fetch_date(request)

    all_dates = reversed(Date.objects.filter(user=request.user))
    return render(request, 'todo.html', {'all_dates': all_dates})


def fetch_date(request):
    current_date = date.today()
    if not Date.objects.filter(user=request.user, date=current_date).exists():
        Date(user=request.user, date=current_date).save()


def add_todo(request):
    if request.method == 'POST':
        new_task = json.load(request)
        current_date_object = Date.objects.get(user=request.user, date=new_task['task_date'])
        Todo.objects.create(todo=new_task['task'], date=current_date_object)

        data = {
            'my_data': "Hello"
        }
        return JsonResponse(data)

    return redirect('todos')


