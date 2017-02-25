var items = document.getElementById("listId");
var userName;
var inputMessage;
var data = [];

function DeliverMessage($event) {
    var messageElement = document.getElementById("inputId");
    inputMessage = messageElement.value.trim();
    if (inputMessage != "" || inputMessage != null) {
        var spanName = document.createElement("span");
        spanName.className = "name";
        spanName.innerText = userName + " ";
        var spanTime = document.createElement("span");
        spanTime.className = "time";
        spanTime.innerText = new Date().getHours() + ":" + new Date().getMinutes();
        createItem("friend-with-a-SVAGina", spanName, spanTime, inputMessage);
        sendMessage(userName, inputMessage);
    }
    messageElement.value = "";
    messageElement.focus();
}

var longPoll = function () {
    var obj = {};
    obj.id = data.length > 0 ? data[data.length - 1].id : -1;
    $.ajax({
        method: 'POST',
        url: '/getMessage',
        data: obj,
        success: function (data1) {
            console.log(data1);
            if (data1.length > 0) {
                addItemToList(data1);
                console.log(data1);
            }
        }
    })
};
longPoll();

setInterval(function () {
    longPoll();
}, 3000);

function sendMessage() {
    var obj = {};
    obj.userName = userName;
    obj.message = inputMessage;

    $.ajax({
        method: 'POST',
        url: '/sendMessage',
        data: obj,
        success: function (data1) {

            if (data.length > 0)
                data.push(data1);
            else {
                data[0] = data1;
                console.log(data);
            }

        }
    });
}

function addItemToList(data1) {

    for (var i = 0; i < data1.length; i++) {
        data.push(data1[i]);
        if (userName != data1[i].userName) {
            var spanName = document.createElement("span");
            spanName.className = "name";
            spanName.innerText = "  " + data1[i].userName;
            var spanTime = document.createElement("span");
            spanTime.className = "time";
            spanTime.innerText = new Date().getHours() + ":" + new Date().getMinutes();
            createItem("i", spanTime, spanName, data1[i].message);
        }
    }
}


function createItem(itemClassName, spanElem1, spanElem2, message) {
    var item = document.createElement("li");
    item.className = itemClassName;

    var messageHead = document.createElement("div");
    messageHead.className = "head";

    messageHead.appendChild(spanElem1);
    messageHead.appendChild(spanElem2);

    var messageDiv = document.createElement("div");
    messageDiv.className = "message";
    messageDiv.innerText = message;

    item.appendChild(messageHead);
    item.appendChild(messageDiv);

    items.appendChild(item);
    updateScroll();
}

$.ajax({
    method: 'GET',
    url: '/getUserName',
    success: function (data) {
        userName = data.userName;
        var name = document.getElementById("titleId");
        name.innerText = userName;
        console.log(userName);
    }
});

function updateScroll() {
    var element = document.getElementById("listId");
    element.scrollTop = element.scrollHeight;
}

document.getElementById("inputId").addEventListener("keypress", function (event) {
    if (event.which == 13)
        DeliverMessage();
});


