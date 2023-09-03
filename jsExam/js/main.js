/// <reference types = "../@types/jquery"/>

//Loading The webSite. 
$(function() {
    DataWithoutName().then(()=>{
        $('.loadingScreen').fadeOut(1500)
        $('body').css('cssText',`
            overflow: visible;
        `)
    })
    openSideMenu()
    closeSideMenu()
});

//Open And Close the SideMenu.
function openSideMenu(){
    $('#barIcon').on('click',()=>{
        $('.linksContent ul').fadeIn(500)
        $('#links').animate({width : '250px'} ,()=>{
            $('#barIcon').addClass("d-none")
            $('#closeIcon').removeClass('d-none')
        })
    })
}

function closeSideMenu(){
    $('#closeIcon').on('click',()=>{
        $('.linksContent ul').fadeOut(500)
        autoCloseSideMenu()
    })
}

// Auto Close Function. 
function autoCloseSideMenu() { 
    $('#links').animate({width : '0px'} ,()=>{
        $('#closeIcon').addClass('d-none')
        $('#barIcon').removeClass('d-none')
    })
}

//Get the meals without specific name.
async function DataWithoutName(){
    var data = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    var response = await data.json()
    let dataArray = response.meals
    displayMeals(dataArray)
    console.log(dataArray)
    
}

//display meals.
function displayMeals(array){ 
    var contanier = ``
    for(let i = 0; i < array.length; i++){
        contanier += 
        `
        <div class="col-md-3 my-3" onclick = "getMealDetails('${array[i].idMeal}')">
            <div class="card position-relative overflow-hidden border-0">
                <img src="${array[i].strMealThumb}" class="w-100 rounded-3" alt="">
                <div class="info">
                    ${array[i].strMeal}
                </div>
            </div>
        </div> 
        `
    }
    document.getElementById('displayedMeals').innerHTML = contanier
}

//Get the meal details from its ID.
async function getMealDetails(mealId) { 
    if(mealId != undefined){
        var data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        var response = await data.json()
        let mealData = response.meals[0]
        displayMealDetails(mealData)
    }
}

//display the meal details.
function displayMealDetails (mealData){
    autoCloseSideMenu()
    $('.loadingScreen').fadeIn(500,()=>{
        closeOtherSections('meal')
        let container = 
        `
            <div class="mealCard col-md-4 mx-4">
                <img src="${mealData.strMealThumb}" class="w-100 rounded-2" alt="">
                <h3>${mealData.strMeal}</h3>
            </div>
            <div class="mealInst col-md-8">
                <h3>Instructions</h3>
                <p id="instructionBox">${mealData.strInstructions}</p>
                <h3  id="area">Area : <span>${mealData.strArea}</span></h3>
                <h3  id="cat">Category : <span>${mealData.strCategory}</span></h3>
                <div class="recipes">
                    <h3>Recipes :</h3>
                    <ul id="ingredients" class="list-unstyled d-flex ">

                    </ul>
                </div>
                <div class="tags">
                    <h3>Tags : </h3>
                    <ul id="tags" class="list-unstyled d-flex">
                    </ul>
                </div>
                <div class="btns">
                    <button class="btn btn-success"><a href="${mealData.strSource}" target = "_blank" class="text-white text-decoration-none">Source</a></button>
                    <button class="btn btn-danger"><a href="${mealData.strYoutube}" target = "_blank" class="text-white text-decoration-none">Youtube</a></button>
                </div>
            </div>
        `
        document.getElementById('meal').innerHTML = container
        getIngredients(mealData)
        getTags(mealData)
        $('.loadingScreen').fadeOut(500)
    })
}

function getIngredients (mealData) { 
    let mealIngredients = ``
    for(let i = 1; i <= 20 ; i++){
        if(mealData[`strIngredient${i}`] != ""){
            mealIngredients+= 
            `
                <li class="alert alert-info p-2 m-3">
                    <span>${mealData[`strMeasure${i}`]}</span>
                    <span>${mealData[`strIngredient${i}`]}</span>
                </li>
            `
        }
        
    }
    document.getElementById('ingredients').innerHTML = mealIngredients
}

function getTags(mealData){
    let mealTags 
    let tagsContainer = ``
    if(mealData.strTags != null ){
        mealTags = mealData.strTags.split(',')
        for(let i = 0; i < mealTags.length; i++){
            tagsContainer+= 
            `
                <li class="alert alert-danger p-2 m-3">${mealTags[i]}</li>
            `
        }
    }
    document.getElementById('tags').innerHTML = tagsContainer
}

//Search Section.
$('#searchBtn').on('click',()=>{
    closeOtherSections('search')
    autoCloseSideMenu()
    $('#searchByName').val('')
    $('#searchByFl').val('')
})

$('#searchByName').on('keyup',()=>{
    autoCloseSideMenu()
    let mealName = $('#searchByName').val()
    searchByName(mealName)
})

async function searchByName(mealName){
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    let data = await respone.json()
    if(data.meals != null){
        displayMeals(data.meals)
        $('#displayedMeals').removeClass('d-none')
    }else {
        $('#displayedMeals').html('')
    }
}

$('#searchByFl').on('keyup',()=>{
    autoCloseSideMenu()
    let mealFl = $('#searchByFl').val()
    searchByFLetter(mealFl)
})

async function searchByFLetter(mealFl){
    mealFl == "" ? mealFl = "a" : "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealFl}`)
    let data = await respone.json()
    if(data.meals != null){
        displayMeals(data.meals)
        $('#displayedMeals').removeClass('d-none')
    }else {
        $('#displayedMeals').html('')
    }
}

// Categories Section.
$('#categoriesBtn').on('click',()=>{
    autoCloseSideMenu()
    $('.loadingScreen').fadeIn(500,()=>{
        closeOtherSections('catSection')
        displayCategories()
        $('.loadingScreen').fadeOut(500)
    })
})

async function displayCategories() { 
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    let data = await response.json()
    let categoriesArr = data.categories
    console.log(categoriesArr)
    let container = ``
    for(let i = 0; i < categoriesArr.length; i++){
        container+= 
            `
            <div class="col-md-3 my-3" >
                <div class="card position-relative overflow-hidden border-0" onclick = "openCategories('${categoriesArr[i].strCategory}')">
                    <img src="${categoriesArr[i].strCategoryThumb}" class="w-100 bg-black" alt="">
                    <div class="info text-center flex-column p-2">
                        <p class = "fs-2 my-0">${categoriesArr[i].strCategory}</p>
                        <p class = "fs-6">${categoriesArr[i].strCategoryDescription.split(" ",20).join(" ")}</p>
                    </div>
                </div>
            </div> 
            `
    }
    document.getElementById('catSection').innerHTML = container
}

async function openCategories(catName){
    let respone =  await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`)
    let data = await respone.json()
    display20Meals(data.meals)
}


//Area Section.
$('#areaBtn').on('click', ()=>{
    autoCloseSideMenu()
    $('.loadingScreen').fadeIn(500,()=>{
        closeOtherSections('areaSection')
        displayArea()
        $('.loadingScreen').fadeOut(500)
    })
})

async function displayArea(){
    autoCloseSideMenu()
    let respone = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    let data = await respone.json()
    let areas = data.meals
    
    let container = ``
    for(let i = 0; i < areas.length; i++){
        container+= 
            `
            <div class="col-md-3 my-3" >
                <div class="card bg-black text-white text-center position-relative overflow-hidden border-0" onclick = "getTheAreaMeals('${areas[i].strArea}')">
                    <div class="home-icon">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                    </div>
                    <p class="fs-4">${areas[i].strArea}</p>
                </div>
            </div> 
            `
    }
    document.getElementById('areaSection').innerHTML = container
}

async function getTheAreaMeals (area) { 
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let data = await response.json()
    let areaMeals = data.meals
    console.log(areaMeals)
    display20Meals(areaMeals)
}


//Ingredients Section.
$('#ingredientsBtn').on('click',()=>{
    autoCloseSideMenu()
    $('.loadingScreen').fadeIn(500,()=>{
        closeOtherSections('ingredSection')
        displayIngredients()
        $('.loadingScreen').fadeOut(500)
    })
})

async function displayIngredients() {
    let respone = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    let data = await respone.json()
    let ingredients = data.meals
    let container = ``
    for(let i = 0; i < 20; i++){
        container+= 
        `
        <div class="col-md-3 my-3" >
            <div class="card bg-black text-white text-center position-relative overflow-hidden border-0" onclick = "getTheMealsIngredient('${ingredients[i].strIngredient}')">
                <div class="home-icon">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                </div>
                <h3 class = "fs-4">${ingredients[i].strIngredient}</h3>
                <p class="fs-6">${ingredients[i].strDescription.split(' ',20).join(' ')}</p>
            </div>
        </div> 
        `
    }
    document.getElementById('ingredSection').innerHTML = container
}

async function getTheMealsIngredient (meal) { 
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${meal}`)
    let data = await response.json()
    let mealIngredients = data.meals
    console.log(mealIngredients)
    display20Meals(mealIngredients)
}


//Contact Section.
$('#contactBtn').on('click', ()=>{
    autoCloseSideMenu()
    closeOtherSections('contactForm')
})

$('.contactForm input').on('keyup',()=>{
    validation()
})

function validation(){
    if(validateName() 
    && validateEmail() 
    && validatePhone()
    && validateAge()
    && validatePassword()
    && validateRePassword()){
        $('#submit').removeAttr('disabled')
    }else{
        $('#submit').attr('disabled' , true)
    }
}

//Inputs Alerts
function nameAlert() { 
    if(!validateName()){
        document.getElementById('nameAlert').classList.remove('d-none')
    }else{
        document.getElementById('nameAlert').classList.add('d-none')
    } 
}

function emailAlert() { 
    if(!validateEmail()){
        document.getElementById('emailAlert').classList.remove('d-none')
    }else{
        document.getElementById('emailAlert').classList.add('d-none')
    } 
}

function ageAlert(){
    if(!validateAge()){
        document.getElementById('ageAlert').classList.remove('d-none')
    }else{
        document.getElementById('ageAlert').classList.add('d-none')
    } 
}

function phoneAlert() { 
    if(!validatePhone()){
        document.getElementById('phoneAlert').classList.remove('d-none')
    }else{
        document.getElementById('phoneAlert').classList.add('d-none')
    }  
}

function passwordAlert() { 
    if(!validatePassword()){
        document.getElementById('passwordAlert').classList.remove('d-none')
    }else{
        document.getElementById('passwordAlert').classList.add('d-none')
    } 
}

function repasswordAlert() { 
    if(!validateRePassword()){
        document.getElementById('repasswordAlert').classList.remove('d-none')
    }else{
        document.getElementById('repasswordAlert').classList.add('d-none')
    } 
}

// reg validation
function validateName() {
    var regex = /^[a-zA-Z ]+$/;
    var ctrl =  $('#userName').val();
    return regex.test(ctrl);
}
function validateEmail() {
    var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var ctrl =  $('#userEmail').val();
    return regex.test(ctrl);
}
function validatePhone() {
    var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    var ctrl =  $('#userPhone').val();
    return regex.test(ctrl);
}
function validateAge() {
    var regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
    var ctrl =  $('#userAge').val();
    return regex.test(ctrl);
}
function validatePassword() {
    var regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    var ctrl =  $('#userPassword').val();
    return regex.test(ctrl);
}
function validateRePassword() {
    return $('#userPassword').val() == $('#Repassword').val()
}

//disply 20 meals from the received response 
function display20Meals(array){ 
    $('.loadingScreen').fadeIn(500,()=>{
        closeOtherSections('twentyMeals')
        var contanier = ``
        var stop 
        array.length < 20 ? stop = array.length : stop = 20
        for(let i = 0; i < stop; i++){
            contanier += 
            `
            <div class="col-md-3 my-3" onclick = "getMealDetails('${array[i].idMeal}')">
                <div class="card position-relative overflow-hidden border-0">
                    <img src="${array[i].strMealThumb}" class="w-100 rounded-3" alt="">
                    <div class="info">
                        ${array[i].strMeal}
                    </div>
                </div>
            </div> 
            `
        }
        document.getElementById('twentyMeals').innerHTML = contanier
        $('.loadingScreen').fadeOut(500)
    })
}

//close other sections , not the section with the entered id
function closeOtherSections(id){
    let sectionsId = ['displayedMeals', 'search', 'catSection', 'areaSection', 'ingredSection', 'meal', 'contactForm' , 'twentyMeals']
    for(let i = 0; i < 8; i++){
        if(sectionsId[i] == id){
            document.getElementById(id).classList.remove('d-none')
        }else{
            document.getElementById(sectionsId[i]).classList.add('d-none')
        }
    }
}