$("#cbbDepartment").click(function (e) { 
    $("#cbbDepartment").siblings(".m-combobox-data").show();
});
$(".m-combobox-item").click(function (e) {
    $(this).addClass("m-combobox-item--selected");
    $(this).children(".m-combobox-icon--selected").show();
});