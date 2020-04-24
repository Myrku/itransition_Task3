var connection;
var sendmesgg;
var emoji = new Map([
    [':)', '😀'],
    [':D', '😁'],
    [';)', '😉'],
    ['xD', '🤣'],
    [';p', '😋'],
    ['8)', '😍'],
    ['B)', '😎'],
    [':(', '🙁'],
    ['3(', '😔'],
    [':\'(', '😢'],
    [':_(', '😭'],
    [':o', '😯'],
    [':|', '😐'],
    ['<3', '❤️'],
    [':like', '👍'],
    [':dislike', '👎'],
    [':up', '☝️'],
]);

document.addEventListener('DOMContentLoaded', function () {

    let counter = 1;
    var oldmessage;
    var c = getCookie("username");
    if (c) {
        document.getElementById('username').value = c;
    }

    var n = document.getElementById('username').value;
    var array = document.getElementById('messages').getElementsByClassName('message-entry');
    for (var i = 0; i < array.length; i++) {
        if (array[i].children[0].textContent == n) {
            console.log(array[i]);
            array[i].children[0].remove();
            array[i].children[0].classList.remove('pull-left');
            array[i].children[0].classList.add('float-md-right');
        }
    }

    function sortmessage() {

    }
    var converter = new showdown.Converter();
    var markdow_to_html;
    document.getElementById('username').focus();


    var usernamebtn = document.getElementById('enterusername');
    var renameuserbtn = document.getElementById('renameuser');
    usernamebtn.onclick = connect;
    renameuserbtn.onclick = rename;
    var username;

    var messageInput = document.getElementById('message');

    function createMessageEntry(encodedName, encodedMsg) {
        markdow_to_html = converter.makeHtml(encodedMsg);
        markdow_to_html = markdow_to_html.replace("<p>", '').replace("</p>", '');

        var entry = document.createElement('div');
        entry.classList.add("message-entry");

        if (encodedName === "_SYSTEM_") {
            if (markdow_to_html.includes("rename")) {
                var str = markdow_to_html;
                str = str.replace('{', '').replace('}', '').replace('[', '').replace(']', '');
                entry.innerHTML = str;
                entry.classList.add("text-center");
                entry.classList.add("system-message");

                var array = document.getElementById('messages').getElementsByClassName('isChanged');
                var oldname = str.substring(0, str.indexOf("rename") - 1);
                if (array.length > 0 && oldname == array[0].firstChild.textContent) {
                    var newname = str.indexOf("to");
                    newname = str.substring(str.indexOf("to") + 3);
                    console.log("new " + newname);

                    for (var i = 0; i < array.length; i++) {
                        array[i].firstChild.textContent = newname;
                    }
                }
            }
            else if (markdow_to_html.includes("delete")) {
                var deltext = markdow_to_html;
                deltext = deltext.substring(deltext.indexOf('[') + 1, deltext.indexOf(']'));
                var array = document.getElementById('messages').getElementsByClassName('isChanged');
                console.log(array);
                for (var i = 0; i < array.length; i++) {
                    if (array[i].getElementsByClassName('pull-left')[0].textContent == deltext) {
                        array[i].parentElement.removeChild(array[i]);
                    }
                }
            }
            else if (markdow_to_html.includes("edit")) {
                var str = markdow_to_html;
                console.log(str);
                var oldmessage = str.substring(str.indexOf('[') + 1, str.indexOf(']'));
                var newmessage = str.substring(str.indexOf('{') + 1, str.indexOf('}'));
                console.log(oldmessage);
                console.log(newmessage);
                var array = document.getElementById('messages').getElementsByClassName('isChanged');
                console.log(array);
                for (var i = 0; i < array.length; i++) {
                    if (array[i].getElementsByClassName('pull-left')[0].textContent == oldmessage) {
                        array[i].getElementsByClassName('pull-left')[0].textContent = newmessage;
                    }
                }
            }
            else {
                entry.innerHTML = markdow_to_html;
                entry.classList.add("text-center");
                entry.classList.add("system-message");
            }
        } else if (encodedName === "_BROADCAST_") {
            entry.classList.add("text-center");
            entry.innerHTML = `<div class="text-center broadcast-message">${markdow_to_html}</div>`;
        } else if (encodedName === username) {
            entry.classList.add("message-" + counter);
            entry.innerHTML = `<div class="message-content float-md-right">` +
                `<button id="editmessage-${counter}" class="btn btn-outline-dark" onclick="editmessage(this)"><svg class="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">` +
                `<path fill-rule="evenodd" d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z" clip-rule="evenodd" />` +
                `<path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z" clip-rule="evenodd" /></svg></button>` +

                `<button id="deletemessage-${counter}" class="btn btn-outline-dark" onclick="deletemessage(this)" style="margin-right:5px"><svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">` +
                `<path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd" />` +
                `</svg></button>${markdow_to_html}</div>`;
            counter++;

        } else {
            entry.classList.add("isChanged");
            entry.innerHTML = `<div id="message-user" class="message-avatar float-md-lift">${encodedName}</div>` +
                `<div class="message-content pull-left">${markdow_to_html}</div>`;
        }
        return entry;
    }

    function bindConnectionMessage(connection) {
        var messageCallback = function (name, message) {
            if (!message)
                return;

            var encodedName = name;
            var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var messageEntry = createMessageEntry(encodedName, encodedMsg);

            var messageBox = document.getElementById('messages');
            messageBox.appendChild(messageEntry);
            messageBox.scrollTop = messageBox.scrollHeight;
        };

        connection.on('broadcastMessage', messageCallback);
    }
    function sendmesg(event) {
        if (messageInput.value) {
            console.log("send");
            connection.send('broadcastMessage', username, messageInput.value);
        }

        messageInput.value = '';
        messageInput.focus();
        event.preventDefault();
    }
    sendmesgg = sendmesg;
    function onConnected(connection) {
        console.log('connection started');
        connection.send('broadcastMessage', '_SYSTEM_', username + ' подключен');

        document.getElementById('sendmessage').addEventListener('click', sendmesg);
        document.getElementById('message').addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('sendmessage').click();
                return false;
            }
        });
    }

    function connect() {
        username = document.getElementById('username').value;
        if (username != '') {

            usernamebtn.disabled = true;
            messageInput.focus();
            connection = new signalR.HubConnectionBuilder()
                .withUrl('/chat')
                .build();
            bindConnectionMessage(connection);
            connection.start()
                .then(function () {
                    onConnected(connection);
                })
                .catch(function (error) {
                    alert(error.message);
                });
            document.cookie = "username=" + username;
        }
        else {
            alert("Введите имя");
        }
    }

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function rename() {
        connection.send('broadcastMessage', '_SYSTEM_', '{' + username + '}' + ' rename to [' + document.getElementById('username').value + ']');
        username = document.getElementById('username').value;
        document.cookie = "username=" + username;
    }


});

$(document).on("input", function (ev) {
    var text = document.getElementById('message');
    for (let key of emoji.keys()) {
        if (text.value.includes(key)) {
            console.log(emoji.get(key));

            text.value = text.value.replace(key, emoji.get(key));
        }
    }
});

function deletemessage(obj) {
    var str = obj.id;
    str = str.substring(str.indexOf('-') + 1);
    var messageobj = document.getElementById('deletemessage-' + str).parentNode;
    var textdel = messageobj.textContent.replace(' ', '');
    messageobj.parentNode.parentNode.removeChild(messageobj.parentNode);
    connection.send('broadcastMessage', '_SYSTEM_', 'delete [' + textdel + ']');
};

var messageobj;
var oldmessage;
function editmessage(obj) {
    document.getElementById('sendmessage').removeEventListener('click', sendmesgg);

    var str = obj.id;
    str = str.substring(str.indexOf('-') + 1);
    messageobj = document.getElementById('editmessage-' + str).parentNode;
    oldmessage = messageobj.textContent;
    document.getElementById('message').value = oldmessage;
    document.getElementById('sendmessage').addEventListener('click', sendedit);
}

function sendedit(event) {

    var a = document.getElementById('message');
    var newmessage = a.value;
    messageobj.innerHTML = messageobj.innerHTML.replace(oldmessage, newmessage);

    console.log('oldmessage ' + oldmessage);
    console.log('newmessage ' + newmessage);
    connection.send('broadcastMessage', '_SYSTEM_', '[' + oldmessage + ']' + ' edit {' + newmessage + '}');

    document.getElementById('sendmessage').removeEventListener('click', sendedit);
    document.getElementById('sendmessage').addEventListener('click', sendmesgg);

    document.getElementById('message').value = '';
    document.getElementById('message').focus();
    event.preventDefault();
}
