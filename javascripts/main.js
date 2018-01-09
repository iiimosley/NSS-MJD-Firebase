"use strict";

const fbURL = "https://tm-nss-jan8.firebaseio.com";

//firebase module//

////customer////
//customer Create
function addCustomer(newCustomer) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${fbURL}/customers.json`,
            method: "POST",
            data: JSON.stringify(newCustomer)
        }).done(customerId => {
            console.log(customerId);
            getActiveCustomers().then(memData => {
                listMems(memData);
            });
        });
    });
}

//customer Read
function getActiveCustomers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://tm-nss-jan8.firebaseio.com/customers.json?orderBy="active"&equalTo=true`
        }).done(activeCusts => {
            console.log("active customers", activeCusts);
            resolve(activeCusts);
        })
        .fail(error => {
            console.log("oh noooo!", error.statusText);
            reject(error);
        });
    });
}

//customer Update
function updateCustomer(memID, memLevel) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${fbURL}/customers/${memID}.json`,
            method: "PATCH",
            data: JSON.stringify({ member_level: memLevel })
        }).done(updateCust => {
            console.log("updated customer", updateCust);
        });
    });
}

//customer Delete
function deleteCustomer(memID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${fbURL}/customers/${memID}.json`,
            method: "DELETE"
        })
        .done(data => {
            resolve(data);
        })
        .fail(error => {
            console.log("daaang", error.statusText);
            reject(error);
        });
    });
}



////category////
//category Create
function addCat(catName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${fbURL}/categories.json`,
            method: "POST",
            data: JSON.stringify(catName)
        }).done(catId => {
            console.log(catId);
            getCats().then(catData => {
                listCats(catData);
            });
        });
    });
}

//category Read
function getCats() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://tm-nss-jan8.firebaseio.com/categories.json"
        })
            .done(cats => {
                resolve(cats);
            })
            .fail(error => {
                console.log("uh-oh", error.statusText);
                reject(error);
            });
    });
}

//category Update
function updateCat(id, description) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${fbURL}/categories/${id}.json`,
            method: "PATCH",
            data: JSON.stringify({ description })
        }).done(data => {
            console.log("updated obj", data);
        });
    });
}

//category Delete
function deleteCat(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://tm-nss-jan8.firebaseio.com/categories/${id}.json`,
            method: "DELETE"
        })
        .done(data => {
            resolve(data);
        })
        .fail(error => {
            console.log("uh-oh", error.statusText);
            reject(error);
        });
    });
}

// end - FB module //


/////function calls + DOM interactions
//customer call + DOM
function listMems(memData) {
    let memKey = Object.keys(memData);
    $("#editCust").html("");
    $("#deleteCust").html("");
    memKey.forEach(mem => {
        $("#editCust").append(`<option id="${mem}">${memData[mem].name}<option>`);
        $("#deleteCust").append(`<option id="${mem}">${memData[mem].name}<option>`);
    });
}

//$("#editCust").add("option").attr("id", mem).text(memData[mem].name);  
//$("#deleteCust").add("option").attr("id", mem).text(memData[mem].name);

getActiveCustomers().then(memData => {
    listMems(memData);
});

//category call + DOM
function listCats(catData) {
    console.log("categories", catData);
    let catsArr = [];
    let keys = Object.keys(catData);
    keys.forEach(key => {
        catData[key].id = key;
        catsArr.push(catData[key]);
    });
    $("#categories").html("");
    catsArr.forEach(cat => {
        $("#categories").append(
            `<h4>${cat.name}</h4>
            <input type="text" class="catForm" placeholder="description">
            <button id="${cat.id}" class="updateCat">updateCat</button>
            <button id="${
                cat.id
            }" class="deleteCat">delete</button>`
        );
    });
}

getCats().then(catData => {
    listCats(catData);
});


////////buttons////////

////customer buttons
//create Customer button
$("#addCustomer").click(function () {
    let custObj = {
        age: $("#custAge").val(),
        name: $("#custName").val(),
        member_level: $("#custLevel").val(),
        active: true
    };
    addCustomer(custObj);
});

//update Customer button
$("#editMember").click(()=>{
    let memID = $("#editCust").find('option:selected').attr("id");
    updateCustomer(memID, $("#memberLevel").val());
});

//delete Customer button 
$("#deleteMember").click(()=>{
    let memID = $("#deleteCust").find('option:selected').attr("id");
    deleteCustomer(memID)
    .then(() => {
        alert("Customer deleted");
        return getActiveCustomers();
    })
    .then(members => {
        listMems(members);
    })
    .catch(err => {
        console.log("oops", err);
    });
});


////category buttons
//create category button
$("#addCat").click(() => {
    let catObj = {
        name: $("#newCat").val()
    };
    addCat(catObj);
});

//update category button
$(document).on("click", ".updateCat", function () {
    console.log('updateCat clicked');
    let id = $(this).attr("id");
    updateCat(id, $(this).prev(".catForm").val());
});

//delete category button
$(document).on("click", ".deleteCat", function () {
    let catId = $(this).attr("id");
    console.log("catId", catId);
    deleteCat(catId)
        .then(() => {
            alert("Category deleted");
            return getCats();
        })
        .then(cats => {
            listCats(cats);
        })
        .catch(err => {
            console.log("oops", err);
        });
});