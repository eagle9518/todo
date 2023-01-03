//Gets csrftoken -> official Django docs
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//Renders Datepicker
$(function () {
    $("#datepicker").datepicker({format: 'yyyy-mm-dd'});
});

//Sends Added Todos to Server
const add_todo = document.getElementsByClassName('add_todo_form');
for (let date of add_todo) {
    date[1].addEventListener('click', () => {
        fetch_todo_from_server(date.id, date[0].value);
        date[0].value = "";
    })
}

function fetch_todo_from_server(date, todo) {
    fetch("add_todo/", {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({'task_date': date, 'task': todo})
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data['confirmation'] !== 'Task Already Exists'){
                insert_todo(date, todo);
            } else {
                alert("Task Already Exists");
            }
        })
}

function insert_todo(date, todo) {
    const remove_todo_button = document.createElement('button');
    remove_todo_button.innerText = 'X';
    remove_todo_button.addEventListener('click', () => {
        remove_todo_from_server(date, todo);
        deleteRow(remove_todo_button);
    })

    let table = document.getElementById(date);
    let row = table.insertRow(-1);
    let insertedTodo = row.insertCell(0);
    insertedTodo.appendChild(remove_todo_button);
    remove_todo_button.insertAdjacentText('afterend', todo);

}

//Remove Todos from server
function remove_todo_from_server(date, todo) {
    fetch("remove_todo/", {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({'task_date': date, 'task': todo})
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
}

function deleteRow(btn) {
  let row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}