$(function(){
  let
    methodName    = sessionStorage.getItem('method'),
    problem       = JSON.parse( sessionStorage.getItem('problem') ),
    expert        = JSON.parse( sessionStorage.getItem('expertCurrentTest') ),
    k             = 1,
    ListOfAlt     = problem.alternative,
    listOfAnswers = expert.tests,
    finishedTest  = "",
    globalCount   = 100,
    currentProblem;

  switch (methodName) {
    case "Метод парных сравнений":
      $(".MainWindow").append(`<div id='ProblemName'><h3 class="text-info">${problem.name}</h3></div>`)
      if(listOfAnswers !== ""){
        currentProblem = listOfAnswers.questions
        finishedTest   = listOfAnswers.finishTest
      }
      for(let i = 0; i < ListOfAlt.length; i++){
        for(let j = i; j < ListOfAlt.length; j++){
          if(i != j){
            if(currentProblem)
              currentAnswer = currentProblem[k - 1].answer
            else
              currentAnswer = "none"

            $(".MainWindow").append(`<div class='alternativesMetod1  bg-light'>${k})<div class='alternativesItem1'>Альтернатива 1: <br><span style="font-weight: 500;">${ListOfAlt[i]}</span></div><div class='alternativesItem2'>Альтернатива 2: <br><span style="font-weight: 500;">${ListOfAlt[j]}</span></div></div>`)
            $(".MainWindow").append(`
              <div class="Res">
                <div>
                  <input ${currentAnswer == "1"?"checked='checked'":""} name='${k}' ${finishedTest === "true"? "disabled='disabled'":""} type='radio' value='1'>
                  <label>Более предпочтительна альтернатива 1</label>
                </div>
                <div>
                  <input ${currentAnswer == "1/2"?"checked='checked'":""} ${finishedTest === "true"? "disabled='disabled'":""} name='${k}' type='radio' value='1/2'>
                  <label>Равнозначны</label></div>
                <div>
                  <input ${currentAnswer == "0"?"checked='checked'":""} ${finishedTest === "true"? "disabled='disabled'":""} name='${k}' type='radio' value='0'>
                  <label>Боллее предпочтительна альтернатива 2</label>
                </div>
              </div>`)
            k++
          }
        }
      }
      $(".MainWindow").append(`<button class='endTest btn btn-info ml-2' ${finishedTest === "true"? "disabled":""}  data-action="save"   >Сохранить промежуточный результат</button>`)
      // $(".MainWindow").append(`<button class='endTest btn btn-info ml-2' ${finishedTest === "true"? "disabled":""}  data-action="endTest">Завершить оценивание</button>`)
      break

    case "Метод взвешенных экспертных оценок":
      if(listOfAnswers !== ""){
        currentProblem = listOfAnswers.questions
        finishedTest   = listOfAnswers.finishTest
      }
      $(".MainWindow").append(`<div id='ProblemName'><h3 class="text-info">${problem.name}</h3></div>`)
      $(".MainWindow").append(`Поставьте каждой альтернативе оценку от 0 до 100, перемещая слайдер или записывая число в поле рядом с ним. Сумма всех оценок альтернатив должна равняться 100.`)
      $(".MainWindow").append(`<div>Оставшиеся баллы оценки: <span class="unusedPoints">100</span></div>`)

      for(let i = 0; i < ListOfAlt.length; i++){
        if(currentProblem){
          currentAnswer = currentProblem[k - 1].answer
          globalCount -= currentAnswer
        }
        else
          currentAnswer = "0"

        $(".MainWindow").append(`<div class='alternativesMetod1  bg-light'>${k})<div class='alternativesItems'>Альтернатива: <br><span style="font-weight: 500;">${ListOfAlt[i]}</span></div></div>`)
        $(".MainWindow").append(`
          <div class="Res">
            <input class="slideResult" list="rangeAlt" type="range"  name='${k}'  data-id="${k}" min="0" max="100" step="1" prevVal="${currentAnswer}" value="0" ${finishedTest === "true"? "disabled":""}/>
            <datalist id="rangeAlt">
              <option value="0" label="0">
              <option value="10" label="10">
              <option value="20" label="20">
              <option value="30" label="30">
              <option value="40" label="40">
              <option value="50" label="50">
              <option value="60" label="60">
              <option value="70" label="70">
              <option value="80" label="80">
              <option value="90" label="90">
              <option value="100" label="100">
            </datalist>
            <input class="numResult border border-info rounded p-1"  style="width: 7%;" type="number" name='${k}1' data-id="${k}" min="0" max="${+globalCount}" step="1" prevVal="0" value="0" ${finishedTest === "true"? "disabled":""}/>
          <div />
        `)
        $(`[name="${k}"]`).val(+currentAnswer)
        $(`[name="${k}1"]`).val(+currentAnswer)
        k++
      }
      $(".unusedPoints").html(globalCount)
      $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="save"   >Сохранить промежуточный результат</button>`)
      // $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="endTest">Завершить оценивание</button>`)
      break

    case "Метод предпочтения":
      if(listOfAnswers !== ""){
        currentProblem = listOfAnswers.questions
        finishedTest   = listOfAnswers.finishTest
      }
      $(".MainWindow").append(`<div id='ProblemName'><h3 class="text-info">${problem.name}</h3></div>`)
      $(".MainWindow").append(`Дайте оценку каждой альтернативе, записав числа в соответствующем поле под альтернативой. Расставьте альтернативы в порядке убывания их важности, то есть 1 - наиболее важная, 2 - менее важная и т.д. Числа не должны повторяться.`)

      for(let i = 0; i < ListOfAlt.length; i++){
        if(currentProblem){
          currentAnswer = currentProblem[k - 1].answer
          if(currentAnswer === "notComplete")
            currentAnswer = "0"
        }
        else
          currentAnswer = "0"

        $(".MainWindow").append(`<div class='alternativesMetod1  bg-light'>${k})<div class='alternativesItems'>Альтернатива: <br><span style="font-weight: 500;">${ListOfAlt[i]}</span></div></div>`)
        $(".MainWindow").append(`
          <div class="Res">
            <input class="numResult method3 border border-info rounded p-1" style="margin-left: 15%;" id="${k}" type="text" name='${k}' min="" max="${ListOfAlt.length}" step="1" prevVal="" ${finishedTest === "true"? "disabled":""}/>
          <div />
        `)
        if(currentAnswer == "0"){
          $(`[name="${k}"]`).val("")
        }
        else{
          $(`[name="${k}"]`).val(+currentAnswer)
        }
        k++
      }
      $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="save">Сохранить промежуточный результат</button>`)
      // $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="endTest">Завершить оценивание</button>`)
      break

    case "Метод ранга":
      if(listOfAnswers !== ""){
        currentProblem = listOfAnswers.questions
        finishedTest   = listOfAnswers.finishTest
      }
      $(".MainWindow").append(`<div id='ProblemName'><h3 class="text-info">${problem.name}</h3></div>`)
      $(".MainWindow").append(`Дайте оценку каждой альтернативе, пользуясь числами от 0 до 10, записывая их в соответствующем поле под альтернативой. Чем больше число, тем более предпочтительна альтернатива (10 - самая предпочтительная, 9 - менее предпочтительная и т.д.).`)

      for(let i = 0; i < ListOfAlt.length; i++){
        if(currentProblem){
          currentAnswer = currentProblem[k - 1].answer
          if(currentAnswer === "notComplete")
            currentAnswer = "0"
        }
        else
          currentAnswer = "0"

        $(".MainWindow").append(`<div class='alternativesMetod1  bg-light'>${k})<div class='alternativesItems'>Альтернатива: <br><span style="font-weight: 500;">${ListOfAlt[i]}</span></div></div>`)
        $(".MainWindow").append(`
          <div class="Res">
            <input class="numResult method4 border border-info rounded p-1" style="margin-left: 15%;" id="${k}" type="text" name='${k}' min="" max="10" step="1" prevVal="" ${finishedTest === "true"? "disabled":""}/>
          <div />
        `)
        if((methodName == "Метод предпочтения" || methodName == "Метод ранга") && currentAnswer == "0"){
          $(`[name="${k}"]`).val("")
        }
        else{
          $(`[name="${k}"]`).val(+currentAnswer)
        }
        k++
      }
      $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="save">Сохранить промежуточный результат</button>`)
      // $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="endTest">Завершить оценивание</button>`)
      break

    case "Метод полного попарного сопоставления":
      $(".MainWindow").append(`<div id='ProblemName'><h3 class="text-info">${problem.name}</h3></div>`)
      $(".MainWindow").append(`Сравните пары альтернатив и выберите из двух наиболее предпочтительную. Если нельзя отдать предпочтение какой-то одной, то выбирайте средний вариант, указав в поле в скольких случаях более предпочтительна первая альтернатива по сравнению со второй.`)

      if(listOfAnswers !== ""){
        currentProblem = listOfAnswers.questions
        finishedTest   = listOfAnswers.finishTest
      }
      for(let i = 0; i < ListOfAlt.length; i++){
        for(let j = i; j < ListOfAlt.length; j++){
          if(i != j){
            let currentAnswer
            if(currentProblem){
              currentAnswer = currentProblem[k - 1].answer
              if(currentAnswer === "notComplete")
                currentAnswer = "none"
            }
            else
              currentAnswer = "none"

            $(".MainWindow").append(`<div class='alternativesMetod1  bg-light'>${k})<div class='alternativesItem1'>Альтернатива ${i + 1}: <br><span style="font-weight: 500;">${ListOfAlt[i]}</span></div><div class='alternativesItem2'>Альтернатива ${j + 1}: <br><span style="font-weight: 500;">${ListOfAlt[j]}</span></div></div>`)
            $(".MainWindow").append(`
              <div class="Res">
                <div>
                  <input ${currentAnswer == problem.scale?"checked='checked'":""} name='${k}' ${finishedTest === "true"? "disabled='disabled'":""} type='radio' value=${problem.scale}>
                  <label>Более предпочтительна альтернатива ${i + 1}</label>
                </div>
                <div>
                  <input ${(currentAnswer != problem.scale && currentAnswer != "0" && currentAnswer != "none")?"checked='checked'":""} ${finishedTest === "true"? "disabled='disabled'":""} name='${k}' type='radio' value=''>
                  <label>Альтернатива ${i + 1} предпочтительна в </label>
                  <input ${finishedTest === "true"? "disabled='disabled'":""} id="${k}" name='number${k}' class="scale method5 border border-info rounded p-1" type='text' min="" max="${problem.scale}" value=''>
                  <label> случаях из ${problem.scale}</label>
                </div>
                <div>
                  <input ${currentAnswer == "0"?"checked='checked'":""} ${finishedTest === "true"? "disabled='disabled'":""} name='${k}' type='radio' value='0'>
                  <label>Более предпочтительна альтернатива ${j + 1}</label>
                </div>
              </div>\
            `)
            if(currentAnswer !== problem.scale && currentAnswer !== "0" && currentAnswer !== "none")
              $(`input[name="number${k}"]`).val(currentAnswer)
              
            k++
          }
        }
      }
      $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="save"   >Сохранить промежуточный результат</button>`)
      // $(".MainWindow").append(`<button class='endTest btn btn-info ml-2 mt-2' ${finishedTest === "true"? "disabled":""}  data-action="endTest">Завершить оценивание</button>`)
      break
  }


  $(document).on("input", ".method3, .method4, .method5", (e) => {
    let
      max   = e.target.max,
      min   = e.target.min,
      value = $(e.target).val(),
      flags = [];

    value = value.replace(/\D/gm, "").replace(/^0{0,1}/,"")
    $(e.target).val(value)
    if(+$(e.target).val() > max)
      $(e.target).val(max)

    if(+$(e.target).val() < 0)
      $(e.target).val(min)
  
      if(e.target.classList.contains('method3')){
        arr = $("."+$(e.target).attr("class").split(" ")[1]).toArray()
        for(let i = 0; i <= arr.length-1; i++){
          let j = 1
          for(; j <= arr.length; j++){
            if($(arr[i]).val() === $(arr[j]).val() && $(arr[i]).attr("name") !== $(arr[j]).attr("name") && $(arr[i]).val() !== ""){
              flags[i] = true		
              flags[j] = true		
            }
          }
          if(flags[i] !== true){
            flags[i] = false
          }
        }
        
        flags.forEach((flag, i) => {
          i++
          if(flag){
            classes = $('#'+i).attr("class").replace("border-info", "border-danger")
            $('#'+i).css("background-color", "pink")
          }
          else{
            classes = $('#'+i).attr("class").replace("border-danger", "border-info")
            $('#'+i).css("background-color", "white")
          }
          $('#'+i).attr("action", !flag)
          $('#'+i).attr("class", classes)
        })
      }
    
    
    $(e.target).attr("prevVal", $(e.target).val())
  })

  // TODO: переделать
  $(document).on("input", ".slideResult, .numResult, .scale", (e) => {
    let
      id    = $(e.target).attr("data-id"),
      min = $(e.target)[0].min,
      max = $(e.target)[0].max,
      prevVal = $(`[name="${id}"]`).attr("prevVal");

    globalCount = globalCount + +prevVal

    if($(e.target).val() != "0")
      $(e.target).val($(e.target).val().replace(/^0{0,1}/,""))

    if($(e.target).val() == ""){
      $(e.target).val(min)
    }
    if(+$(e.target).val() > max)
      $(e.target).val(max)

    let result = 0
    $(".numResult").toArray().forEach(input => {
      if($(input).attr("data-id") != id){
        result += +$(input).val()
      }
      else{
        result += +e.target.value
      }
    })

    if(result > 100){
      $(`[name="${id}"]`).val(globalCount)
      $(`[name="${id}1"]`).val(globalCount)
      $(`[name="${id}"]`).attr("prevVal", globalCount)
      $(`[name="${id}1"]`).attr("prevVal", globalCount)
        globalCount = 0
      $('.unusedPoints').text(globalCount)
      alert("Сумма всех оценок по проблеме не должна превышать 100")
    }
    else{
      let value = $(e.target).val()
      $(`[name="${id}"]`).val(value)
      $(`[name="${id}1"]`).val(value)
      $(`[name="${id}"]`).attr("prevVal", value)
      $(`[name="${id}1"]`).attr("prevVal", value)
      globalCount = globalCount - +value
      $('.unusedPoints').text(globalCount)
    }
  })
})
