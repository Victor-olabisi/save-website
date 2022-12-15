

const getElement =(selection)=>{
    const element= document.querySelector(selection);
    if(element){
        return element
    } else {
        throw Error("please check selection");
    }
}

// const showModal = document.getElementById("show-modal");
// const modal = document.getElementById("modal");
let bookmarks =[]

// selection of element
const showModal= getElement("#show-modal");
const modal = getElement("#modal");
const closeBtn = getElement(".close-btn")
const form = getElement("#bookmark-form");
const websiteNameEl =getElement("#website-name");
const websiteUrlEl = getElement("#website-url");
const bookMarkContainer = getElement("#bookmark-container");
const alert  = getElement(".alert");


showModal.addEventListener("click", ()=>{
    modal.classList.add("show-modal")
})

closeBtn.addEventListener("click", ()=>{
    modal.classList.remove("show-modal")
});

window.addEventListener("click", (e)=>{
  e.target===modal?modal.classList.remove("show-modal"):false
})

// form validation
function validateForm(websiteName, websiteUrl){
    const expression= /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

    const regEx = new RegExp(expression);
    if(!websiteName  || !websiteUrl){
        displayAlert("please fill the form", "danger")
        return false
    }
    
    if(!websiteUrl.match(regEx)){
        displayAlert("please match sure the website url is correct","danger")
        return false
    }
    return true
}

// build bookmark interface
function buildBookMarks(){
    let displayBookMarks = bookmarks.map((bookmark) =>{
        const {name, url}=bookmark;
        return `
  <div class="item">
    <i class="fas fa-times item-btn"></i>
     <div class="name">
          <img src="https://www.google.com/s2/u/0/favicons?domain=${url}" alt="">
          <a href="${url}" target="_blank" class="website-link" data-id="${url}">${name}</a>
     </div>
  </div>`
    }).join("")
  bookMarkContainer.innerHTML=displayBookMarks

  const itemBtns = [...document.querySelectorAll(".item-btn")];
  itemBtns.forEach((btn)=>{
    btn.addEventListener("click", deleteBookmark)
})
}


// fetchbookmarks from  local storage
function fetchBookMarks(){
    if(localStorage.getItem("bookmarks")){
        bookmarks= JSON.parse(localStorage.getItem("bookmarks"));
    } else{
        bookmarks=[
            {
             name:"google",
             url:"google.com",
            },
        ];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    }
    // localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
   buildBookMarks();
}

function storeBookMark(e){
   e.preventDefault()
 const websiteName = websiteNameEl.value;
 let websiteUrl = websiteUrlEl.value;
 if(!websiteUrl.includes("http://","https://")){
    websiteUrl=`https://${websiteUrl}`
 }
if(!validateForm(websiteName, websiteUrl)){
    return false
}
const bookmark = {
    name:websiteName,
    url: websiteUrl,
}

bookmarks.push(bookmark);
form.reset();
websiteNameEl.focus();
displayAlert("website saved sucessfully", "success")
localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
fetchBookMarks()
}

// delete bookmark 
function deleteBookmark(e){
 const item= e.target.parentElement;
 const name= e.target.nextElementSibling.children[1].textContent;
 const url =e.target.nextElementSibling.children[1].dataset.id;
 
 item.remove();
 const newbookmarks=bookmarks.filter((bookmark)=>{
   return name !== bookmark.name && url!== bookmark.url;
 
 });
 bookmarks=[ ...newbookmarks]
 localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
}

// display alert

function displayAlert(text,color){
alert.textContent= text;
alert.classList.add(`alert-${color}`);

setTimeout( function (){
    alert.textContent= "";
    alert.classList.remove(`alert-${color}`);
},2000)
}

form.addEventListener("submit",storeBookMark );

fetchBookMarks()

