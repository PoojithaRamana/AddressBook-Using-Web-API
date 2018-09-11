$(document).ready(function () {

    function Contact(args) {
        this.id = args ? args.id : null;
        this.name = args ? args.name : null;
        this.email = args ? args.email : null;
        this.MobileNumber = args ? args.MobileNumber : null;
        this.landNumber = args ? args.landNumber : null;
        this.website = args ? args.website : null;
        this.address = args ? args.address : null;
    }

    var validContact = function (newContact) {
        $(".editor").hide();
        var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newContact.email);
        var mobilePattern = /^\(?([6-9]{1})\)?[-.]?([0-9]{9})$/.test(newContact.MobileNumber);
        var websitePattern = /^\[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(newContact.website);
        var valid;
        if (newContact.name.length == 0) {
            $(".name").text("Name is required");
            valid = false;
        }
        else {
            $(".name").text("*");
        }

        if (newContact.email.length == 0) {
            $(".email").text("Email is required");
            valid = false;
        }
        else if (!emailPattern) {
            $(".email").text("Email is wrong.");
            valid = false;
        }
        else {
            $(".name").text("*");
        }

        if (newContact.MobileNumber.length == 0) {
            $(".number").text("Mobile number is required");
            valid = false;
        }
        else if (!mobilePattern) {
            $(".number").text("Enter a valid phone number");
            valid = false;
        }
        else {
            $(".name").text("*");
        }

        if (newContact.website.length == 0) {
            $(".web").text("Website is required");
            valid = false;
        }
        else if (!websitePattern) {
            $(".web").text("Enter a valid website");
            valid = false;
        }
        else {
            $(".name").text("*");
        }

        if (!valid) {
            return true;
        }
        else {
            return false;
        }
    }

     
    $('#home').on("click", function () {
        $('#home').addClass("active");
    });

    $('#addContact').on("click", function () {
        $('#addContact').addClass("active");
        window.location.hash = 'Adding-New-Contact';
        $(".right-body").show();
        $(".edit-button").hide();
        $("#" + selectedId).css({
            "background-color": "#fff"
        });
        $(".view-details-of-contact").hide();

    });
    var selectedId;
    var selectedContact = new Contact();
    $(".add").click(function ()
    {
        var contact = new Contact({ name: $("#name-value").val(), email: $("#email-value").val(), MobileNumber: $("#number-value").val(), landNumber: $("#land-num").val(), website: $("#web").val(), address: $("#addrr").val() });
        if (validContact(contact)) {
            $.ajax({
                type: "POST",
                url: "/api/AddressBook",
                data: JSON.stringify(contact),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $(".contacts").append("<div id=" + contact.id + "><h1>" + contact.name + "</h1><p>" + contact.email + "</p><p>" + contact.MobileNumber + "</p></div>");
                    $("#" + contact.id).addClass("border-styles");
                    $("#name-value").val('');
                    $("#email-value").val('');
                    $("#number-value").val('');
                    $("#land-num").val('');
                    $("#web").val('');
                    $("#addrr").val('');
                },
                failure: function (response) {
                    alert(response.responseText);
                },
            });
        }
        else {
            $("#require-field").text("Please enter all the required fields");
        }
    });  

    $('#contacts').on("click", ".border-styles", function () {    // to display the details of contact
        $("#" + selectedId).css({
            "background-color": "#fff"
        });
        var id = $(this).attr('id');      
        selectedId = id;
        $("#" + id).css({
            "background-color": "#cee7f2"
        });
        $(".right-body").hide();
        $.ajax({
            type: "GET",  
            url: `/api/AddressBook/${id}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $(".view-details-of-contact").show();      
                selectedContact = data;
                window.location.hash = selectedContact.Id;
                $("#dis-name").text(selectedContact.Name);
                $("#dis-email").text("Email: " + selectedContact.Email);
                $("#dis-num").text("Mobile Number :" + selectedContact.MobileNumber);
                $("#dis-number").text("Land-Line Number :" + selectedContact.LandLineNumber);
                $("#dis-website").text("WebSite :" + selectedContact.Website);
                $("#dis-address").text("Address :"+selectedContact.Address);
            },
            failure: function (response) {             
                alert(response.responseText);
            },
        });
    });

    $(".edit-icon").on('click', function () {
        $(".right-body").show();
        $(".edit-button").show();
        $(".view-details-of-contact").hide();
        $(".add").hide();
        $("#name-value").val(selectedContact.Name);
        $("#email-value").val(selectedContact.Email);
        $("#number-value").val(selectedContact.MobileNumber);
        $("#land-num").val(selectedContact.LandLineNumber);
        $("#web").val(selectedContact.Website);
        $("#addrr").val(selectedContact.Address);
    });

    $(".edit-button").click(function () {
        var contact = new Contact({ name: $("#name-value").val(), email: $("#email-value").val(), MobileNumber: $("#number-value").val(), landNumber: $("#land-num").val(), website: $("#web").val(), address: $("#addrr").val() });
        contact.id = selectedId;
        if (validContact(contact)) {
            $.ajax({
                type: "Put",
                url: "/api/AddressBook",
                data: JSON.stringify(contact),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $("#" + selectedId).html("<div id=" + selectedId + "><h1>" + contact.name + "</h1><p>" + contact.email + "</p><p>" + contact.MobileNumber + "</p></div>");
                    $("#contact-form")[0].reset();
                    $(".right-body").hide();
                    $("#" + selectedId).css({
                        "background-color": "#fff"
                    });
                },
                failure: function (response) {
                    alert(response.responseText);
                },
            });
        }
    });

    $(".delete-icon").click(function ()
    {
        $.ajax({   
            type: "Delete",
            url: `/api/AddressBook/${selectedId}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                init();
            },
            failure: function (response) {
                alert(response.responseText);
            },
        });
    });

    init();
    function init() {
        $(".view-details-of-contact").hide();
        $(".right-body").hide();
        $.ajax({
            type: "GET",
            url: "/api/AddressBook",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $(".contacts").html('');
                data.forEach(function(contact)
                {
                    $(".contacts").append("<div id=" + contact.Id + "><h1>" + contact.Name + "</h1><p>" + contact.Email + "</p><p>" + contact.MobileNumber + "</p></div>");
                    $("#" + contact.Id).addClass("border-styles");
                });                
            },
            failure: function (response) {
                alert(response.responseText);
            },
        });
    };
});