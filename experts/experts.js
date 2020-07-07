$.ajax({
  type: "GET",
  url: "/getExperts",
  success: (data) => {
    let experts = data
    experts.forEach((expert, id) => {
      $("#Experts").append(`
        <tr>
          <td id="prevSurname${id}">${expert.surname}</td>
          <td id="prevName${id}">${expert.name}</td>
          <td id="prevPatronymic${id}">${expert.patronymic}</td>
          <td id="prevJob${id}">${expert.job}</td>
          <td id="prevLogin${id}">${expert.login}</td>
          <td id="prevPassword${id}">${expert.password}</td>
          <td id='problems${id}'></td>
          <td><span id='${id}' class="showEditSpecialistForm">&#9999;</span></td>
        </tr>
      `)
      if(Array.isArray(expert.tests)){
        let 
          compleatedProblems = 0,
          problemsName = []

        expert.tests.forEach(test => {
          if(!problemsName.includes(test.problemName))
            problemsName.push(test.problemName)
        })
        problemsName.forEach(name => {
          let problemMethodsStatus = expert.tests.filter(test => {
            return test.problemName === name
          }).map(test => {
            return test.finishTest
          })
          if(problemMethodsStatus.every((status) => { return status === "true" }) && problemMethodsStatus.length === 5)
            compleatedProblems++
        })
        
        $(`#problems${id}`).append(`<div>Выполененно проблем: <b>${compleatedProblems}</b><br></div>`)
      }
      else{
        $(`#problems${id}`).append(`<div>Выполененно проблем: <b>0</b></div>`)
      }
    })
  }
})
$(function(){
  // Добавление нового специалиста
  $("#showSpecialistForm").click(() => {
    $("#SpecialistForm").show()
    $("#FormBack").show()

    $("#button").append(`<button id="addSpecialist" class="d-flex justify-content-center btn btn-info btn-lg  mx-auto btn-sm">Добавить эксперта в базу</button>`)
  })

  $("#ClosePopup").click(() => {
    $("#FormBack").hide()
    $("#button").empty()
    $("#SpecialistForm").hide()
  })

  let id;
  $(document).on("click", ".showEditSpecialistForm", (event) => {
    id = event.target.id
    $("#SpecialistForm").show()
    $("#FormBack").show()
    $("#name").val($(`#prevName${id}`).text())
    $("#surname").val($(`#prevSurname${id}`).text())
    $("#patronymic").val($(`#prevPatronymic${id}`).text())
    $("#job").val($(`#prevJob${id}`).text())
    $("#login").val($(`#prevLogin${id}`).text())
    $("#password").val($(`#prevPassword${id}`).text())

    $("#button").append(`<button id="editSpecialist" class="d-flex justify-content-center btn btn-info btn-lg  mx-auto btn-sm">Внести изменения в базу</button>`)
  })

  // Отправка данных на сервер
  $(document).on("click", "#addSpecialist", ()=>{
    let
        name       = $("#name").val(),
        surname    = $("#surname").val(),
        patronymic = $("#patronymic").val(),
        job        = $("#job").val(),
        login      = $("#login").val(),
        password   = $("#password").val();

    // Если не все поля заполнены, то ошибка
    if(name == "" || surname == "" || patronymic == "" || job == "" || login == "" || password == ""){
      alert("Не все поля заполнены")
      return 0
    }

    $.ajax({
      type: "POST",
      url: "/createExpert",
      data: {name: name, surname: surname, patronymic: patronymic, job:job, login: login, password: password},
      success: (res) => {
        if(res == "Пользователь успешно добавлен в базу"){
          $("#Experts").append(`
            <tr>
              <td>${surname}</td>
              <td>${name}</td>
              <td>${patronymic}</td>
              <td>${job}</td>
              <td><div>Выполененно проблем: <b>0</b></div></td>
              <td><span id='${id}' class="showEditSpecialistForm">&#9999;</span></td>
            </tr>
          `)
          alert("Данные успешно занесены на сервер")
        }
        else{
          alert(res)
        }
      }
    })
  })

  $(document).on("click", "#editSpecialist", ()=>{
    let
        prevName       = $(`#prevName${id}`).text(),
        prevSurname    = $(`#prevSurname${id}`).text(),
        prevPatronymic = $(`#prevPatronymic${id}`).text(),
        prevJob        = $(`#prevJob${id}`).text(),
        name           = $("#name").val(),
        surname        = $("#surname").val(),
        patronymic     = $("#patronymic").val(),
        job            = $("#job").val();

    // Если не все поля заполнены, то ошибка
    if(name == "" || surname == "" || patronymic == "" || job == ""){
      alert("Не все поля заполнены")
      return 0
    }

    $.ajax({
      type: "POST",
      url: "/updateExpert",
      data: {name: name, surname: surname, patronymic: patronymic, job:job, prevJob: prevJob, prevName: prevName, prevSurname: prevSurname, prevPatronymic: prevPatronymic},
      success: (result) => {
        if(result == "Данные успешно обновлены"){
          window.location.reload()
        }
        else{
          alert(result)
        }
      }
    })
  })
})
