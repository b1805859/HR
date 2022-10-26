var socket = io("http://localhost:3000");

socket.on("server-send-dropdown", employees => {
    $("#search-employee").html("")
    employees.map(employee => {
        $("#search-employee").append(`
                <option value="${employee.code}"></option>
            `)
    })

})

socket.on("server-send-client-employee", data => {
  const {employee, department}= data
    $("#table-employee").html("")
    $("#table-employee").append(`
              <tr>
              <td><div style="background-image: url('/assets/img/avatars/${employee.avatar}');
                    width: 45px;
                    height: 45px;
                    background-size: cover;
                    background-position: top center;
                    border-radius: 50%;
                    margin: 0 auto;"></div>
                  </td>
                  <td class="text-left"><a style='color: #697a8d;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.code}</a></td>
                  <td class="text-left"><a style='color: #697a8d;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.name}</a></td>
                  <td class="text-center"><a style='color: #697a8d;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.gender}</a></td>
                  <td class="text-center"><a style='color: #697a8d;' href="/api/employee/getEmployeeInformation/${employee._id}">${department}</a></td>
                  <td class="text-center"><a style='color: #697a8d;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.job}</a></td>
                  <td class="text-center"><a style='color: #697a8d;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-label-primary me-1">${employee.status}</span></a></td>
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
  console.log(data)
    $("#myModal").modal("toggle");
      var title_month = "<th>Mã nhân viên</th><th>Tên nhân viên</th>"
      var employeeReports_encode = data.employeeReports
      var month_encode = data.month
      var year_encode = data.year
      var employeeReports = JSON.parse(employeeReports_encode.replace(/&quot;/ig, '"'));
      var month = JSON.parse(month_encode.replace(/&quot;/ig, '"'));
      var year = JSON.parse(year_encode.replace(/&quot;/ig, '"'));
      var acupuncture_html = ""
      console.log("1")
      var h1 = `Tháng ${month.name} - Năm ${year}`
      for (const employeeReport of employeeReports) {
        const { name, code, acupuncture } = employeeReport;
        acupuncture_html += `<tr>`
        acupuncture_html += `<td>${code}</td>`
        acupuncture_html += `<td>${name}</td>`
        for (let i = 1; i <= month.total; i++) {
          if (acupuncture.length == 0) {
            acupuncture_html += `<td></td>`
            continue;
          }
          let check = 0
          for (let j = 0; j < acupuncture.length; j++) {
            const { date } = acupuncture[j];
            if (date == String(i)) {
              acupuncture_html += `<td><span class="badge badge-center rounded-pill bg-success">v</span></td>`
              break;
            }
            check++;
            if (check == acupuncture.length) {
              if (i >= acupuncture[acupuncture.length - 1].date) {
                acupuncture_html += `<td></td>`
              }
              else {
                acupuncture_html += `<td><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
              }
            }
          }
        }
        acupuncture_html += `</tr>`
      }
      console.log("2")
  
      console.log("acupuncture_html",acupuncture_html)
      //Hiển thị tháng
      for (let i = 1; i <= month.total; i++) {
        title_month += `<th class="text-center">${i}</th>`
      }
      console.log("3")
      $('h1:first').text(h1)
      $("#title_month").html(title_month)
      $("#acupuncture_user").html(acupuncture_html)
      $('#div-btn').show()
      //$('#card').show()
  
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



socket.on("server-send-report-user", data=>{
 
  if (data.msgError) {
    var h1 = `<h3 class="text-center mt-5 p-5">${data.msgError}</h3>`
    $('h1:first').text('Không có bảng chấm công')
    $("#title_month").html('')
    $('#acupuncture_user').html('')
    $('#card').hide()
    $("#messageError").css({"display": "flex","flex-direction": "column","align-items": "center"});
  }
  else {
    var title_month = "<th>Mã nhân viên</th><th>Tên nhân viên</th>"
      var employeeReports_encode =  data.employeeReports
      var month_encode = data.month
      var employeeReports = JSON.parse(employeeReports_encode.replace(/&quot;/ig, '"'));
      var month = JSON.parse(month_encode.replace(/&quot;/ig, '"'));
      var acupuncture_html = ""
      var year_encode =  data.year
      var year = JSON.parse(year_encode.replace(/&quot;/ig, '"'));
      var h1 = `Tháng ${month.name} - Năm ${year}`
      for (const employeeReport of employeeReports) {
        const { name, code, acupuncture } = employeeReport;
        acupuncture_html += `<tr>`
        acupuncture_html += `<td>${code}</td>`
        acupuncture_html += `<td>${name}</td>`
        for (let i = 1; i <= month.total; i++) {
          if(acupuncture.length ==0)
          {
            acupuncture_html += `<td></td>`
            continue;
          }
          let check = 0
          for (let j = 0; j < acupuncture.length; j++) {
            const { date } = acupuncture[j];
            if (date == String(i)) {
              acupuncture_html += `<td><span class="badge badge-center rounded-pill bg-success">v</span></td>`
              break;
            }
            check++;
            if (check == acupuncture.length) {
              if (i >= acupuncture[acupuncture.length - 1].date) {
                acupuncture_html += `<td></td>`
              }
              else {
                acupuncture_html += `<td><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
              }
            }
          }
        }
        acupuncture_html += `</tr>`
      }
      
      //Hiển thị tháng
      for (let i = 1; i <= month.total; i++) {
        title_month += `<th class="text-center">${i}</th>`
      }
      $('h1:first').text(h1)
    $("#title_month").html(title_month)
    $("#acupuncture_user").html(acupuncture_html)
    $("#messageError").css({"display": "none","flex-direction": "column","align-items": "center"});
    $('#card').show()
  }
})





socket.on("server-send-report-employee", data=>{
 
  if (data.msgError) {
    var h1 = `<h3 class="text-center mt-5 p-5">${data.msgError}</h3>`
    $('h1:first').text('Không có bảng chấm công')
    $("#title_month").html('')
    $('#acupuncture_user').html('')
    $('#card').hide()
    $("#messageError").css({"display": "flex","flex-direction": "column","align-items": "center"});
  }
  else {
    var title_month = "<th>Mã nhân viên</th><th>Tên nhân viên</th>"
      var employeeReports_encode =  data.employeeReports
      var month_encode = data.month
      var year_encode =  data.year
      var employeeReports = JSON.parse(employeeReports_encode.replace(/&quot;/ig, '"'));
      var month = JSON.parse(month_encode.replace(/&quot;/ig, '"'));
      var year = JSON.parse(year_encode.replace(/&quot;/ig, '"'));
      var acupuncture_html = ""
      var h1 = `Tháng ${month.name} - Năm ${year}`
      for (const employeeReport of employeeReports) {
        const { name, code, acupuncture } = employeeReport;
        acupuncture_html += `<tr>`
        acupuncture_html += `<td>${code}</td>`
        acupuncture_html += `<td>${name}</td>`
        for (let i = 1; i <= month.total; i++) {
          if(acupuncture.length ==0)
          {
            acupuncture_html += `<td></td>`
            continue;
          }
          let check = 0
          for (let j = 0; j < acupuncture.length; j++) {
            const { date } = acupuncture[j];
            if (date == String(i)) {
              acupuncture_html += `<td><span class="badge badge-center rounded-pill bg-success">v</span></td>`
              break;
            }
            check++;
            if (check == acupuncture.length) {
              if (i >= acupuncture[acupuncture.length - 1].date) {
                acupuncture_html += `<td></td>`
              }
              else {
                acupuncture_html += `<td><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
              }
            }
          }
        }
        acupuncture_html += `</tr>`
      }
      
      //Hiển thị tháng
      for (let i = 1; i <= month.total; i++) {
        title_month += `<th class="text-center">${i}</th>`
      }
      $('h1:first').text(h1)
    $("#title_month").html(title_month)
    $("#acupuncture_user").html(acupuncture_html)
    $("#messageError").css({"display": "none","flex-direction": "column","align-items": "center"});
    $('#card').show()
  }
})






socket.on("server-send-result-create-table", data=>{
  var tables_encode = data.tables
  var tables = JSON.parse(tables_encode.replace(/&quot;/ig, '"'));
  var table_timekeep = ""
  for (const element of tables) {
    const { table, monthName } = element
    table_timekeep += `<tr>`
    table_timekeep += `<td class='text-center'>${monthName}/${table.year}</td>`
    table_timekeep += `<td class='text-center'>
      <button id='btn-delete-table' type="button" class="btn btn-outline-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
              </svg>
            </button>
    </td>`
    table_timekeep += `</tr>`
  }

  $('#table-timekeep').html(table_timekeep)
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