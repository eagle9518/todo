import json
from datetime import date

from django.contrib.auth.decorators import login_required
from django.db.models import Case, When, IntegerField, F, DurationField
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone

from agenda.models import Date, Todo

current_date = date.today()
now = timezone.now()


def home(request):
    if request.user.is_authenticated:
        return redirect('todos')
    return render(request, 'base.html')


@login_required
def todos(request):
    if request.method == 'POST':
        added_date = request.POST['add_date']
        fetch_current_date(request, added_date)

    fetch_current_date(request)
    all_dates = Date.objects.annotate(timediff=current_date - F('date')).order_by('timediff').filter(user=request.user)

    return render(request, 'todo.html', {'all_dates': all_dates})


def fetch_current_date(request, new_date=current_date):
    if not Date.objects.filter(user=request.user, date=new_date).exists():
        Date(user=request.user, date=new_date).save()


def add_todo(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        new_task = json.load(request)
        current_date_object = Date.objects.get(user=request.user, date=new_task['task_date'])
        if not Todo.objects.filter(todo=new_task['task'], date=current_date_object).exists():
            Todo.objects.create(todo=new_task['task'], date=current_date_object)
            response = {'confirmation': "Successfully Added"}
        else:
            response = {'confirmation': "Task Already Exists"}
        return JsonResponse(response)

    return redirect('todos')


def remove_todo(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        deleted_task = json.load(request)
        current_date_object = Date.objects.get(user=request.user, date=deleted_task['task_date'])
        Todo.objects.get(todo=deleted_task['task'], date=current_date_object).delete()

        response = {'confirmation': "Successfully Deleted"}
        return JsonResponse(response)

    return redirect('todos')


# Wipes Data for User (Testing Purposes)
def wipe(request):
    Date.objects.filter(user=request.user).delete()
