let roleList = [];

getAllUsers();

function getAllUsers() {
    $.getJSON("http://localhost:8080/allUsers", function (data) { // получаем юзеров и добавляем их в дата
        console.log('1) данные с бэка /allUsers: ', JSON.stringify(data))
        let rows = '';
        $.each(data, function (key, user) { // получаем юзeрa
            rows += createRows(user); // из цикла полученного юзера добавляем в строку
        });
        $('#tableAllUsers').append(rows); //строку добавляем в таблицу

        // получение ролей по url из json, добовляем в массив ролей
        $.ajax({
            url: '/authorities',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}

//метод создания строк для таблицы
function createRows(user) {

    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.lastName + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.email + '</td>';
    user_data += '<td>';
    let roles = user.roles; // через getJSON получаем массив ролей
    for (let role of roles) {
        user_data += role.role.replace('ROLE_', '') + ' ';
    }
    user_data += '</td>' +
        '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editModal" ' +
        'data-id="' + user.id + '">' + '</td>' +

        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';

    return user_data;
}

// получаем все роли для изменения юзера (модалка)
function getUserRolesForEdit() {
    var allRoles = [];
    $.each($("select[name='editRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('role');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    // console.log("allRoles: " + JSON.stringify(allRoles));
    return allRoles;
}

//Edit user
//при нажатие на кнопку Edit открвается заполненное модальное окно
$(document).on('click', '.edit-btn', function () {
    const user_id = $(this).attr('data-id');
    console.log("editUserId: " + JSON.stringify(user_id));
    $.ajax({
        url: '/getUserById/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#editId').val(user.id);
            $('#editName').val(user.name);
            $('#editLastName').val(user.lastName);
            $('#editAge').val(user.age);
            $('#editEmail').val(user.email);
            $('#editPassword').val(user.password);
            $('#editRole').empty();
            //для получения ролей в мадольном окне проходимся по массиву ролей, выделяем текущею роль у юзера
            roleList.map(role => {
                let flag = user.roles.find(item => item.id === role.id) ? 'selected' : ''; //flag - для отметки текущей роль юзера, selected - выбрано
                $('#editRole').append('<option id="' + role.id + '" ' + flag + ' role="' + role.role + '" >' +
                    role.role.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

//Отправка изменений модального окна
$('#editButton').on('click', (e) => {
    e.preventDefault();

    let userEditId = $('#editId').val();

    var editUser = {
        id: $("input[name='id']").val(),
        name: $("input[name='name']").val(),
        lastName: $("input[name='lastName']").val(),
        age: $("input[name='age']").val(),
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
        roles: getUserRolesForEdit()

    }
    console.log("editUser:" + JSON.stringify(editUser));
    $.ajax({
        url: '/edit',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(editUser),
        success: (data) => { // data - ответ с кнтроллера на бэкэнде
            let newRow = createRows(data); // создаем новую строку
            console.log("newRow: " + newRow)
            $('#tableAllUsers').find('#' + userEditId).replaceWith(newRow); // в таблице по айди находим строку, которую изменяем и заменяем ее на новую
            $('#editModal').modal('hide');
            $('#admin-tab').tab('show');
        },
        error: () => {
            console.log("error editUser")
        }
    });
});

//Delete user
//при нажатие на кнопку Delete открвается заполненное модальное окно
$(document).on('click', '.del-btn', function () {

    let user_id = $(this).attr('data-id'); // айди юзера у которого нажата кнопка delete
    console.log("userId: " + JSON.stringify(user_id));

    $.ajax({
        url: '/getUserById/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#delId').empty().val(user.id);
            $('#delName').empty().val(user.name);
            $('#delLastName').empty().val(user.lastName);
            $('#delAge').empty().val(user.age);
            $('#delEmail').empty().val(user.email);
            $('#delPassword').empty().val(user.password);
            $('#delRole').empty();
            roleList.map(role => {
                let flag = user.roles.find(item => item.id === role.id) ? 'selected' : ''; //flag - для отметки текущей роль юзера, selected - выбрано
                $('#delRole').append('<option id="' + role.id + '" ' + flag + ' role="' + role.role + '" >' +
                    role.role.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

//удаляет юзера при нажатие на кнопку delete в модальном окне
$('#deleteButton').on('click', (e) => {
    e.preventDefault();
    let userId = $('#delId').val();
    $.ajax({
        url: '/delete/' + userId,
        method: 'DELETE',
        success: function () {
            $('#' + userId).remove(); // удаляет юзера по айди
            $('#deleteModal').modal('hide'); // hide - скрывает модальное окно
            $('#admin-tab').tab('show'); // показать таблицу
        },
        error: () => {
            console.log("error delete user")
        }
    });
});

// получаем все роли для добавления юзера
function getUserRolesForAdd() {
    var allRoles = [];
    $.each($("select[name='addRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('name');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    return allRoles;
}

//Add New User
//вкладка для добавления юзера
$('.newUser').on('click', () => {

    $('#name').empty().val('')
    $('#lastName').empty().val('')
    $('#age').empty().val('')
    $('#email').empty().val('')
    $('#password').empty().val('')
    $('#addRole').empty().val('')
    roleList.map(role => {
        $('#addRole').append('<option id="' + role.id + '" role="' + role.role + '">' +
            role.role.replace('ROLE_', '') + '</option>')
    })
})

//отправляет заполненную форму с новым юзером
$("#addNewUserButton").on('click', () => {
    let newUser = {
        name: $('#name').val(),
        lastName: $('#lastName').val(),
        age: $('#age').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        roles: getUserRolesForAdd()
    }


    $.ajax({
        url: 'http://localhost:8080/create',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset=utf-8',
        success: function () {
            // alert("add user in success")
            $('#tableAllUsers').empty();
            getAllUsers();
            $('#admin-tab').tab('show');
        },
        error: function () {
            alert('error addUser')
        }
    });
});

