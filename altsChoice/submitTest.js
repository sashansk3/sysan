$(function(){

  $(document).on("click", ".closeTest1", (e) => {
    let answer = confirm("Покинуть страницу оценивания?")
    if(!answer){
      return 0
    }
    else{
      window.location='/problemChoice'
    }
  })

  $(document).on("click", ".closeTest2", (e) => {
    let answer = confirm("Покинуть страницу оценивания?")
    if(!answer){
      return 0
    }
    else{
      window.location='/'
    }
  })

  $(document).on("click", ".endTest", (e) => {
    let
      test             = {problemName: $('#ProblemName').text()},
      results          = [],
      allTestCompleted = "ended",
      expert           = JSON.parse(sessionStorage.getItem('expertCurrentTest')),
      methodName       = sessionStorage.getItem('method'),
      action           = $(e.target).attr("data-action"),
      sum              = 0;

    for(let i = 1; i <= $(".Res").length; i++){
      let qAns
      if(methodName == "Метод парных сравнений"){
        qAns = $(`input[name="${i}"]:checked`).val()
      }
      else if(methodName == "Метод взвешенных экспертных оценок"){
        qAns = $(`input[name="${i}"]`).val()
        sum += +qAns
      }
      else if(methodName == "Метод полного попарного сопоставления"){
        qAns = $(`input[name="${i}"]:checked`).val()
        if(qAns === undefined || qAns === ""){
          qAns = $(`input[name="number${i}"]`).val()
        }
        
      }
      else{
        qAns = $(`input[name="${i}"]`).val()
      }
      if(qAns === undefined || qAns === ""){

        allTestCompleted = "inProgress"
        qAns             = "notComplete"
      }
      results.push({number:i, answer:qAns})
    }

    
    if(methodName == "Метод взвешенных экспертных оценок" && sum !== 100){
      allTestCompleted = "inProgress"
    }

    if(methodName == "Метод предпочтения"){
      for(let i = 1; i <= $(".Res").length; i++){

        if($(`input[name="${i}"]`).attr("action") === "false"){
          alert("Значения оценки не должны повторяться между собой")
          return 0
        }
      }
    }
  
    test.questions  = results
    test.finishTest = allTestCompleted
    test.method     = sessionStorage.getItem("method")

    $.ajax({
      type: "POST",
      url: "/submitTest",
      data: {test: test, expert: expert, status: "inProgress"},
      success: (data) => {
        let 
          expertTest   = data,
          problemTests = []
        if(Array.isArray(expertTest)){
          expertTest.forEach(item => {
            if(item.problemName === test.problemName){
              problemTests.push(item)
            }
          })
        }
        else{
          problemTests = ""
        }
        sessionStorage.setItem('updateExpert', JSON.stringify({name: expert.name, surname: expert.surname, patronymic: expert.patronymic, job: expert.job, tests: problemTests}))
        alert("Данные успешно занесены на сервер")
        window.location.href = "/methodChoice"
        if(action != "save"){
          for (let i = 0; i < $(".Res").length; i++) {
            $($(".slideResult")[i]).prop("disabled", true)
            $($(".numResult")[i]).prop("disabled", true)
          }
          $($(".endTest")[0]).prop("disabled", true)
          $($(".endTest")[1]).prop("disabled", true)
        }
      }
    })
  })
})