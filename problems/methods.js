const firstMethod = (firstMethodProblems, problem) => {
  let 
    resultsMethod1 = [],
    rowLength = problem.alternative.length

  firstMethodProblems.forEach((expert, i) => {
    let 
      k = 0, 
      resultMatrix = [],
      questions = expert.tests.questions

    problem.alternative.forEach(element => {
      resultMatrix.push([])
    })
    
    for (let i = 0; i < rowLength; i++) {
      for (let j = i; j < rowLength; j++) {
        if(i != j){
          let answer
          if(questions[k].answer == "1/2")
            answer = 0.5
          else
            answer = +questions[k].answer
          resultMatrix[i][j] = +answer
          resultMatrix[j][i] = 1 - +answer
          k++ 
        }
        else{
          resultMatrix[i][j] = 0
        }
      }
    }

    let sumByMatrix = resultMatrix.reduce((sumByRow, row) => {
      return sumByRow + row.reduce((sumByCol, col) => {
        return sumByCol + col
      }, 0)
    }, 0)

    // Создание вектора результатов
    let sumByRow = []
    for (let i = 0; i < rowLength; i++) {
      sumByRow.push(0)
      for (let j = 0; j < rowLength; j++) {
        sumByRow[i] += resultMatrix[i][j]
      }
    }
    
    let normSumByRow = sumByRow.map((elem, id) => {
      return {id:id, val: +(elem / sumByMatrix * 100).toFixed(3)}
    })
    // По убыванию
    normSumByRow = normSumByRow.sort((a, b) => {
      return b.val - a.val
    })
    resultsMethod1.push(normSumByRow)
  })

  let sumByAlt = []
  for (let i = 0; i < rowLength; i++) {
    sumByAlt.push(0)
  }
  resultsMethod1.forEach(expRes => {
    expRes.forEach(elem => {
      sumByAlt[+elem.id] += elem.val
    })
  })
  sumByAlt = sumByAlt.map((elem, id) => {
    return {id: id, val: elem}
  })
  let normSumByAlt = sumByAlt.map((elem, id) => {
    return {id: elem.id, val: elem.val / problem.experts.length}
  })
  normSumByAlt = normSumByAlt.sort((a, b) => {
    return (b.val - a.val).toFixed(3)
  })
  let methodSum = normSumByAlt.reduce((sum, elem) => {
    return sum + elem.val
  }, 0)
  // return methodSum
  return normSumByAlt
}

const secondMethod = (secondMethodProblems) => {
  let 
    R               = 0,
    S               = [],
    V               = [],
    matrixOfResults = []
  // R и составление матрицы P
  secondMethodProblems.forEach((expert, i) => {
    matrixOfResults.push([])
    expert.tests.questions.forEach((question) => {
      matrixOfResults[i].push(question.answer)
    })
    R += +expert.competence
  })
  // S
  secondMethodProblems.forEach((expert, index) => {
     S.push(expert.competence / R)
  })
  // V
  for (let i = 0; i < secondMethodProblems[0].tests.questions.length; i++) {
    V.push({id:i, val: 0})
    for (let j = 0; j < secondMethodProblems.length; j++) {
      V[i].val += matrixOfResults[j][i]*S[j]
    }
  }
  // Упорядочивание
  V = V.sort((a, b) => {
    return b.val - a.val
  })
  V = V.map(elem => {
    elem.val = elem.val.toFixed(3)
    return elem 
  })
  return V
}

const thirdMethod = (thirdMethodProblems) => {
  let matrixOfResults = []
  let n = thirdMethodProblems[0].tests.questions.length 
  thirdMethodProblems.forEach((expert, i) => {
    matrixOfResults.push([])
    expert.tests.questions.forEach((question) => {
      matrixOfResults[i].push(n - question.answer)
    })
  })

  let L = []
  for (let i = 0; i < n; i++)
    L.push(0)
    
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < matrixOfResults.length; j++) {
      L[i] += matrixOfResults[j][i]
    }
  }

  let sumL = L.reduce((sum, elem) => {
    return sum + +elem
  }, 0)

  let V = L.map((Li, i) => {
    return {id: i, val: Li / sumL}
  })

  V = V.sort((a, b) => {
    return (b.val - a.val).toFixed(3)
  })
  return V
}

const fourthMethod = (fourthMethodProblems) => {
  let matrixOfResults = []
  let n = fourthMethodProblems[0].tests.questions.length 
  fourthMethodProblems.forEach((expert, i) => {
    matrixOfResults.push([])
    expert.tests.questions.forEach((question) => {
      matrixOfResults[i].push(+question.answer)
    })
  })

  let S = []
  for (let i = 0; i < matrixOfResults.length; i++)
    S.push(0)
    
  for (let i = 0; i < matrixOfResults.length; i++) {
    for (let j = 0; j < n; j++) {
      S[i] += +matrixOfResults[i][j]
    }
  }

  let newMatrixR = []
  for (let i = 0; i < matrixOfResults.length; i++) {
    newMatrixR.push([])
    for (let j = 0; j < n; j++) {
      newMatrixR[i].push(+matrixOfResults[i][j] / S[i])
    }
  }

  let V = []
  for (let i = 0; i < n; i++)
    V.push(0)

  for (let i = 0; i < newMatrixR.length; i++) {
    for (let j = 0; j < newMatrixR[i].length; j++) {
      V[j] += newMatrixR[i][j] / newMatrixR.length
    }
  }

  V = V.map((val, id) => {
    return {id: id, val: val.toFixed(3)}
  })

  V = V.sort((a, b) => {
    return b.val - a.val
  })
  return V
}

const fifthMethod = (fifthMethodProblems, problem) => {
  let 
    resultsMethod5 = [],
    rowLength      = problem.alternative.length,
    scale          = problem.scale

  fifthMethodProblems.forEach(expert => {
    let 
      k = 0, 
      resultMatrix = [],
      questions = expert.tests.questions

    problem.alternative.forEach((element) => {
      resultMatrix.push([])
    })
    
    
    for (let i = 0; i < rowLength; i++) {
      for (let j = i; j < rowLength; j++) {
        if(i != j){
          let answer = questions[k].answer / scale
          resultMatrix[i][j] = answer
          resultMatrix[j][i] = 1 - answer
          k++ 
        }
        else{
          resultMatrix[i][j] = ""
        }
      }
    }
    let sumByMatrix = [] // Fki
    resultMatrix.forEach((row) => {
      let sumByRow = row.reduce((sumByCol, col) => {
        return sumByCol + +col
      }, 0)
      sumByMatrix.push(sumByRow)
    })
    resultsMethod5.push(sumByMatrix)
  })
  
  let N = problem.alternative.length * (problem.alternative.length - 1)
  
  let updatedResultsMethod5 = resultsMethod5.map(row => {
    return row.map(elem => {
      return +(elem / N)
    })
  })
  

  let V = []
  for (let i = 0; i < rowLength; i++)
    V.push(0)
    
  for (let i = 0; i < problem.alternative.length; i++) {
    for (let j = 0; j < problem.experts.length; j++) {
      V[i] += updatedResultsMethod5[j][i]
    }
  }

  let sumByMatrix = resultsMethod5.reduce((sum, row) => {
    return sum + row.reduce((rowSum, elem) => {
      return rowSum + elem
    }, 0)
  }, 0)
  console.log(resultsMethod5)
  console.log(sumByMatrix)
  V = V.map((elem, id) => {
    return {id: id, val: +((elem * 100) / (sumByMatrix/N)).toFixed(3)}
  })
  console.log(V)
  V = V.sort((a, b) => {
    return b.val - a.val
  })
  return V
}