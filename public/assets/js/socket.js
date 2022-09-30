var socket = io("http://localhost:3000");

socket.on("server-send-dropdown", employees => {
    $("#search-employee").html("")
    employees.map(employee => {
        $("#search-employee").append(`
                <option value="${employee.code}"></option>
            `)
    })

})

socket.on("server-send-client-employee", employee => {
    $("#table-employee").html("")
    $("#table-employee").append(`
              <tr>
                  <td><a href="/api/employee/getEmployeeInformation/${employee._id}">${employee.code}</a></td>
                  <td><a href="/api/employee/getEmployeeInformation/${employee._id}">${employee.name}</a></td>
                  <td>${employee.gender}</td>
                  <td></td>
                  <td>${employee.job}</td>
                  <td><span class="badge bg-label-primary me-1">Active</span></td>
              </tr> 
          `)

})


socket.on("server-send-result", data => {
    alert(data.msg)
})

$(document).ready(function () {
    $("#btn-search-code").click(function () {
        socket.emit("user-input-code", $("#input-code").val())
    })

    $("#input-code").keyup(function () {
        socket.emit("search-code", $("#input-code").val())
    })

    // $("#acupuncture").click(function () {
    //     socket.emit("user-acupuncture", $("#table_id").val())
    // })

})