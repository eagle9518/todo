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
    date[1].addEventListener('click', function () {
        fetch_todo_from_server(date.id, date[0].value);
        insertTodo(date.id, date[0].value);
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
            return response.json()
        })
        .then(data => {
            console.log(data)
        })
}

function insertTodo(date, todo) {
    let table = document.getElementById(date);
    let row = table.insertRow(-1);
    let insertedTodo = row.insertCell(0);
    insertedTodo.innerText = todo;
}