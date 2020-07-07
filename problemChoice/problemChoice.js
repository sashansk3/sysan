let expert = JSON.parse( sessionStorage.getItem("expert") )

$.ajax({
  type: "POST",
  url: "/getProblems",
  data: {name: `${expert.surname} ${expert.name} ${expert.patronymic}`},
  success: (res) => {

    let expertProblem = res
    if(expertProblem.length === 0){
      $(".MainWindow").append(`Нет доступных проблем для данного эксперта`)
    }
    else{
      expertProblem.forEach((problem)=>{
        if (problem.status != "inArchive"){
          let problemStatus = []
          if(expert.tests){
            problemStatus = expert.tests.filter((test) => {
              return test.problemName == problem.name
            })
            .map((test) => {
              return test.finishTest
            })
          }
          if(problem.finished == "false"){
            $(".MainWindow").prepend(`<button class='problemMethods btn btn-danger btn-block mb-2' data-problem='${JSON.stringify(problem)}' class='problemMethods'>${problem.name}</button>`)
          }
          else if(problem.status == "ended" || problem.status == "true"){
            $(".MainWindow").append(`<button  class='problemMethods btn btn-success btn-block mb-2' data-problem='${JSON.stringify(problem)}' class='problemMethods'>${problem.name}</button>`)
          }
          else{
            $(".MainWindow").prepend(`<button class='problemMethods btn btn-warning btn-block mb-2' data-problem='${JSON.stringify(problem)}' class='problemMethods'>${problem.name}</button>`)
          }
        }
      })
    }
  }
})

$(function(){
  $(document).on("click", ".problemMethods", (e) => {
    let
      problem      = JSON.parse($(e.target).attr('data-problem')),
      expert       = JSON.parse(sessionStorage.getItem('expert')),
      problemTests = [];
    if(Array.isArray(expert.tests)){
      expert.tests.forEach(test => {
        if(test.problemName == problem.name){
          problemTests.push(test)
        }
      })
    }
    else
      problemTests = ""
    sessionStorage.setItem('updateExpert', JSON.stringify({name: expert.name, surname: expert.surname, patronymic: expert.patronymic, job: expert.job, tests: problemTests}))
    sessionStorage.setItem('problem', JSON.stringify(problem))
    window.location.href = "/methodChoice"
  })
})