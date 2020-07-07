$.ajax({
  type: "GET",
  url: "/getExperts",
  success: (data) => {
    $(".MainWindow").html("")
    let experts = data
    if(experts.length == 0){
      $(".MainWindow").append("<div>Нет экспертов</div>")
      return
    }
    experts.forEach(expert => {
      let newBtn = document.createElement("button")
      newBtn.innerText = `${expert.surname} ${expert.name} ${expert.patronymic}`
      newBtn.className = "SpecialistChoice btn btn-info btn-lg btn-block mb-2"
      newBtn.setAttribute("data-name",       expert.name)
      newBtn.setAttribute("data-surname",    expert.surname)
      newBtn.setAttribute("data-patronymic", expert.patronymic)
      newBtn.setAttribute("data-job",        expert.job)
      newBtn.setAttribute("data-tests",      JSON.stringify(expert.tests))
      $(".MainWindow").append(newBtn)
    })
  }
})

$(function (){
  let event
  $("#analyst").click(() => {
    $("#FormBack").show()
    $("#SpecialistForm").show()
  })
  $("#ClosePopup").click(() => {
    $("#FormBack").hide()
    $("#SpecialistForm").hide()
  })
  
  $("#submit").click(()=>{
    let e = event
    let 
      login    = $("#login").val(),
      password = $("#password").val(),
      [name, surname, patronymic, job, tests] = [$(e.target).attr("data-name"), $(e.target).attr("data-surname"), $(e.target).attr("data-patronymic"), $(e.target).attr("data-job"), JSON.parse($(e.target).attr("data-tests"))];

    $.ajax({
      type: "POST",
      url: "/auth",
      data: {name: name, surname:surname, patronymic:patronymic, login: login, password: password},
      success: (res) => {
        if(res == "success"){
          sessionStorage.setItem('expert', JSON.stringify({name:name, surname:surname, patronymic:patronymic, job:job, tests: tests}))
          window.location.href = '/problemChoice'
        }
        else{
          $("#password").val("")
          alert("Не верно введённые данные")
        }
      }
    })
  })

  $(document).on("click", ".SpecialistChoice", (e) => {
    $("#login").val("")
    $("#password").val("")
    $("#SpecialistForm").show()
    $("#FormBack").show()
    event = e
  })
})