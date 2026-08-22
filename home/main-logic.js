//====URL====
const url="https://tarmeezacademy.com/api/v1"
const modalLogin = document.getElementById("login-modal")
const modalRegister = document.getElementById("register-modal")
const loginBtn = document.querySelector(".btn-login")
const registerBtn = document.querySelector(".btn-register")
const closeBtnLogin = document.getElementById("close-login")
const closeBtnRegister = document.getElementById("close-register")

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        if (modalLogin) modalLogin.style.display = "flex"
        if (registerBtn) registerBtn.disabled = true
    })
}
if (closeBtnLogin) {
    closeBtnLogin.addEventListener("click", () => {
        if (modalLogin) modalLogin.style.display = "none"
        if (registerBtn) registerBtn.disabled = false
    })
}
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        if (modalRegister) modalRegister.style.display = "flex"
        if (loginBtn) loginBtn.disabled = true
    })
}
if (closeBtnRegister) {
    closeBtnRegister.addEventListener("click", () => {
        if (modalRegister) modalRegister.style.display = "none"
        if (loginBtn) loginBtn.disabled = false
    })
}

function setUI(){
    const token = localStorage.getItem("token")
    const loginBox = document.querySelector(".login")
    const logoutBox = document.querySelector(".logout")
    const addPostBtn = document.getElementById("add-post")
    const editPostItems = document.querySelectorAll(".edit-post")
    const hedaerLinks = document.querySelector(".header-links");
    
    
    if(!token){
        if (logoutBox) logoutBox.style.display = "none"
        
        if (addPostBtn) {
            addPostBtn.style.display = "none"
        }
        
        if (loginBox) loginBox.style.display = "flex"

        editPostItems.forEach((item) => item.style.display = "none")
        if (hedaerLinks) hedaerLinks.style.display="none"
        
    } else {
        if (hedaerLinks) hedaerLinks.style.display = "flex";
        if (loginBox) loginBox.style.display = "none"
        if (logoutBox) logoutBox.style.display = "flex"
        
        if (addPostBtn) {
            addPostBtn.style.display = "block"
        }
        editPostItems.forEach((item) => item.style.display = "flex")
        
        const userinfo = getCurrentUser()
        if (userinfo!==null){
             const rawImage = localStorage.getItem("image");
             const userImage = rawImage ? rawImage: 'user.png';
        
            const navUsername = document.getElementById("nav-username")
            if (navUsername) {
                navUsername.innerHTML = userinfo[0]
            }
            const navUserImage = document.getElementById("user-image")
            if (navUserImage) {
                navUserImage.src = userImage
            }
        }
        
    }
    
    // 🌟 تأمين الأزرار التانية برضه لو مش موجودة في كل الصفحات
    if (registerBtn) registerBtn.disabled = false;
    if (loginBtn) loginBtn.disabled = false;
}

function alertBox(customMessage,color="rgb(198, 224, 172)"){
  const alert=document.querySelector(".alert")
  const message=document.getElementById("message")
  if (!alert || !message) return
  const addPostBtn = document.getElementById("add-post")
  alert.style.backgroundColor=color  
  alert.style.borderRadius="4px"
  if (addPostBtn) {
       addPostBtn.style.bottom="48px"
  }
  message.innerText=customMessage
  alert.style.display="flex"
        setTimeout(()=>{
            alert.style.display="none"
            if (addPostBtn){
                addPostBtn.style.bottom="5px"
            }
        },2000)
}

//=======AUTH FUNCTIONS=======
function loginBtnClicked(){
    const username=document.getElementById("username").value
    const password=document.getElementById("password").value
    if (username!='' && password !=''){
        let urlLogin=`${url}/login`
        let params={
           "username":username,
           "password":password
        }
       runLoder(true)
       axios.post(urlLogin,params)
       .then(response=>{
           localStorage.setItem("image",response.data.user.profile_image)
           localStorage.setItem("token", response.data.token)
           localStorage.setItem("username",JSON.stringify(response.data.user.username))
           localStorage.setItem("id",response.data.user.id)
           setUI()
           modalLogin.style.display = "none";
       }).catch(error=>{
          alertBox("uncorrect username or password!","rgb(222, 114, 114)")
       })
        .finally(()=>{
            runLoder(false)
       })
    }else{
        alertBox("Please fill all feild input!","rgb(222, 114, 114)")
    }
   
}

function registerBtnClick(){
    const email=document.getElementById("email").value
    const name=document.getElementById("name").value
    const usernameRegister=document.getElementById("username-register").value
    const imageInput = document.getElementById("username-image")
    const image=imageInput ? imageInput.files[0] : null
    const passwordRegister=document.getElementById("password-register").value
    if (email !='' && name !='' && usernameRegister!='' && passwordRegister!='' && image){
        let urlregister=`${url}/register`
        let formDate=new FormData()
        formDate.append("username",usernameRegister)
        formDate.append("email",email)
        formDate.append("name",name)
        formDate.append("image",image)
        formDate.append("password",passwordRegister)
        const token=localStorage.getItem("token")
        runLoder(true)
        axios.post(urlregister, formDate ,{
            headers:{
                "Content-Type":"multipart/form-data" 
            }
       })
       .then(response=>{
           localStorage.setItem("image",response.data.user.profile_image || 'user.png')
           localStorage.setItem("token", response.data.token)
           localStorage.setItem("username",JSON.stringify(response.data.user.username))
           localStorage.setItem("id",response.data.user.id)
           alertBox("New user registered successfully","rgb(198, 224, 172)")
           setUI()
           if (modalRegister) modalRegister.style.display = "none";
       })
       .catch(error=>{
           alertBox(`The username has already been taken!`,"rgb(222, 114, 114)")
       })
       .finally(()=>{
            runLoder(false)
       })
    }else{
        alertBox("Please fill all feild input!","rgb(222, 114, 114)")
    }
    
}
function logOut(){
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("image")
    localStorage.removeItem("id")
    const postModel = document.getElementById("post-modal")
    if (postModel){
       postModel.style.display = "none"
    }
    setUI()
}
function getCurrentUser(){
    let user=null
    const currentUser=localStorage.getItem("username")
    if (currentUser!=null){
        user=[JSON.parse(currentUser),localStorage.getItem("id")]
        
    }
    return user
}

function getToken(){
    return localStorage.getItem("token")
}
//=======//AUTH FUNCTIONS//=======
//=======LODER=======
function runLoder(display){
    const loderBox=document.querySelector(".box")
    if (!loderBox) return
    if (display){
        loderBox.style.display = "flex"
    }else{
        loderBox.style.display = "none"
    }
}

//=======//LODER//=======