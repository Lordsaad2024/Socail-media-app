// ADD-POST
const headerModel=document.getElementById("header-of-model")
const postModel=document.getElementById("post-modal")
const addPostBtn=document.getElementById("add-post")
const createPost=document.getElementById("create-post")
const closeBtnPost=document.getElementById("close-post-box")
if (addPostBtn) {
    addPostBtn.onclick = function () {
        if (postModel) postModel.style.display = "flex";
    }
}
if (closeBtnPost) {
    closeBtnPost.onclick = function () {
        if (postModel) postModel.style.display = "none";
        if (headerModel) headerModel.innerText="New post"
        if (createPost) createPost.innerText="Create"
    }
}
//--ADD-POST--

//DELETE-POST
const deletePostBtn=document.getElementById("delete-post")
const deleteModel=document.getElementById("delete-modal")
const closeDeleteModelBtn=document.getElementById("close-delete-box")
const deleteBtn=document.getElementById("delete-post-confirm")

if (closeDeleteModelBtn) {
    closeDeleteModelBtn.onclick=()=>{
        if (deleteModel) deleteModel.style.display="none"
    }
}
//--DELETE-POST--

//---Models---
//INFINIT SCRORLING
let currentPage = 1
let lastPage = 1
window.addEventListener("scroll", () => {
    // حسبة دقيقة مدعومة من كل المتصفحات لمعرفة الوصول لنهاية الصفحة
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight || document.body.offsetHeight;
    // وصلنا لآخر الصفحة (مع ترك مسافة 100 بكسل للأمان)
    const endOfPage = (scrollTop + windowHeight) >= (documentHeight - 100);
    // الشرط: لو وصلنا للآخر، ومش بنحمل حالياً، ولسه في صفحات تانية متبقية
    if (endOfPage && currentPage < lastPage) {
        currentPage++;
        getPosts(false, currentPage); 
    }
})

// --INFINIT SCRORLING--


function getToken(){
    return localStorage.getItem("token")
}

function getPosts(reload=true,page=1){
    runLoder(true)
    axios.get(`${url}/posts?limit=1&page=${page}`)
    .then(response=>{
     lastPage=response.data.meta.last_page
     const posts=response.data.data
     if(reload){
         document.querySelector(".posts-box").innerHTML=""
     }
     let user=getCurrentUser()
     
     for (let post of posts){
        const author=post.author
        let isMyPost= user!=null && author.id==user[1]
        let editButtonContent=''
        let deleteButtonContent=''
        if(isMyPost){
             editButtonContent=`<button id="edit-post" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
             deleteButtonContent=`<button id="delete-post" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>`
        }
        let content=`
            <article class="post-card">
                    <!-- رأس البوكس (صورة الصفحة + الاسم) -->
                    <div class="post-header">
                      <div class="user-info-post">
                        <div class="avatar" onclick="profilePostUser(${author.id})">
                            <!-- صورة وهمية للصفحة (يمكن استبدالها بأي رابط) -->
                            <img src="${typeof author.profile_image==='object' ? 'user.png' :author.profile_image}" alt="صورة الصفحة" />
                        </div>
                        <div class="page-info">
                            <span class="page-name" onclick="profilePostUser(${author.id})">
                                <i class="fas fa-check-circle"></i> ${author.username}
                            </span>
                            <span class="post-time">
                                <i class="far fa-clock"></i> ${post.created_at}
                            </span>
                        </div>
                      </div>
                      <div class="edit-post">
                       ${editButtonContent}  
                       ${deleteButtonContent} 
                      </div> 
                    </div>

                    <!-- جسم المنشور (نص + صورة) -->
                    <div class="post-body" onclick="postClicked(${post.id})">
                        <p class="post-text">
                            ${post.body}
                        </p>

                        <!-- صورة المنشور (تملأ المكان بدون تشوه) -->
                        <div class="post-image-wrapper">
                            <img src="${typeof post.image === 'object' ? 'https://placehold.co/600x400?text=No+Image' : post.image}" alt="صورة المنشور" loading="lazy"/>
                        </div>
                    </div>

                    <!-- تذييل البوكس (إعجابات + تعليقات + أزرار) -->
                    <div class="post-footer">
                        <div class="post-stats">
                            <span class="likes">
                                <i class="fas fa-thumbs-up"></i> 0
                            </span>
                            <span class="comments">
                                <i class="fas fa-comment"></i> ${post.comments_count}
                            </span>
                        </div>
                        <div class="post-actions">
                            <button class="like-btn"><i class="fas fa-thumbs-up"></i> إعجاب</button>
                            <button class="comment-btn" onclick="postClicked(${post.id})"><i class="fas fa-comment"></i> تعليق</button>
                        </div>
                    </div>
            </article>
        `
        document.querySelector(".posts-box").innerHTML+=content
    }
   })
   .catch(error=>{
    alertBox(`Failuer:Network Error`,"rgb(222, 114, 114)")
   })
   .finally(()=>{
        runLoder(false)
    })
}
getPosts()
function postClicked(postID){
    window.location=`post-detalis.html?postId=${postID}`
}
 
function createNewPost(){
    let postId=document.getElementById("post-id-input").value
    let isCreate= postId==null || postId==""

    const contentInput = document.getElementById("content-of-post")
    const fileInput = document.getElementById("file")
    const contentPost = contentInput ? contentInput.value.trim() : ""
    const file = fileInput ? fileInput.files[0] : null
    
    let urlCreatePost=`${url}/posts`
    
    let formDate=new FormData()
    //CREATE POST
    if (isCreate){
        if (contentPost || file){
                formDate.append("body", contentPost || "")
                if (file){
                    formDate.append("image", file)
                }
                urlCreatePost=`${url}/posts`
                runLoder(true)
                axios.post(urlCreatePost, formDate ,{
                      headers:{
                        "Content-Type":"multipart/form-data" ,
                        "Authorization":`Bearer ${getToken()}`
                   }
                })
                .then(response=>{
                    if (contentInput) contentInput.value = ''
                    if (fileInput) fileInput.value = ''
                    alertBox("New post has been created successfully","rgb(198, 224, 172)")
                    getPosts()
                    setUI()
                    if(postModel) postModel.style.display = "none";
                    scroll({
                        top:0,
                        behavior:"smooth"
                    })
               })
               .catch(error=>{
                   alertBox("Unauthorized!","rgb(222, 114, 114)")
               })
               .finally(()=>{
                   runLoder(false)
               })
        }else{
               alertBox("Please add content!","rgb(222, 114, 114)")
        }
            
    //EDIT POST
    }else{
        urlCreatePost=`${url}/posts/${postId}`
        formDate.append("body",contentPost)
        formDate.append("image", file)
        formDate.append("_method","put")
        runLoder(true)
        axios.post(urlCreatePost, formDate ,{
            headers:{
                "Content-Type":"multipart/form-data" ,
                "Authorization":`Bearer ${getToken()}`
             }
        })
       .then(response=>{
           if (contentInput) contentInput.value = ''
           if (fileInput) fileInput.value = ''
           alertBox("Edit post has been edited successfully","rgb(198, 224, 172)")
           getPosts()
           setUI()
           if(postModel) postModel.style.display = "none";
       })
       .catch(error=>{
          alertBox("Unauthorized!","rgb(222, 114, 114)")
       })
       .finally(()=>{
          runLoder(false)
       })
    }

   
}
function profilePostUser(userID){
    window.location=`profile.html?user-id=${userID}`
}
function editPost(postObject){
     let post=JSON.parse(decodeURIComponent(postObject))
     const contentInput = document.getElementById("content-of-post")
     document.getElementById("post-id-input").value=post.id
     headerModel.innerText="Edit post"
     createPost.innerText="Edit"
     if (contentInput) contentInput.value = post.body
     postModel.style.display = "flex"; 
}

function deletePost(postObject){
    let post=JSON.parse(decodeURIComponent(postObject))
    document.getElementById("delete-post-id-input").value=post.id
    deleteModel.style.display="flex"
}

function DeleteConfimPost(){
    let postID=document.getElementById("delete-post-id-input").value
    const deleteUrl=`${url}/posts/${postID}`
    const token = getToken()
    runLoder(true)
    axios.delete(deleteUrl,{
        headers:{
            "Content-Type":"multipart/form-data" ,
            "Authorization":`Bearer ${token}`
        }
    })
    .then(response=>{
       deleteModel.style.display="none"
       alertBox("Delete post has been succssuflly")
       getPosts()

    })
    .catch(error=>{
        alertBox(error,"rgb(222, 114, 114)")
    })
    .finally(()=>{
        runLoder(false)
    })
}
setUI()
