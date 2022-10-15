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
    html = `<div class="modal-dialog modal-confirm">
    <div class="modal-content">
        <div class="modal-header">
            <div class="icon-box-err">
                <i class='bx bx-x' style='vertical-align: middle;
                font-size: 4.15rem;
                line-height: 1;'></i>
            </div>
            <h4 class="modal-title w-100">${data.msg}</h4>
        </div>
        <div class="modal-body">
            <p class="text-center"></p>
        </div>
        <div class="modal-footer d-flex justify-content-center">
            <button class="btn btn-success btn-block" id="data-dismiss">Đóng</button>
        </div>
      </div>
    </div>`
    $("#myModal").html(html);
    $("#myModal").modal("toggle");
    $("#data-dismiss").click(function(){
      $("#myModal").modal("hide");
    });
})


socket.on("server-send-acupuncture-data", data => {

    $("#myModal").modal("toggle");

    const {acupunctures,employee, month,table_id } =data
    var html = "<th>Mã nhân viên</th><th>Tên nhân viên</th>"
    var acupuncture = `<td>${employee.code}</td><td>${employee.name}</td>`;
    var monthPrase = JSON.parse(month.replace(/&quot;/ig, '"'));
    var acupuncturesParse = JSON.parse(acupunctures.replace(/&quot;/ig, '"'));
for (let i = 1; i <= monthPrase.total; i++) {
    html += `<th>${i}</th>`
    let check = 0
    for (let j = 0; j < acupuncturesParse.length; j++) {
      const { date } = acupuncturesParse[j];
      if (String(date) === String(i)) {
        acupuncture += `<td>1</td>`
        break;
      }
      check++;
      if (check == acupuncturesParse.length) {
        acupuncture += `<td></td>`
      }
    }
  }

  $("#acupuncture_user").html(acupuncture)
  $("#data-dismiss").click(function(){
    $("#myModal").modal("hide");
  });
})



socket.on("server/api/timekeep/timekeep-table", data=>{
  var html 
  for(const month of data)
  {
    const {_id ,name} = month
      html += `<option value="${_id}">${name}</option>`
  }
  $("#thang").html(html)
})



socket.on("server/api/department/getListDepartment", data=>{
  var html 
  for(const month of data)
  {
    const {_id ,name} = month
      html += `<option value="${_id}">${name}</option>`
  }
  $("#select-department").html(html)
})


$(document).ready(function () {
    $("#btn-search-code").click(function () {
        socket.emit("user-input-code-type",{code: $("#input-code").val(),type: $("#type").val()})
    })

    $("#input-code").keyup(function () {
        socket.emit("search-code", $("#input-code").val())
    })

    // $("#acupuncture").click(function () {
    //     socket.emit("user-acupuncture", $("#table_id").val())
    // })

})