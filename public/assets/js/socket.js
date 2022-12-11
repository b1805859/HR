var socket = io("http://localhost:8080");

socket.on("server-send-filter", data => {
  const {employeeList, current, showPag} = data
  const employeeListParse = JSON.parse(employeeList.replace(/&quot;/g, '"'));
  $("#table-employee").html("")
  var html_employee =''
  if(showPag == false)
  {
    for(const element of employeeListParse){ 
      const {employee,department} = element
      html_employee += "<tr> "
          html_employee += `<td><div style="background-image: url('/assets/img/avatars/${employee.avatar}');
                      width: 45px;
                      height: 45px;
                      background-size: cover;
                      background-position: top center;
                      border-radius: 50%;
                      margin: 0 auto;"></div></td>`
          html_employee += `<td class="text-left"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.code}</a></td>`
          html_employee += `<td class="text-left"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.name}</a></td>`
          html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.gender}</a></td>`
          html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${department}</a></td>`
          html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.job}</a></td>`
          if (employee.status == "draft") {
            html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-secondary me-1">Nháp</span></a></td>`
          }
          else if (employee.status == 'demit') {
            html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-danger me-1">Lưu trữ</span></a></td>`
          }
          else if (employee.status == 'working') {
            html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-success me-1">Đang làm việc</span></a></td>`
          }
          html_employee += "</tr>"
    }
    $("#table-employee").html(html_employee)
  }
  else
  {
    for(let i =0; i< 8; i++){ 
      const {employee,department} = employeeListParse[i]
      html_employee += "<tr> "
          html_employee += `<td><div style="background-image: url('/assets/img/avatars/${employee.avatar}');
                      width: 45px;
                      height: 45px;
                      background-size: cover;
                      background-position: top center;
                      border-radius: 50%;
                      margin: 0 auto;"></div></td>`
          html_employee += `<td class="text-left"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.code}</a></td>`
          html_employee += `<td class="text-left"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.name}</a></td>`
          html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.gender}</a></td>`
          html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${department}</a></td>`
          html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}">${employee.job}</a></td>`
          if (employee.status == "draft") {
            html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-secondary me-1">Nháp</span></a></td>`
          }
          else if (employee.status == 'demit') {
            html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-danger me-1">Lưu trữ</span></a></td>`
          }
          else if (employee.status == 'working') {
            html_employee += `<td class="text-center"><a style='font-size:0.9375rem; color: #212529;' href="/api/employee/getEmployeeInformation/${employee._id}"><span class="badge bg-success me-1">Đang làm việc</span></a></td>`
          }
          html_employee += "</tr>"
    }
    $("#table-employee").html(html_employee)
  }

  if(current == 1000)
  {
    $("#pagination").show()
  }
  else
  {
    $("#pagination").hide()

  }


})



socket.on("server-send-employee-list", data =>{
  const { list } = data
  const employeeList = JSON.parse(list.replace(/&quot;/g, '"'));
  $("#code-manager-list").html("")

  for(const employee of employeeList)
  {
    $("#code-manager-list").append(`<option value="${employee.code}">${employee.name}</option>`)

  }
  
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
            <h4 class="text-dark modal-title w-100">${data.msg}</h4>
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
      var title_month = "<th class='text-center py-3'>Mã nhân viên</th><th class='text-center py-3'>Tên nhân viên</th>"
      var employeeReports_encode = data.employeeReports
      var month_encode = data.month
      var year_encode = data.year
      var employeeReports = JSON.parse(employeeReports_encode.replace(/&quot;/ig, '"'));
      var month = JSON.parse(month_encode.replace(/&quot;/ig, '"'));
      var year = JSON.parse(year_encode.replace(/&quot;/ig, '"'));
      var acupuncture_html = ""
      
      var h1 = `Tháng ${month.name} - Năm ${year}`
      for (const employeeReport of employeeReports) {
        const { name, code, acupuncture } = employeeReport;
        acupuncture_html += `<tr>`
        acupuncture_html += `<td class='py-2'>${code}</td>`
        acupuncture_html += `<td class='py-2'>${name}</td>`
        for (let i = 1; i <= month.total; i++) {
          if (acupuncture.length == 0) {
            acupuncture_html += `<td></td>`
            continue;
          }
          let check = 0
          for (let j = 0; j < acupuncture.length; j++) {
            const { date, late_check } = acupuncture[j];
            if (date == String(i)) {
              if (late_check == true) {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-warning">!</span></td>`
              }
              else {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-success">v</span></td>`
              }
              break;
            }
            check++;
            if (check == acupuncture.length) {
              if (i >= acupuncture[acupuncture.length - 1].date) {
                acupuncture_html += `<td class='py-2'></td>`
              }
              else {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
              }
            }
          }
        }
        acupuncture_html += `</tr>`
      }

  
      //Hiển thị tháng
      for (let i = 1; i <= month.total; i++) {
        title_month += `<th class="text-center py-3">${i}</th>`
      }
      
      $('h1:first').text(h1)
      $("#title_month").html(title_month)
      $("#acupuncture_user").html(acupuncture_html)
      $('#div-btn').show()
      //$('#card').show()
  
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

    var now = new Date();
    var yearNow = now.getFullYear();
    var mon = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();



    var title_month = "<th class='py-3'>Mã nhân viên</th><th class='py-3'>Tên nhân viên</th>"
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
        acupuncture_html += `<td class='py-2' style="font-size: 0.9375rem;">${code}</td>`
        acupuncture_html += `<td class='py-2' style="font-size: 0.9375rem;">${name}</td>`
        for (let i = 1; i <= month.total; i++) {
          if(acupuncture.length ==0)
          {
            acupuncture_html += `<td class='py-2'></td>`
            continue;
          }
          let check = 0
          for (let j = 0; j < acupuncture.length; j++) {
            const { date, late_check } = acupuncture[j];
            if (date == String(i)) {
              if (late_check == true) {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-warning">!</span></td>`
              }
              else {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-success">v</span></td>`
              }
              break;
            }
            check++;
            if (check == acupuncture.length) {
              if (i >= acupuncture[acupuncture.length - 1].date) {
                if((Number(month.name) < Number(mon)) && (Number(year) <= Number(yearNow)))
                {
                  acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
                }
                else
                {
                  acupuncture_html += `<td class='py-2'></td>`
                }
              }
              else {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
              }
            }
          }
        }
        acupuncture_html += `</tr>`
      }

      
      
      //Hiển thị tháng
      for (let i = 1; i <= month.total; i++) {
        title_month += `<th class="text-center py-3">${i}</th>`
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

    var now = new Date();
    var yearNow = now.getFullYear();
    var mon = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    var title_month = "<th class='py-3'>Mã nhân viên</th><th class='py-3'>Tên nhân viên</th>"
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
        acupuncture_html += `<td class='py-2' style="font-size: 0.9375rem;">${code}</td>`
        acupuncture_html += `<td class='py-2' style="font-size: 0.9375rem;">${name}</td>`
        for (let i = 1; i <= month.total; i++) {
          if(acupuncture.length ==0)
          {
            acupuncture_html += `<td class='py-2'></td>`
            continue;
          }
          let check = 0
          for (let j = 0; j < acupuncture.length; j++) {
            const { date, late_check } = acupuncture[j];
            if (date == String(i)) {
              if (late_check == true) {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-warning">!</span></td>`
              }
              else {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-success">v</span></td>`
              }
              break;
            }
            check++;
            if (check == acupuncture.length) {
              if (i >= acupuncture[acupuncture.length - 1].date) {
                if((Number(month.name) < Number(mon)) && (Number(year) <= Number(yearNow)))
                {
                  acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
                }
                else
                {
                  acupuncture_html += `<td class='py-2'></td>`
                }
              }
              else {
                acupuncture_html += `<td class='py-2'><span class="badge badge-center rounded-pill bg-danger">x</span></td>`
              }
            }
          }
        }
        acupuncture_html += `</tr>`
      }
      
      //Hiển thị tháng
      for (let i = 1; i <= month.total; i++) {
        title_month += `<th class="text-center py-3">${i}</th>`
      }
      $('h1:first').text(h1)
    $("#title_month").html(title_month)
    $("#acupuncture_user").html(acupuncture_html)
    $("#messageError").css({"display": "none","flex-direction": "column","align-items": "center"});
    $('#card').show()
  }
})






socket.on("server-send-result-create-table", data=>{
  if(data.msgSuccess)
  {
    $("#myModalSuccess").modal("show");
    var tables_encode = data.tables
    var tables = JSON.parse(tables_encode.replace(/&quot;/ig, '"'));
    var table_timekeep = ""
  
    for (const element of tables) {
      const { table, monthName } = element
      table_timekeep += `<tr>`
      if (String(`${monthName}`).length == 1) {
  
        table_timekeep += `<td class=" py-2" style="font-size:0.9375rem;">0${monthName}/${table.year}</td>`
      }
      else {
        table_timekeep += `<td class=" py-2" style="font-size:0.9375rem;">${monthName}/${table.year}</td>`
      }
      table_timekeep += `</tr>`
    }
  
    $('#table-timekeep').html(table_timekeep)

  }
  else if(data.msgError)
  {
    $("#myModalError").modal("show");
  }
})



socket.on("server-send-result-ktkl-type", data=>{
  $('#ktklLine').html("")
  const {ktklLine} = data
  const ktklLines = JSON.parse(ktklLine.replace(/&quot;/g, '"'));
  for (const line of ktklLines) {
    const { employee, ktkl } = line
    const { code, name, job } = employee
    const { _id, day, type } = ktkl
    let html = ''
    html += "<tr>"
    html += `<td class="py-2" style="font-size: 0.9375rem;">${code}</td>`
    html += `<td class="py-2" style="font-size: 0.9375rem;">${name}</td>`
    html += `<td class="py-2" style="font-size: 0.9375rem;"> ${job} </td >`
    html += `<td class="py-2" style="font-size: 0.9375rem;"> ${day} </td>`
    if (String(type) == 'khen_thuong') {
      html += `<td class="py-2" style="font-size: 0.9375rem;">Khen thưởng</td>`
    }
    else {
      html += `<td class="py-2" style="font-size: 0.9375rem;">Kỷ luật</td>`
    }
    html += `<td class="py-2 text-center" style='font-size: 0.9375rem;'>` +
      `<a style="color: #212529; margin-right:10px" href= '/api/ktkl/information/${_id}'>` +
      `<button type="button" class="btn btn-outline-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"></path>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"></path>
                  </svg>
                </button></a>` +
      `<a style='color: #212529;' href='/api/ktkl/delete/${_id}'>` +
      `<button type="button" class="btn btn-outline-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                  </svg>
        </button></a ></td>`
    html += "</tr>"

    $('#ktklLine').append(html)
  }
})



$(document).ready(function () {

    $("#input-code").on('input',function () {
        socket.emit("filter-type",{ code:  $("#input-code").val(), status: $('#select-status').val(), department_id: $('#select-department').val()})
    })


    $("#code-manager").on('input',function () {
      socket.emit("search-code-manager",{ code:  $("#code-manager").val(), department_id: $(department_id).val()})
  })


    $('#select-status').on('change', function (e) {
      socket.emit("filter-type", {status: this.value, code:  $("#input-code").val(), department_id: $('#select-department').val()})
    });

    $('#select-department').on('change', function (e) {
      socket.emit("filter-type", {department_id: this.value, status: $('#select-status').val(), code:  $("#input-code").val()})
    });

})

