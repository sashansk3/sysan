const 
  express     = require('express'),
  bodyParser  = require('body-parser'),
  cors        = require('cors'),
  app         = express(),
  path        = require('path'),
  MongoClient = require('mongodb').MongoClient,
  dbURL       = "mongodb+srv://sasha_nsk3:dbSkotnikovA@cluster0-8skjx.gcp.mongodb.net/test?retryWrites=true&w=majority",
  ObjectId    = require('mongodb').ObjectID,
  port        = 3000;

let client = new MongoClient(dbURL, { useUnifiedTopology: true })

client.connect((err) => {
  let db = client.db('sysan')

  app.get("/getExperts", async(req, res) => {
    let allExperts = await db.collection("experts").find().toArray()
    res.send(allExperts)
  })

  app.post("/getExpert", async(req, res) => {
    let 
      name       = req.body.name,
      surname    = req.body.surname,
      patronymic = req.body.patronymic;

    let experts = await db.collection("experts").find({
      name      : name,
      surname   : surname,
      patronymic: patronymic
    }).toArray()
    res.send(experts[0])
  })

  app.post("/getProblems", async(req, res) => {
    let name = req.body.name

    let allProblems = await db.collection("problems").find().toArray()
    let listOfProblems = []

    allProblems.forEach(problem => {
      if(problem.experts != null){
        problem.experts.forEach(expert => {
          if(expert.name == name){
            listOfProblems.push({
              name       : problem.name,
              alternative: problem.alternative,
              finished   : expert.status,
              status     : problem.status,
              scale      : problem.scale,
            })
          }
        })
      }
    })
    res.send(listOfProblems)
  })

  app.post("/createExpert", async(req, res) => {
    let 
      name       = req.body.name,
      surname    = req.body.surname,
      patronymic = req.body.patronymic,
      job        = req.body.job,
      login      = req.body.login,
      password   = req.body.password,
      experts    = await db.collection("experts").find({"name": name, "surname":surname, "patronymic": patronymic}).toArray();

    if(experts.length == []){
      try{
        db.collection("experts").insertOne({
          name      : name,
          surname   : surname,
          patronymic: patronymic,
          job       : job,
          tests     : false,
          login     : login,
          password  : password,
        }, 
        (err, answer) => {
          if(err) res.send(err)
          res.send("Пользователь успешно добавлен в базу")
        })
      }
      catch(err){
        res.send(err)
      }
    }
    else
      res.send("Пользователь с такими данными уже существует")
  })

  app.post("/createProblem", async(req, res) => {
    let 
      problemName = req.body.name,
      problem = await db.collection("problems").find({"name": problemName}).toArray();
    
    if(problem.length == 0){
      let 
        alternative = req.body.alternative,
        experts     = req.body.experts,
        scale       = req.body.scale;
      try{
        db.collection("problems").insertOne({
          name       : problemName,
          alternative: alternative,
          experts    : experts,
          status     : false,
          scale      : scale
        }, 
        (err, answer) => {
          if(err) res.send(err)
          res.send("Данные успешно занесены на сервер")
        })
      }
      catch(err){
        res.send(err)
      }
    }
    else{
      res.send("Проблема с таким именем уже существует")
    }
  })
  
  app.post("/updateExpert", async(req, res) => {
  let
    newName       = req.body.name,
    newSurname    = req.body.surname,
    newPatronymic = req.body.patronymic,
    newJob        = req.body.job,
    name          = req.body.prevName,
    surname       = req.body.prevSurname,
    patronymic    = req.body.prevPatronymic;

  let mainExpert = await db.collection("experts").find({"name": name, "surname": surname, "patronymic": patronymic}).toArray()
  mainExpert = mainExpert[0]
  if(mainExpert.length != 0){
    let newExpert = await db.collection("experts").find({"name": newName, "surname": newSurname, "patronymic": newPatronymic}).toArray()
    if(newExpert.length != 0){
      res.send("Пользователь с таким именем уже существует")
      return 0
    }

    let insertRes = await db.collection("experts").findOneAndUpdate({_id: ObjectId(mainExpert._id)}, {$set: {
      name      : newName,
      surname   : newSurname,
      patronymic: newPatronymic,
      job       : newJob
    }})


    if(!insertRes.ok){
      res.send("Во время обновления результатов, что-то пошло не так")
      return 0
    }

    let problems = await db.collection("problems").find({}).toArray()
    let problemsNeedUpdate = []
    problems.forEach(problem => {
      problem.experts.forEach(expert => {
        if(expert.name == `${surname} ${name} ${patronymic}`)
          expert.name = `${newName} ${newSurname} ${newPatronymic}`
          problemsNeedUpdate.push({_id: problem._id, experts: problem.experts})
      })
    })

    problemsNeedUpdate.forEach(async(problem) => {
      let insertRes = await db.collection("problems").findOneAndUpdate({_id: ObjectId(problem._id)}, {$set: {experts: problem.experts}})

      if(!insertRes.ok)
        res.send("Во время обновления результатов, что-то пошло не так")
    })

    res.send("Данные успешно обновлены")
  }
  else
    res.send(JSON.stringify("Такого эксперта больше нет в базе"))
  })

  app.post("/updateProblem", async(req, res) => {
    let 
      name        = req.body.name,
      alternative = req.body.alternative,
      expert      = req.body.expert,
      status      = req.body.action,
      prevName    = req.body.prevName,
      scale       = req.body.scale,
      problem     = await db.collection("problems").find({name: name}).toArray();



    if(problem.length == 0){

      status == "false"? status = false: status = status
      name == ""? name = prevName: name = name
      let insertRes = await db.collection("problems").findOneAndUpdate({name: prevName}, {$set: {
        name       : name,
        alternative: alternative,
        experts    : expert,
        scale      : scale,
        status     : status
      }}, {returnNewDocument:false})

      if(!insertRes.ok){
        res.send("Во время обновления результатов, что-то пошло не так")
        return 0
      }
      res.send("Данные успешно занесены на сервер")
    }
    else{
      res.send("Проблема с таким именем уже существует")
    }
  })

  app.post("/submitTest", async(req, res) => {
    let 
      currentTest   = req.body.test,
      currentExpert = req.body.expert,
      status        = req.body.status;

    let expert = await db.collection("experts")
    .find({
      name      : currentExpert.name,
      surname   : currentExpert.surname,
      patronymic: currentExpert.patronymic
    })
    .toArray()
    expert = expert[0]
    let expertTests = expert.tests
    if(expertTests != ""){
      let flag = true
      expertTests = expertTests.map(test => {
        if(test.problemName == currentTest.problemName && test.method == currentTest.method){
          flag = false
          return currentTest
        }
        else
          return test
      })
      if(flag){
        expertTests.push(currentTest)
      }
    }
    else{
      expertTests = [currentTest]
    }

    

    let insertRes = await db.collection("experts").findOneAndUpdate({_id: ObjectId(expert._id)}, {$set: {tests: expertTests}})
    if(!insertRes.ok){
      res.send("Во время обновления результатов, что-то пошло не так")
      return 0
    }

    let currentProblem = await db.collection("problems")
    .find({
      name: currentTest.problemName
    })
    .toArray()
    currentProblem = currentProblem[0]
    // console.warn(currentProblem)
    currentProblem.experts.map(expert => {
      if(expert.name == `${currentExpert.surname} ${currentExpert.name} ${currentExpert.patronymic}`){
        expert.status = status
        return expert
      }
      else
        return expert
    })
    insertRes = await db.collection("problems").findOneAndUpdate({_id: ObjectId(currentProblem._id)}, {$set: {experts: currentProblem.experts, status: status}})
    if(!insertRes.ok){
      res.send("Во время обновления результатов, что-то пошло не так")
      return 0
    }
    res.send(expertTests)
  })

  app.get("/solved", async(req, res) => {
    let 
      allExpert   = await db.collection("experts").find({}).toArray(),
      allProblems = await db.collection("problems").find({}).toArray();

      allExpert = allExpert.map(expert => {
        if(expert.tests == ""){
          expert.tests = false
        }
        return expert
      })
      res.send({problems: allProblems, experts: allExpert})
  })

  app.post("/sendToArchive", async(req, res) => {
    let name = req.body.name
    let status = db.collection("problems").findOneAndUpdate({name: name}, {$set:{
      status: "inArchive"
    }})
    if(status.ok){
      res.send("данные успешно обновлены")
    }
    else{
      res.send("Во время обновления данных возникла ошибка, попробуйте позже")
    }
  })
  
  app.post("/auth", async(req, res) => {
    let
      name       = req.body.name,
      surname    = req.body.surname,
      patronymic = req.body.patronymic,
      login      = req.body.login,
      password   = req.body.password;

    let expert = await db.collection("experts").find({"name": name, "surname": surname, "patronymic": patronymic}).toArray()
    expert = expert[0]
    if(expert.login == login && expert.password == password){
      res.send("success")
    }
    else{
      res.send("Не верно введённые данные")
    }
  })
  
  app.post("/begin", async(req, res) => {
    let name = req.body.name
    let result = await db.collection("problems").findOneAndUpdate({name: name}, {$set: {status: "notInArchive"}})
  })
})

app.use(bodyParser.urlencoded({ useUnifiedTopology: true  }))
app.use(cors())

app.use(express.static('altsChoice'))
app.use(express.static('create'))
app.use(express.static('expertChoice'))
app.use(express.static('experts'))
app.use(express.static('methodChoice'))
app.use(express.static('problemChoice'))
app.use(express.static('problems'))
app.use(express.static('solvedProblems'))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"))
})

app.get("/altsChoice", (req, res) => {
  res.sendFile(path.join(__dirname + "/altsChoice/altsChoice.html"))
})

app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname + "/create/create.html"))
})

app.get("/expertChoice", (req, res) => {
  res.sendFile(path.join(__dirname + "/expertChoice/expertChoice.html"))
})

app.get("/experts", (req, res) => {
  res.sendFile(path.join(__dirname + "/experts/experts.html"))
})

app.get("/methodChoice", (req, res) => {
  res.sendFile(path.join(__dirname + "/methodChoice/methodChoice.html"))
})

app.get("/problemChoice", (req, res) => {
  res.sendFile(path.join(__dirname + "/problemChoice/problemChoice.html"))
})

app.get("/problems", (req, res) => {
  res.sendFile(path.join(__dirname + "/problems/problems.html"))
})

app.get("/solvedProblems", (req, res) => {
  res.sendFile(path.join(__dirname + "/solvedProblems/solvedProblems.html"))
})

app.get("/analystChoise", (req, res) => {
  res.sendFile(path.join(__dirname + "/analystChoise.html"))
})

app.get("/index.css", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.css"))
})

app.get("/check.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/check.js"))
})

app.listen(port, () => {

})