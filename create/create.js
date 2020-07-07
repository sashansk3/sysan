$.ajax({
  type: "GET",
  url: "/getExperts",
  success: (data) => {
    let expertsInf = data
    expertsInf.forEach(expert => {
      $(".listOfExperts:last").append(`<option>${expert.surname} ${expert.name} ${expert.patronymic}</option>`)
    });
    $(".listOfExperts:last").attr("prevOption", $(".listOfExperts:last").val())
  }
})
$(function(){
  $("#showSpecialistForm").click(() => {
    $("#FormBack").show()
    $("#SpecialistForm").show()
  })
  $("#ClosePopup").click(() => {
    $("#FormBack").hide()
    $("#SpecialistForm").hide()
  })

  // Добавление новой альтернативы
  let i = 2
  $(document).on('click', '#AddNewAlt', ()=>{
    $("#AddNewAlt").before(`<div id='${i}' class='Alternatives input-group mb-2'><input class="form-control form-control-sm border border-info border-right-0" type='text'/><button class='DeleteAlt${i}' style="border: 1px solid #17a2b8; border-radius: 0 4px 4px 0; background: white;">-</button></div>`)
    i++
  })

  // Удаление определенной альтернтаивы
  $(document).on('click', "button[class^='DeleteAlt']", (event)=>{
    let idAlternative = $(event.target).attr("class").slice(-2)

    if(isNaN(idAlternative)){
      idAlternative = idAlternative[1]
    }

    $(`#${idAlternative}`).remove()
  })

  // Удаление определённого эксперта
  $(document).on('click', ".deleteInputExpert", (event)=>{
    let idExpert = $(event.target).attr("data-id")

    $(`#expert${idExpert}`).remove()
  })

  // Проверка на то что выбранный эксперт уже есть в других выборах
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

  let j = 1
  $(document).on('click', '#addInputExpert', ()=>{
    $.ajax({
      type: "GET",
      url: "/getExperts",
      success: (data) => {
        let countOfExpert = $(".listOfExperts").length
        if(countOfExpert < data.length){
          let currentExperts = []
          $('.listOfExperts').map((index, select) => {
            currentExperts.push(select.value)
          })
          $("#addInputExpert").before(`
            <div id='expert${j}' class="input-group mb-2">
              <select class='listOfExperts custom-select custom-select-sm  border border-info rounded'></select>
              <div title="Компетентность эксперта по шкале от 0 до 10">&emsp;Компетентность:&ensp;
                <input class="competence border border-info rounded pl-2 mr-1" style="height: calc(1.5em + .5rem + 2px); font-size: .875rem;" type="number" step="0.1" min="0" max="10" value="0" prevVal="0"/>
              </div>
              <button data-id="${j}" class='deleteInputExpert' style="border: 1px solid #17a2b8; border-radius: 4px;  background: white;">-</button>
            </div>
          `)
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
          })
          $(".listOfExperts:last").attr("prevOption", $(".listOfExperts:last").val())
        }
        else{
          alert("Количество полей выбора экспертов превышает количество экспертов")
        }
      }
    })
  })

  // Сбор всей информации и отправка на сервер
  $(document).on('click', '#Submit', ()=>{
    let
      name        = $("#problemName").val(),
      alternative = [],
      spec        = [],
      alts        = $(".Alternatives > input"),
      specs       = $(".listOfExperts option:selected"),
      competences = $(".competence"),
      scale       = $("#scale").val();

    if(alts.length < 2){
      alert("В проблеме не может быть меньше двух альтернатив")
      return 0
    }

    // Собираются все альтернативы
    for(let i = 0; i < alts.length; i++){
      if(alternative.includes(alts[i].value)){
        alert("Проблема не может содержать две одинаковые альтернативы")
        return
      }
      alternative.push(alts[i].value)
    }

    // собираются все экспреты
    for(let i = 0; i < specs.length; i++){
      spec.push({name:specs[i].value, status: false, competence: +competences[i].value})
    }

    // Если имя, альтернативы или спциалисты не заданы, то ошибка
    if (name == "" || alternative == [] || spec == []){
      alert("Ошибка")
      return 0
    }

    if(scale === "" || scale < 2){
      alert("Величина шкалы оценивания не может быть меньше 2")
    }
    // Отправка данных на сервер
    $.ajax({
      type: "POST",
      url: "/createProblem",
      data: {name: name, alternative: alternative, experts: spec, scale: scale},
      success: (res) => {
        alert(res)
        if(res == "Данные успешно занесены на сервер")
          window.location.href = "/problems"
      }
    })

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
