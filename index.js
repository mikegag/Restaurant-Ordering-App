import {menuArray} from "./data.js"
const menuSection = document.getElementById("menu")
const paySection = document.getElementById("payment")
let totalCost = "" // will hold the value of the final order cost
let itemsInOrderList = false  //used to check if items have been added to the order

//listens for "menu" button click on homepage
document.getElementById("menu-btn").addEventListener('click', function(e){
        clearMenu(e.target.id) 
})
    
//multiple eventListeners are added to reduce "null" callbacks on dynamically added elements
function update()
{
    menuSection.addEventListener('click', function(e){
        addToOrder(e.target.id)
    })
    
    paySection.addEventListener("click", function(e){ 
        completeOrder(e.target.id) 
        payForOrder(e.target.id)
    })
    //removeFromOrder() only works with direct document.body call
    document.body.addEventListener("click", function(e){
        removeFromOrder(e.target.id)
    })
    
    //prevents page refresh when form is submitted
    document.getElementById("payment-menu").addEventListener('submit', function(e){
       e.preventDefault()              
    })
}

//clears homepage and menu button, then calls loadMenu function
function clearMenu(id)
{
    if(id === document.getElementById("menu-btn").id)
    {
        menuSection.innerHTML = ""
        loadMenu() 
    }
}

//loads menu, then calls update() to attach eventlisteners to newly added elements
function loadMenu()
{
    let menuOptionsList =""
    menuArray.forEach(currentItem => {
      menuOptionsList += 
        ` 
            <div class = "menu-item" id="menu-item-${currentItem.id}">
               <p class ="item-graphic"> ${currentItem.emoji} </p>
               <div class ="menu-item-textarea">
                    <p class ="item-title"> ${currentItem.name} </p>
                    <p class ="item-desc"> 
                        ${currentItem.ingredients} </p>
                    <p class ="item-price"> $${currentItem.price}  </p>
               </div>
               <button class ="item-btn" id ="${currentItem.id}"> + </button>
            </div>
        `
     } )
     menuSection.innerHTML += menuOptionsList
     update()
}

//structures html of payment section to allow for menu items to be added/removed
function OrderSummaryStructure()
{
    let structure = 
        `
            <div class ="top-order-list" id ="top-order-list" >
                <p class="item-title" id="orderSummaryTitle"> Your Order </p>
            </div>
            
            <div class ="middle-order-list" id ="middle-order-list" >
            </div>
            
            <div class ="bottom-order-list" id ="bottom-order-list" >
                <p class ="item-title total-price-title"> Total price: </p>
                <p class ="item-price" id ="final-item-cost"> </p>
                <button class ="complete-order-btn" id ="completeOrderBtn"> 
                     Complete order </button>
            </div>
        `
    paySection.innerHTML = structure
}

// listens for + button clicks and adds selected item to order summary 
function addToOrder(id)
{
    let newItem = ""
    let currentItemToAdd =""
    
    menuArray.forEach(currentID => {
        if(id === currentID.id.toString())
         {
            //prevents item to be added multiple times for this example
            document.getElementById(id).disabled= true
            currentItemToAdd = currentID.price
            newItem = 
                ` <div class = "order-item item-title" id= "order-item-${currentID.name}">    
                    <p> ${currentID.name} </p>
                    <button class ="remove-item" id ="remove-item-${currentID.name}"> 
                        remove </button>
                    <p class ="item-price order-item-price"> $${currentID.price} </p>
                  </div>
                `
         }
        //only triggers when a menu item is added to the order summary for first time
        if(itemsInOrderList == false && id === currentID.id.toString())
         { 
            OrderSummaryStructure()
            itemsInOrderList = true
         }
        
     })  
    document.getElementById("middle-order-list").innerHTML += newItem  
    orderSummaryPrice(currentItemToAdd)   
}

//removes selected item from order summary and updates total cost 
function removeFromOrder(id)
{
    let currentItemInOrder = ""
    let currentItemPrice = ""
    
    menuArray.forEach(currentID => {
        
        if(id === `remove-item-${currentID.name}`)
        {
            currentItemInOrder = document.getElementById(`order-item-${currentID.name}`)
            currentItemInOrder.style.display="none"
            //multiplied by -1 to differentiate a remove vs add request
            currentItemPrice = currentID.price * (-1)
            orderSummaryPrice(currentItemPrice)
        }
    }) 
}

//updates total order price when items are added
function orderSummaryPrice(itemPrice)
{
    totalCost = Math.round(totalCost + (itemPrice))
    document.getElementById("final-item-cost").textContent = ` $${totalCost} `
} 

//listens for complete order button clicks and loads payment pop-up form
function completeOrder(id){
    
    if(id === document.getElementById("completeOrderBtn").id)
    {
        let paymentDetailMenu = 
        
        ` <form class ="payment-menu" id ="payment-menu">
            <label class ="form-title"> Enter card details </label>
            
            <input type ="text" name="userName" class ="pay-form" 
                placeholder ="Enter your name" id = "userName" required> 
                
            <input type ="text" name="userCardNumber" class ="pay-form" 
                placeholder ="Enter card number" required> 
                
            <input type ="text" name="userCVV" class ="pay-form" 
                placeholder ="Enter CVV" required> 
                
            <input type ="submit" class ="payment-confirm-btn" 
                id ="paymentConfirmBtn" value = "Pay">
          </form>
        `
       paySection.innerHTML += paymentDetailMenu
    }
} 

//checks if pay button is clicked, then displays thank you message for user
function payForOrder(id)
{
    if(id === document.getElementById("paymentConfirmBtn").id) 
    {
      const userName = document.getElementById("userName")
      const orderSummaryTitle = document.getElementById("orderSummaryTitle")
     
      let  orderMessage = 
                `
                  <div class = "order-message">
                    <p> Thanks, ${userName.value}! Your order is on its way!
                  </div>
                `  
      paySection.innerHTML = orderMessage
    }
}