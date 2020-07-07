$(function(){
  $("#finishProblem").prop('disabled', true)
  let
    expert = JSON.parse( sessionStorage.getItem("updateExpert") ),
    problem = JSON.parse( sessionStorage.getItem("problem") );

  $(".Problems").css("background-color", "#dc3545")
  $(".Problems").css("color", "white")
  if(Array.isArray(expert.tests)){
    expert.tests.forEach(test => {
      console.log(test.finishTest)
      switch (test.method) {
        case "Метод парных сравнений":
          if(test.finishTest == "ended" || test.finishTest == "true"){
            $("#method1").css("background-color", "green")
          }
          else if(test.finishTest == "inProgress"){
            $("#method1").css("background-color", "yellow")
            $("#method1").css("color", "black")
          }
          break
        case "Метод взвешенных экспертных оценок":
          if(test.finishTest == "ended" || test.finishTest == "true"){
            $("#method2").css("background-color", "green")
          }
          else if(test.finishTest == "inProgress" ){
            $("#method2").css("background-color", "yellow")
            $("#method2").css("color", "black")
          }
          break

        case "Метод предпочтения":
          if(test.finishTest == "ended" || test.finishTest == "true"){
            $("#method3").css("background-color", "green")
          }
          else if(test.finishTest == "inProgress"){
            $("#method3").css("background-color", "yellow")
            $("#method3").css("color", "black")
          }
          break

        case "Метод ранга":
          if(test.finishTest == "ended" || test.finishTest == "true"){
            $("#method4").css("background-color", "green")
          }
          else if(test.finishTest == "inProgress"){
            $("#method4").css("background-color", "yellow")
            $("#method4").css("color", "black")
          }
          break

          case "Метод полного попарного сопоставления":
            if(test.finishTest == "ended" || test.finishTest == "true"){
            $("#method5").css("background-color", "green")
          }
          else if(test.finishTest == "inProgress"){
            $("#method5").css("background-color", "yellow")
            $("#method5").css("color", "black")
          }
          break
      }
    })
    let resultOfEnd = expert.tests.filter(method => {
      return (method.finishTest == "ended")
    })

    if(resultOfEnd.length == 5){
      $("#finishProblem").prop('disabled', false)
    }
  }

  $(".Problems").click((e)=>{
    let methodName = e.target.innerText
    sessionStorage.setItem("method", methodName)

    $.ajax({
      type: "POST",
      url: "/getExpert",
      data: {name: expert.name, surname: expert.surname, patronymic: expert.patronymic},
      success: (res) => {
        let
          expert     = res,
          methodTest = "";
        if(Array.isArray(expert.tests)){
          expert.tests.forEach((test)=>{
            if(test.problemName == problem.name && test.method == methodName){
              methodTest = test
            }
          })
        }

        let updatedExpert = {
          name: expert.name,
          surname: expert.surname,
          patronymic: expert.patronymic,
          job: expert.job,
          tests: methodTest,
        }
        sessionStorage.setItem('expertCurrentTest', JSON.stringify(updatedExpert))
        window.location.href = "/altsChoice"
      }
    })
  })
  $("#finishProblem").click(e => {
    let res = confirm("После завершения оценивания изменить оценки будет невозможно. Продолжить?")
    if(!res){
      return 0
    }
    $.ajaxSetup({
      async: false
    })
    let flag = true
    expert.tests.forEach((test) => {
      test.finishTest = "true"
      $.ajax({
        type: "POST",
        url: "/submitTest",
        data: {test: test, expert: expert, status: "true"},
        success: (data) => {
          if(!Array.isArray(data))
            flag = false
        }
      })
    })
    if(!flag)
      alert("Что-то пошло не так")
    else{
      alert("Данные успешно занесены на сервер")
      $.ajaxSetup({
        async: true
      })
      window.location.href = "/problemChoice"
    }
  })
})