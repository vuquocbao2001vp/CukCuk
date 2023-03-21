$(document).ready(function(){
    initEvent();
    loadData();
});

var MisaEnum = {
    EditMode : {
        Add: 1,
        Edit: 2,
        Delete: 3
    }
}
var editMode = MisaEnum.EditMode.Add;
// khai báo biến toàn cục lấy employee id
var employeeSelected = null;
/**
 * Thực hiện load dữ liệu
 */
function loadData() {
    $("#tbEmployeeList tbody").empty();
    // gọi API lấy dữ liệu
    try {
        $("#loadingProgress").show();
        $.ajax({
            type: "GET",
            url: "https://cukcuk.manhnv.net/api/v1/Employees",
            success: function (response) {
                $("#loadingProgress").hide();
                let employees = response;
                // xử lý dữ liệu
                // thực hiện hiển thị dữ liệu lên table
                for (const emp of employees) {
                    const employeeCode = emp.EmployeeCode;
                    let fullName = emp.FullName;
                    let gender = emp.Gender;
                    let dob = emp.DateOfBirth;
                    let phoneNumber = emp.PhoneNumber;
                    let email = emp.Email;
                    let positionName = emp.PositionName;
                    let deparmentName = emp.DeparmentName;
                    let salary = emp.Salary;
                    let workStatus = emp.WorkStatus;
                    // định dạng lại ngày tháng
                    dob = fomatDate(dob);
                    let tr = $(`<tr>
                            <td class="text-align-left">${employeeCode || ""}</td>
                            <td class="text-align-left">${fullName || ""}</td>
                            <td class="text-align-left">${gender || ""}</td>
                            <td class="text-align-center">${dob || ""}</td>
                            <td class="text-align-left">${phoneNumber || ""}</td>
                            <td class="text-align-left">${email || ""}</td>
                            <td class="text-align-left">${positionName || ""}</td>
                            <td class="text-align-left">${deparmentName || ""}</td>
                            <td class="text-align-right">${salary || ""}</td>
                            <td class="text-align-left">${workStatus || ""}</td>
                            </tr>`);
                    tr.data("key", emp.EmployeeId);
                    tr.data("object", emp);
                    $("#tbEmployeeList tbody").append(tr);
                }
            },
            error: function() {
                let employees = response;
            }
        });
    } catch (error) {
        
    }
    
}
// Định dạng lại ngày
function fomatDate(date){
    try {
        if (date) {
            date = new Date(date);
            let newDate = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return `${newDate}/${month}/${year}`;
        }
    } catch (error) {
        console.log(error);
        return "";
    }
}
// Định dạng lại tiền tệ
function fomatCurrency(currency) {
    try {
        
    } catch (error) {
        console.log(error);
        return "";
    }
}
/**
 * Tạo sự kiện cho các thành phần
 */
function initEvent(){
    // khi bấm vào nút thêm mới, hiển thị form thêm mới
    $("#btnAdd").click(function (e) {
        editMode = MisaEnum.EditMode.Add;
        // lấy mã nhân viên mới từ API
        // binding mã nhân viên vào ô mã nhân viên
        $.ajax({
            type: "GET",
            url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function (response) {
                $("#txtEmployeeCode").val(response);
                // hiển thị form thêm mới
                $("#popupForm").show();
                // focus vào ô nhập liệu đầu tiền
                $("#employeeId input").focus();
            },
            error: function (res){
                console.log(res);
            }
        });
    });
    // Khi bấm vào nút x ở form thì đóng form
    $("#btnFormClose").click(function (e) { 
        $("#popupForm").hide();
    });
    // khi double click vào 1 hàng thì hiện ra form sửa thông tin nhân viên đó
    $("#tbEmployeeList tbody").on("dblclick", "tr", function(){
        editMode = MisaEnum.EditMode.Edit;
        const employeeId = $(this).data("key");
        employeeSelected = employeeId;
        // gọi API lấy thông tin chi tiết nhân viên
        $.ajax({
            type: "GET",
            url: `https://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,
            success: function (empolyee) {
                // lấy thông tin và binding vào form
                $("#txtEmployeeCode").val(empolyee.EmployeeCode);
                $("#txtFullName").val(empolyee.FullName);
                $("#dtDateOfBirth").val(empolyee.DateOfBirth);
                $("#txtGender").val(empolyee.Gender);
                $("#txtIdentityCard").val(empolyee.IdentityNumber);
                $("#dtIdentityDate").val(empolyee.IdentityDate);
                $("#txtIdentityPlace").val(empolyee.IdentityPlace);
                $("#txtEmail").val(empolyee.Email);
                $("#txtPhoneNumber").val(empolyee.PhoneNumber);
                $("#txtPositionName").val(empolyee.PositionName);
                $("#txtDepartmentName").val(empolyee.DepartmentName);
                $("#txtPersonalTaxCode").val(empolyee.PersonalTaxCode);
                $("#txtSalary").val(empolyee.Salary);
                $("#dtJoinDate").val(empolyee.JoinDate);
                $("#txtWorkStatus").val(empolyee.WorkStatus);
            }
        });
        $("#popupForm").show();
    });
    // khi chọn 1 dòng thì button xóa hiện lên
    $("#tbEmployeeList tbody").on("click", "tr", function(){
        $(this).siblings(".m-row-selected").removeClass("m-row-selected");
        $(this).addClass("m-row-selected");
        let employeeIdDelete = $(this).data("key");
        $("#btnDelete").show();
        $("#btnDelete").click(function() { 
            try {
                $.ajax({
                    type: "DELETE",
                    url: `https://cukcuk.manhnv.net/api/v1/Employees/${employeeIdDelete}`,
                    success: function (response) {
                        $("#btnDelete").hide();
                        loadData();
                    },
                    error: function(res){
                        console.log(res);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        });
        
    });
    // khi bấm vào nút lưu thì thực hiện cất dữ liệu
    $("#btnSave").click(btnSaveOnClick);
    // khi bấm vào button refresh thì load lại trang
    $("#btnRefresh").click(function() { 
        loadData();
    });
    // khi rời các trường thông tin bắt buộc, nếu để trống viền sẽ chuyển màu đỏ
    $("[required]").blur(function() {
        let value =  $(this).val();
        if(!value){
            $(this).addClass("m-input-error");
            $(this).siblings(".m-info-error").show();
        } else{
            $(this).removeClass("m-input-error");
            $(this).siblings(".m-info-error").hide();
        }
    });
    // khi rời input email, nếu không đúng định dạng thì hiện lỗi
    $("#txtEmail").blur(function (e) { 
        let email = $("#txtEmail").val();
        if(email != "" && !IsEmail(email)){
            $("#emailValidateError").show();
        }
        else{
            $("#emailValidateError").hide();
        }
    });
    // khi ngày chọn lớn hơn ngày hiện tại thì báo lỗi
    $("[requireDate]").blur(function (e) { 
        let rqDate = $(this).val();
        rqDate = new Date(rqDate);
        if (rqDate > new Date()) {
            $(this).siblings(".m-info-error").show();
        } else {
            $(this).siblings(".m-info-error").hide();
        }
    });
}
/**
 * Thực hiện cất dữ liệu
 */
function btnSaveOnClick(){
    try {
        // validate dữ liệu
        let isValid = validateData();
        // nếu validate đúng thì thực hiện cất dữ liệu
        if(isValid) {
            let employee = {
                "EmployeeCode" : $("#txtEmployeeCode").val(),
                "FullName" : $("#txtFullName").val(),
                "DateOfBirth" : $("#dtDateOfBirth").val(),
                "Gender" : $("#txtGender").val(),
                "IdentityNumber" : $("#txtIdentityCard").val(),
                "IdentityDate" : $("#dtIdentityDate").val(),
                "IdentityPlace" : $("#txtIdentityPlace").val(),
                "Email" : $("#txtEmail").val(),
                "PhoneNumber" : $("#txtPhoneNumber").val(),
                "PositionName" : $("#txtPositionName").val(),
                "DepartmentName" : $("#txtDepartmentName").val(),
                "PersonalTaxCode" : $("#txtPersonalTaxCode").val(),
                "Salary" : $("#txtSalary").val(),
                "JoinDate" : $("#dtJoinDate").val(),
                "WorkStatus" : $("#txtWorkStatus").val()
            }
            if (editMode == MisaEnum.EditMode.Add) {
                $.ajax({
                    type: "POST",
                    url: "https://cukcuk.manhnv.net/api/v1/Employees",
                    data: JSON.stringify(employee),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (response) {
                        loadData();
                        $("#popupForm").hide();
                    },
                    error: function(res){
                        console.log(res);
                    }
                });
            } else {
                $.ajax({
                    type: "PUT",
                    url: `https://cukcuk.manhnv.net/api/v1/Employees/${employeeSelected}`,
                    data: JSON.stringify(employee),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (response) {
                        loadData();
                        $("#popupForm").hide();
                    },
                    error: function(res){
                        console.log(res);
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}
// hàm validate email
function IsEmail(email) {
    // ^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$
    var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if(!regex.test(email)) {
      return false;
    }else{
      return true;
    }
}
// hàm validate form thêm mới
function validateData() {
    let check = 0;
        // 1. các thông tin bắt buộc nhập
        // nếu mã nhân viên để trống thì cảnh báo
        let employeeCode = $("#txtEmployeeCode").val();
        if (!employeeCode) {
            $("#txtEmployeeCode").addClass("m-input-error");
            $("#employeeCodeError").show();
            $("#popupWarning").show();
            $("#employeeCodeError").show();
            // khi bấm vào nút x thì tắt popup cảnh báo
            $("#popupWarning .m-warning-title-icon").click(function(){
                $("#popupWarning").hide();
                $("#txtEmployeeCode").focus();
            });
            check = 1;
        }
        let fullName = $("#txtFullName").val();
        // nếu họ và tên để trống thì viền màu đỏ và hiện cảnh báo
        if (!fullName) {
            $("#txtFullName").addClass("m-input-error");
            $("#popupWarning").show();
            $("#fullNameError").show();
            // khi bấm vào nút x thì tắt popup cảnh báo
            $("#popupWarning .m-warning-title-icon").click(function(){
                $("#popupWarning").hide();
                $("#txtFullName").focus();
            });
            check = 1;
        }
        let identityCard = $("#txtIdentityCard").val();
        // nếu CMTND/CC để trống thì viền màu đỏ và hiện cảnh báo
        if (!identityCard) {
            $("#txtIdentityCard").addClass("m-input-error");
            $("#popupWarning").show();
            $("#identityCardError").show();
            // khi bấm vào nút x thì tắt popup cảnh báo
            $("#popupWarning .m-warning-title-icon").click(function(){
                $("#popupWarning").hide();
                $("#txtIdentityCard").focus();
            });
            check = 1;
        }
        let email = $("#txtEmail").val();
        // nếu email rỗng thì thêm viền đỏ và hiện cảnh báo
        if (!email) {
            $("#txtEmail").addClass("m-input-error");
            $("#popupWarning").show();
            $("#emailError").show();
            // khi bấm vào nút x thì tắt popup cảnh báo
            $("#popupWarning .m-warning-title-icon").click(function(){
                $("#popupWarning").hide();
                $("#txtEmail").focus();
            });
            check = 1;
        } else{
            // cảnh báo nếu email không đúng định dạng
            if(!IsEmail(email)){
                $("#emailValidateError").show();
                check = 1;
            }
        }
        let phoneNumber = $("#txtPhoneNumber").val();
        // nếu số điện thoại để trống thì viền màu đỏ và hiện cảnh báo
        if (!phoneNumber) {
            $("#txtPhoneNumber").addClass("m-input-error");
            $("#popupWarning").show();
            $("#phoneNumberError").show();
            // khi bấm vào nút x thì tắt popup cảnh báo
            $("#popupWarning .m-warning-title-icon").click(function(){
                $("#popupWarning").hide();
                $("#txtPhoneNumber").focus();
            });
            check = 1;
        }
        if (check == 1) {
            return false;
        } else {
            return true;
        }
        // 2. Mã nhân viên không được phép trùng
}
// Thực hiện xóa dữ liệu
