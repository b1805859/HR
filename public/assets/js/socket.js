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
        acupuncture += `<td><span class="badge badge-center rounded-pill bg-success">v</span></td>`
        break;
      }
      check++;
      if (check == acupuncturesParse.length) {
        if (i >= acupuncturesParse[acupuncturesParse.length - 1].date) {
          acupuncture += `<td></td>`

        }
        else {
          acupuncture += `<td><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
        }
      }
    }
  }

  $("#acupuncture_user").html(acupuncture)
  $("#data-dismiss").click(function(){
    $("#myModal").modal("hide");
  });
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
  }
  else {

    //reset
    var html = "<th>Mã nhân viên</th><th>Tên nhân viên</th>"
    var acupuncture = `<td>${data.employee.code}</td><td>${data.employee.name}</td>`;
    var month_encode = data.month
    var acupunctures_encode = data.acupunctures
    var month = JSON.parse(month_encode.replace(/&quot;/ig, '"'));
    var acupunctures = JSON.parse(acupunctures_encode.replace(/&quot;/ig, '"'));
    var h1 = `<h1 class="text-center mt-4 mb-2">Tháng ${month.name}</h1>`
    for (let i = 1; i <= month.total; i++) {
      html += `<th class="text-center">${i}</th>`
      let check = 0
      for (let j = 0; j < acupunctures.length; j++) {
        const { date } = acupunctures[j];
        if (String(date) === String(i)) {
          acupuncture += `<td><span class="badge badge-center rounded-pill bg-success">v</span></td>`
          break;
        }
        check++;
        if (check == acupunctures.length) {

          if (i >= acupunctures[acupunctures.length - 1].date) {
            acupuncture += `<td></td>`
          }
          else {
            acupuncture += `<td><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
          }
        }
      }
    }

    $('h1:first').html(h1)
    $("#title_month").html(html)
    $("#acupuncture_user").html(acupuncture)
  }
})





socket.on("server-send-report-employee", data=>{
 
  if (data.msgError) {
    var h1 = `<h3 class="text-center mt-5 p-5">${data.msgError}</h3>`
    $('h1:first').text('Không có bảng chấm công')
    $("#title_month").html('')
    $('#acupuncture_user').html('')
  }
  else {
    var title_month = "<th>Mã nhân viên</th><th>Tên nhân viên</th>"
      var employeeReports_encode =  data.employeeReports
      var month_encode = data.month
      var employeeReports = JSON.parse(employeeReports_encode.replace(/&quot;/ig, '"'));
      var month = JSON.parse(month_encode.replace(/&quot;/ig, '"'));
      var acupuncture_html = ""
      var h1 = `Tháng ${month.name}`
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
  }
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