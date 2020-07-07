$(function(){
  let problemId

  $(document).on("click", ".showEditForm", (e) => {
    let id = e.target.id
    problemId = id

    let alts = $(`.alts${id}`).map((id, alt) => {
      return $(alt).text()
    })

    let experts = $(`.experts${id}`).map((id, expert) => {
      return $(expert).text()
    })

    let expertsCompetence = $(`.experts${id}Competence`).map((id, expertCompetence) => {
      return $(expertCompetence).text()
    })

    $("#problemName").val($(`#name${id}`).text())

    $("#scale").val($(`#problem${id}scale`).text())

    for (let i = 0; i < alts.length; i++) {
      $("#AddNewAlt").before(`
        <div id='alt${i}' class="Alternatives input-group mb-2">
          <input  class="form-control form-control-sm border border-info border-right-0" type="text" value="${alts[i]}" />
          <button data-id="${i}" class="DeleteAlt" style="border: 1px solid #17a2b8; border-radius: 0 4px 4px 0; background: white;">-</button>
        </div>
      `)
    }

    $.ajax({
      type: "GET",
      url: "/getExperts",
      success: (data) => {
        for (let j = 0; j < experts.length; j++) {
          $("#addInputExpert").before(`
          <div class='Experts input-group mb-2' id='expert${j}'>
            <select class='listOfExperts custom-select custom-select-sm border border-info rounded'></select>
            <div title="Компетентность эксперта по шкале от 0 до 10">&emsp;Компетентность:&ensp;
              <input class="competence border border-info rounded pl-2 mr-1" style="height: calc(1.5em + .5rem + 2px); font-size: .875rem;" step="0.1" type="number" min="0" max="10" value="${expertsCompetence[j]}" prevVal="0"/>
            </div>
              <button data-id="${j}" class='deleteInputExpert' style="border: 1px solid #17a2b8; border-radius: 4px;  background: white;">-</button>
          </div>`)

          data.forEach(expert => {

            $(".listOfExperts:last").append(`<option>${expert.surname} ${expert.name} ${expert.patronymic}</option>`)
          })
          $(`.listOfExperts:last option:contains("${experts[j]}")`).prop('selected', true);

          $(".listOfExperts:last").attr("prevOption", $(".listOfExperts:last").val())
        }
      }
    })
    $("#CreateFormBack").show()
    $("#CreateForm").show()

  })

  $(document).on('click', '#AddNewAlt', ()=>{
    let i = $(`.altName${problemId}`).length
    $("#AddNewAlt").before(`<div id='alt${i}' class='Alternatives input-group mb-2'><input class="form-control form-control-sm border border-info border-right-0" type='text'/><button data-id="${i}" class="DeleteAlt" style="border: 1px solid #17a2b8; border-radius: 0 4px 4px 0; background: white;">-</button></div>`)
  })

  $(document).on('click', ".DeleteAlt", (event)=>{
    let idAlternative = $(event.target).attr("data-id")
    let isDelete = confirm("Вы действительно хотите удалить альтернативу?")
    if(!isDelete){
      return 0
    }
    else{
      $(`#alt${idAlternative}`).remove()
    }
  })

  // Удаление определённого эксперта
  $(document).on('click', ".deleteInputExpert", (event)=>{

    let idExpert = $(event.target).attr("data-id")

    $(`#expert${idExpert}`).remove()
  })

  $(document).on('change', '.listOfExperts', (event) => {
    let
      newExpert = event.target.value,
      prevVal   = event.target.getAttribute('prevOption'),
      error = false;

    // Проверка на то что такой эксперт уже есть в других select
    $('.listOfExperts').map((index, select) => {
      if(select.getAttribute('prevOption') == newExpert){
        error = true
        event.target.value = prevVal
      }
    })
    if(error)
      alert("Выбранный эксперт уже сужествует в выборе")
    else
      event.target.setAttribute('prevOption', newExpert)
  })

  $(document).on('click', '#addInputExpert', ()=>{
    $.ajax({
      type: "GET",
      url: "/getExperts",
      success: (data) => {
        let countOfExpert = $(".listOfExperts").length
        let j = countOfExpert
        if(countOfExpert < data.length){
          let currentExperts = []
          $('.listOfExperts').map((index, select) => {
            currentExperts.push(select.value)
          })
          $("#addInputExpert").before(`
            <div id='expert${j}' class="input-group mb-2">
              <select class='listOfExperts custom-select custom-select-sm border border-info rounded'></select>
              <div title="Компетентность эксперта по шкале от 0 до 10">&emsp;Компетентность:&ensp;
                <input class="competence border border-info rounded pl-2 mr-1" style="height: calc(1.5em + .5rem + 2px); font-size: .875rem;" type="number" step="0.1" min="0" max="10" value="0" prevVal="0"/>
              </div>
                <button data-id="${j}" class='deleteInputExpert' style="border: 1px solid #17a2b8; border-radius: 4px;  background: white;">-</button>
            </div>`)
          j++
          let abilityToSelect = true
          data.forEach(res => {
            if(currentExperts.indexOf(`${res.surname} ${res.name} ${res.patronymic}`) != -1 || !abilityToSelect ){
              $(".listOfExperts:last").append(`<option>${res.surname} ${res.name} ${res.patronymic}</option>`)
            }
            else if(abilityToSelect){
              abilityToSelect = false
              $(".listOfExperts:last").append(`<option selected='selected'>${res.surname} ${res.name} ${res.patronymic}</option>`)
              $(".listOfExperts:last").attr("selected", "selected")
            }
          });
          $(".listOfExperts:last").attr("prevOption", $(".listOfExperts:last").val())
        }
        else{
          alert("Количество полей выбора экспертов превышает количество экспертов")
        }
      }
    })
  })

  $(document).on('click', "#Begin", (e)=>{
    let
      methodId = $(e.target).attr("data-id"),
      problemName = $(`#name${methodId}`).text() 

    let toBegin = confirm("После начала оценивания проблемы изменить ее будет невозможно. Продолжить?")
    if(!toBegin){
      return 0
    }
    $.ajax({
      type: "POST",
      url: "/begin",
      data: {name: problemName},
      success: (res) => {
        window.location.reload()
      }
    })
  })
  $(document).on('click', '#Submit', (e)=>{
    let
      action = $(e.target).attr("action"),
      name = $("#problemName").val(),
      alternative = [],
      spec = [],
      alts = $(".Alternatives > input")
      prevName = $(`#name${problemId}`).text(),
      competences = $(".competence"),
      scale = $("#scale").val();

    if(alts.length < 2){
      alert("В проблеме не может быть меньше двух альтернатив")
      return 0
    }
    // Собираются все альтернативы
    for(let i = 0; i < alts.length; i++){
      alternative.push(alts[i].value)
    }

    // собираются все экспреты
    specs = $(".listOfExperts option:selected")
    for(let i = 0; i < specs.length; i++){
      spec.push({name:specs[i].value, status: false, competence: +competences[i].value})
    }

    // Если имя, альтернативы или спциалисты не заданы, то ошибка
    if (name == "" || alternative == [] || spec == []){
      alert("Ошибка")
      return 0
    }

    if(prevName == name){
      name = ""
    }
    // Отправка данных на сервер

    $.ajax({
      type: "POST",
      url: "/updateProblem",
      data: {name: name, alternative: alternative, expert: spec, prevName: prevName, action: action, scale:scale},
      success: (res) => {
        if(res == "Данные успешно занесены на сервер")
          window.location.reload()
        else{
          alert(res)
        }
        // alert(res.replace('false',''))
      }
    })
  })
    // Добавление эксперта
  $("#showSpecialistForm").click(() => {
    $("#FormBack").show()
    $("#SpecialistForm").show()
  })
  $("#ClosePopupExpert").click(() => {
    $("#FormBack").hide()
    $("#SpecialistForm").hide()
  })

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
            alert("Данные успешно занесены на сервер")

            // Получение новой информации об эксертах
            $.ajax({
              type: "GET",
              url: "/getExperts",
              success: (data) => {
                let expertsInf = data
                $(".listOfExperts").map((id, select) => {
                  let choise = $(select).val()
                  $(select).empty()

                  expertsInf.forEach(expert => {
                    $(select).append(`<option>${expert.surname} ${expert.name} ${expert.patronymic}</option>`)
                  })

                  $(`#expert${id} option:contains(${choise})`).prop('selected', true);
                  $(select).attr("prevOption", $(select).val())
                })
              }
            })
          }
          else{
            alert(res)
          }
        }
      })
  })
})
