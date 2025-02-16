let queue = [];

function addToQueue() {
    let fullName = document.getElementById("fullName").value.trim();
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    let email = document.getElementById("email").value.trim();
    let serviceType = document.getElementById("serviceType").value;
    let appointmentTime = document.getElementById("appointmentTime").value;

    if (fullName === "" || phoneNumber === "" || email === "" || serviceType === "" || appointmentTime === "") {
        alert("Please fill in all details.");
        return;
    }

    queue.push({ fullName, phoneNumber, email, serviceType, appointmentTime });
    clearInputs();
    updateQueue();
}

function clearInputs() {
    document.getElementById("fullName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("email").value = "";
    document.getElementById("serviceType").value = "";
    document.getElementById("appointmentTime").value = "";
}

function removeFromQueue(index) {
    queue.splice(index, 1);
    updateQueue();
}

function updateQueue() {
    let queueList = document.getElementById("queueList");
    queueList.innerHTML = "";

    queue.forEach((person, index) => {
        queueList.innerHTML += `
            <div class="queue-item">
                <div>
                    <strong>${person.fullName}</strong> (${person.serviceType})<br>
                    📞 ${person.phoneNumber} | 📧 ${person.email} | ⏰ ${person.appointmentTime}
                </div>
                <i class="fas fa-times" onclick="removeFromQueue(${index})"></i>
            </div>
        `;
    });
}
