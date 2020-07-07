$(function () {
  $(document).on("change keyup input click", "#name", () => {
    $("#name").val($("#name").val().replace(/([0-9])|([^A-Za-zА-Яа-я\u002D\u0027])|([\s])/g, ''));
    $("#name").val($("#name").val().replace(/\u002D+/g, '-'));
    $("#name").val($("#name").val().replace(/\u0027+/g, "'"));
  })
  $(document).on("change keyup input click", "#surname", () => {
    $("#surname").val($("#surname").val().replace(/([0-9])|([^A-Za-zА-Яа-я\u0020\u002D\u0027])|(^\u0020)/g, ''));
    $("#surname").val($("#surname").val().replace(/\u0020+/g, " "));
    $("#surname").val($("#surname").val().replace(/\u002D+/g, '-'));
    $("#surname").val($("#surname").val().replace(/\u0027+/g, "'"));
  })
  $(document).on("change keyup input click", "#patronymic", () => {
    $("#patronymic").val($("#patronymic").val().replace(/([0-9])|([^A-Za-zА-Яа-я\u002D\u0027])/g, ''));
    $("#patronymic").val($("#patronymic").val().replace(/\u002D+/g, '-'));
    $("#patronymic").val($("#patronymic").val().replace(/\u0027+/g, "'"));
  })
  $(document).on("change keyup input click", "#job", () => {
    $("#job").val($("#job").val().replace(/([^0-9A-Za-zА-Яа-я\u0020\u002D\u0027\u0028\u0029])/g, ''));
    $("#job").val($("#job").val().replace(/\u0020+/g, " "));
    $("#job").val($("#job").val().replace(/\u002D+/g, '-'));
    $("#job").val($("#job").val().replace(/\u0027+/g, "'"));
  })

  $(document).on("change keyup input click", ".competence, #scale", (e) => {
    let
      min = $(e.target)[0].min,
      max = $(e.target)[0].max,
      prevVal = $(e.target).attr("prevVal");
    
    if(e.target.value.length > 3){
      $(e.target).val($(e.target).attr("prevVal"))
    }
    $(e.target).val($(e.target).val().replace(/([^0-9.])/g, ""))

    if(+$(e.target).val() > max){
      $(e.target).val(max)
    }
    $(e.target).attr("prevVal", $(e.target).val())
  })
})