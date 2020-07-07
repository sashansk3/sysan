$.ajax({
  type: "GET",
  url: "/solved",
  success: (data) => {
    let
      experts  = data.experts,
      problems = data.problems


    problems.forEach((problem, tableId) => {
      if(problem.status != "inArchive"){

        // Получение всех экспертов которые есть в проблеме
        let expertsInProblem = []
        experts.forEach(expert => {

          if(problem.experts != null){
            let expertInProblem = problem.experts.find((expInProblem) => {
                return expInProblem.name === `${expert.surname} ${expert.name} ${expert.patronymic}`
            })
            if(expertInProblem != undefined){
              expertsInProblem.push({expert: expert, competence: expertInProblem.competence})
            }
          }
        })
        // Выбор тех тестов у экспертов, которые соответствуют проблеме
        let updatedExpertsInProblem = []
        
        expertsInProblem.forEach(objExp => {
          let expert = objExp.expert
          if(expert.tests == false || expert.tests == ""){
            expert.tests = []
          }
          let currentProblem = expert.tests.filter(test => {
            if(test.problemName == problem.name)
              return test
          })

          // Добавить компетентность эксперта
          let updatedExpert = {
            name      : expert.name,
            surname   : expert.surname,
            patronymic: expert.patronymic,
            tests     : currentProblem,
            competence: objExp.competence,
          }
          updatedExpertsInProblem.push(updatedExpert)
        })

        let
          firstMethodProblems  = [],
          secondMethodProblems = [],
          thirdMethodProblems  = [],
          fourthMethodProblems = [],
          fifthMethodProblems  = [];

        updatedExpertsInProblem.forEach(expert => {
          expert.tests.forEach(test => {
            switch (test.method) {
              case "Метод парных сравнений":
                methodTest = JSON.parse(JSON.stringify(expert))
                methodTest.tests = test
                firstMethodProblems.push(methodTest)
                break;
              case "Метод взвешенных экспертных оценок":
                methodTest = JSON.parse(JSON.stringify(expert))
                methodTest.tests = test
                secondMethodProblems.push(methodTest)
                break;
              case "Метод предпочтения":
                methodTest = JSON.parse(JSON.stringify(expert))
                methodTest.tests = test
                thirdMethodProblems.push(methodTest)
                break;
              case "Метод ранга":
                methodTest = JSON.parse(JSON.stringify(expert))
                methodTest.tests = test
                fourthMethodProblems.push(methodTest)
                break;
              case "Метод полного попарного сопоставления":
                methodTest = JSON.parse(JSON.stringify(expert))
                methodTest.tests = test
                fifthMethodProblems.push(methodTest)
                break;
              default:
                alert("Что-то пошло не так")
                break;
            }
          })
        })

        let
          allMethods   = [firstMethodProblems, secondMethodProblems, thirdMethodProblems, fourthMethodProblems, fifthMethodProblems],
          methodsStatus = []

        allMethods.forEach((method, id) => {
          let countOfFinished = 0
          method.forEach((expert) => {
            if(expert.tests != ""){
              if(expert.tests.finishTest === "true"){
                countOfFinished++
              }
            }
          })
          methodsStatus.push(countOfFinished)
        })

        let
          textInProblem    = "в процессе",
          classOfProblem   = ".startedProblem",
          comleatedProblem = "false";

        if(problem.status == false){
          textInProblem    = "не начата"
          classOfProblem   = ".notStartedProblem"
          comleatedProblem = "notStarted"
        }
        else if(methodsStatus.every((elem) =>{ return elem === problem.experts.length })){
          textInProblem    = "завершена"
          classOfProblem   = ".finisedProblem"
          comleatedProblem = "problemCompleat"
        }
        
        $(`${classOfProblem}`).append(`
          <div class="card border mt-1 mx-2 mb-1 ${comleatedProblem == "notStarted" ? "border-danger" :""} ${comleatedProblem == "false" ? "border-warning" : "border-success"}" id="${tableId}">
            <div class="card-header ${comleatedProblem == "notStarted"? "bg-danger":"" } ${comleatedProblem == "false" ? "bg-warning" : "bg-success"}" " id="headingOne">
              <h5 class="mb-0">
                <button class="btn btn-link btn-block text-left ${comleatedProblem == "notStarted" ? "text-white" :""} ${comleatedProblem == "false"? "text-dark":"text-white"}" data-toggle="collapse" data-target="#id${tableId}" aria-expanded="true" aria-controls="collapseOne" data-toggle="tooltip" >
                  Проблема <b><i><span id="name${tableId}">${problem.name}</span></i></b> ${textInProblem} ${comleatedProblem == "notStarted"? "<span id=" + tableId + ' class="showEditForm">&#9999;</span>': ""}
                </button>
              </h5>
            </div>
            <div id="id${tableId}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
              <div class="card-body p-0">
                <table class="table table-bordered mb-0" >
                  <thead>
                    <tr><th scope="col">Альтернативы</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><div id="alts${tableId}"></div></td></tr>
                  </tbody>
                </table>
                <table class="table mb-0 table-bordered">
                  <tbody>
                    <tr>
                      <th scope="col" class="w-25">Величина шкалы оценивания</th>
                      <td scope="col"><div id="problem${tableId}scale"></div></td>
                    </tr>
                  </tbody>
                </table>
                <table class="table mb-2 table-bordered" >
                  <thead>
                    <tr>
                      <th scope="col">Эксперт</th>
                      <th scope="col">Компетентность</th>
                      <th scope="col">Выполненных методов</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><div id="experts${tableId}"></div></td>
                      <td><div id="experts${tableId}Competence"></div></td>
                      <td><div id="experts${tableId}Methods"></div></td>
                    </tr>
                  </tbody>
                </table>
              <div id="methods${tableId}"></div>
            </div>
          </div>
        `)

        problem.alternative.forEach((alt, id) => {
          $(`#alts${tableId}`).append(`${id + 1}) <span class="alts${tableId}">${alt}</span><br>`)
        })

        if(problem.experts != null){
          problem.experts.forEach((expert) => {
            let currentExpert = updatedExpertsInProblem.find(expertInProblem =>{
              let name = expertInProblem.surname + " " + expertInProblem.name + " " + expertInProblem.patronymic
              return name == expert.name
            })

            $(`#experts${tableId}`).append(`<div class="experts${tableId}">${expert.name}</div>`)
            $(`#experts${tableId}Competence`).append(`<div class="experts${tableId}Competence">${+expert.competence}</div>`)
            $(`#experts${tableId}Methods`).append(`<div class="experts${tableId}Methods">${currentExpert.tests.length} / 5</div>`)
          })
        }
        else{
          $(`#experts${tableId}`).append(`<div class="experts${tableId}">Нет назначенных на проблему экспертов</div>`)
        }

        $(`#problem${tableId}scale`).append(`${problem.scale}`)

        if(comleatedProblem === "problemCompleat"){
          $(`#methods${tableId}`).before(`<button class="showMethods btn btn-info btn-lg  btn-sm ml-2 mb-2 w-25" data-id="${tableId}" data-show="true">Показать результаты</button>`);
          $(`#methods${tableId}`).before(`<button class="addInArchive btn btn-info btn-lg  btn-sm ml-2 mb-2 w-25" data-id="${tableId}">Переместить в архив</button>`);
          $(`#methods${tableId}`).append(`
          <div class="row mx-1">
            <div class="col  m-1 p-0">
              <div class="card">
                <div class="card-header">Альтернативы</div>
                <div class="card-body">
                  <div id="aalts${tableId}"></div>
                </div>
              </div>
            </div>              
            <div class="col  m-1 p-0">
              <div class="card">
                <div class="card-header">Метод парных сравнений</div>
                <div class="card-body">
                  <div id="met1${tableId}">
                    <div id="method1${tableId}"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col  m-1 p-0">
              <div class="card">
                <div class="card-header">Метод взвешенных экспертных оценок</div>
                <div class="card-body">
                  <div id="met2${tableId}">
                    <div id="method2${tableId}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mx-1">
            <div class="col m-1 p-0">
              <div class="card">
                <div class="card-header">Метод предпочтения</div>
                <div class="card-body">
                  <div id="met3${tableId}">              
                    <div id="method3${tableId}"></div>                     
                  </div>
                </div>
              </div>
            </div>
            <div class="col m-1 p-0">
              <div class="card">
                <div class="card-header">Метод ранга</div>
                <div class="card-body">
                  <div id="met4${tableId}">
                    <div id="method4${tableId}"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col m-1 p-0">
              <div class="card">
                <div class="card-header">Метод полного попарного сопоставления</div>
                <div class="card-body">
                  <div id="met5${tableId}">
                    <div id="method5${tableId}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>`)
          
          problem.alternative.forEach((alt, id) => {
            $(`#aalts${tableId}`).append(`${id + 1}) <span class="aalts${tableId}">${alt}</span><br><br>`)
          })

          $(`#methods${tableId}`).hide()

          let resultFirstMethod  = firstMethod(firstMethodProblems, problem)

          resultFirstMethod.forEach((elem) => {
            $(`#method1${tableId}`).append(`
              ${elem.id + 1}) ${problem.alternative[elem.id]}
              <div class="progress mb-2">
                <div class="progress-bar bg-info" role="progressbar" style="width: ${elem.val}%;" aria-valuenow="${elem.val}" aria-valuemin="0" aria-valuemax="100">
                  ${elem.val}
                </div>
              </div>
            `)
          })
          let resultSecondMethod = secondMethod(secondMethodProblems)

          resultSecondMethod.forEach((elem) => {
            $(`#method2${tableId}`).append(`
              ${elem.id + 1}) ${problem.alternative[elem.id]}
              <div class="progress mb-2">
                <div class="progress-bar bg-info" role="progressbar" style="width: ${elem.val}%;" aria-valuenow="${elem.val}" aria-valuemin="0" aria-valuemax="100">
                  ${elem.val}
                </div>
              </div>
            `)
          })
          let resultThirdMethod = thirdMethod(thirdMethodProblems)

          resultThirdMethod.forEach((elem) => {
            $(`#method3${tableId}`).append(`
              ${elem.id + 1}) ${problem.alternative[elem.id]}
              <div class="progress mb-2">
                <div class="progress-bar bg-info" role="progressbar" style="width: ${+elem.val*100}%;" aria-valuenow="${+elem.val*100}" aria-valuemin="0" aria-valuemax="100">
                  ${+elem.val*100}
                </div>
              </div>
            `)
          })
          let resultFourthMethod = fourthMethod(fourthMethodProblems)

          resultFourthMethod.forEach((elem) => {
            $(`#method4${tableId}`).append(`
              ${elem.id + 1}) ${problem.alternative[elem.id]}
              <div class="progress mb-2">
                <div class="progress-bar bg-info" role="progressbar" style="width: ${+elem.val*100}%;" aria-valuenow="${+elem.val*100}" aria-valuemin="0" aria-valuemax="100">
                  ${+elem.val*100}
                </div>
              </div>
            `)
          })
          let resultFifthMethod = fifthMethod(fifthMethodProblems, problem)

          resultFifthMethod.forEach((elem) => {
            $(`#method5${tableId}`).append(`
              ${elem.id + 1}) ${problem.alternative[elem.id]}
              <div class="progress mb-2">
                <div class="progress-bar bg-info" role="progressbar" style="width: ${elem.val}%;" aria-valuenow="${elem.val}" aria-valuemin="0" aria-valuemax="100">
                  ${+elem.val}
                </div>
              </div>
            `)
          })

        }
      }
    })
  }
})
$(function () {
  $("#ClosePopup").click(() => {
    $("#CreateFormBack").hide()
    $(".Alternatives").remove()
    $(".Experts").remove()
    $("#CreateForm").hide()
  })
  $(document).on("click", ".showMethods", (e) => {
    let
      methodId = $(e.target).attr("data-id"),
      showFlag = $(e.target).attr("data-show");

    if(showFlag == "true"){
      $(`#methods${methodId}`).show("slow")
      $(e.target).attr("data-show", "false")
    }
    else{
      $(`#methods${methodId}`).hide()
      $(e.target).attr("data-show", "true")
    }
  })

  $(document).on("click", ".addInArchive", (e) => {
    let
      methodId = $(e.target).attr("data-id"),
      problemName = $(`#name${methodId}`).text()

    let res = confirm("Вы уверены что хотите переместить проблему в архив?")
    if(!res){
      return 0
    }
    $.ajax({
      type: "POST",
      url: "/sendToArchive",
      data: {name: problemName},
      success: (res) => {

        window.location.reload()
      }
    })
  })
})
