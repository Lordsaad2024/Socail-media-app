const urlParams=new URLSearchParams(window.location.search)
const id=urlParams.get("postId")
function getPost(){
    axios.get(`${url}/posts/${id}`)
    .then(response=>{
     const post=response.data.data
     const author=post.author
     document.getElementById("userpost").innerText=author.username +" :Post"
     let comments=``
     for (let comment of post.comments){
        comments+=`
          <div>
                <div class="user-info">
                    <div class="image">
                         <img src="${typeof comment.author.profile_image === 'object' ? 'user.png' :comment.author.profile_image}">
                    </div>
                   
                     <small>${comment.author.username}</small>
                </div>
                <div class="comment-info">
                    <p>${comment.body}</p>
                </div>
         </div>
        `
     }
     

     const postContent=`
            <article class="post-card">
                    <!-- رأس البوكس (صورة الصفحة + الاسم) -->
                    <div class="post-header">
                       <div class="user-info-post">
                         <div class="avatar">
                            <!-- صورة وهمية للصفحة (يمكن استبدالها بأي رابط) -->
                            <img src="${typeof author.profile_image === 'object' ? 'https://placehold.co/100' : author.profile_image}" />
                         </div>
                         <div class="page-info">
                            <span class="page-name">
                                <i class="fas fa-check-circle"></i> ${author.username}
                            </span>
                            <span class="post-time">
                                <i class="far fa-clock"></i> ${post.created_at}
                            </span>
                         </div>
                        </div>
                    </div>

                    <!-- جسم المنشور (نص + صورة) -->
                    <div class="post-body" onclick="postClicked(${post.id})">
                        <p class="post-text">
                            ${post.body}
                        </p>

                        <!-- صورة المنشور (تملأ المكان بدون تشوه) -->
                        <div class="post-image-wrapper">
                            <img src="${typeof post.image === 'object' ? 'https://placehold.co/600x400?text=No+Image' : post.image}" alt="صورة المنشور" />
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
                            <button class="comment-btn"><i class="fas fa-comment"></i> تعليق</button>
                        </div>
                    </div>
                    <div class="comments-box">
                    <div class="comments">
                       ${comments}
                    </div>
                    <hr>
                    <div class="add-comment">
                        <input  id="content-comment" type="text" placeholder="Add comment" autocomplete="one-time-code">
                        <button id="send-comment" type="button">Send</button>
                    </div>
                </div>
        
            </article>
        `
     const contentBox = document.querySelector(".posts-box")
     if (contentBox) contentBox.innerHTML = postContent
     const sendCommentButton = document.getElementById("send-comment")
     if (sendCommentButton) {
         sendCommentButton.addEventListener("click", submitComment)
     }
    })
   .catch(error=>{
    alertBox(`Failuer:${error}`,"rgb(222, 114, 114)")
  })
}
getPost()

function submitComment(){
        const contentCommentInput = document.getElementById("content-comment")
        const contentComment = contentCommentInput ? contentCommentInput.value.trim() : ""
        let params={
            "body": contentComment
        }
        let token=localStorage.getItem("token")
        const addCommentDiv=document.querySelector(".add-comment")
        if(token===null){
            if(addCommentDiv) addCommentDiv.style.display = "none"
            alertBox("Please login first to add a comment!","rgb(222, 114, 114)")
            return
        }
        if(addCommentDiv) addCommentDiv.style.display = "block"
        if (!contentComment){
            alertBox("Please write a comment first.","rgb(222, 114, 114)")
            return
        }
        runLoder(true)
        axios.post(`${url}/posts/${id}/comments`,params,{
            headers:{
                "Authorization": `Bearer ${token}`,
            }
        })
        .then(res=>{
            if (contentCommentInput) contentCommentInput.value = ''
            alertBox("The comment added succsfully","rgb(198, 224, 172)")
            getPost()
        })
        .catch(error=>{
            const message = error?.response?.data?.message || "Failed to add comment"
            alertBox(message,"rgb(222, 114, 114)")
        }) 
        .finally(()=>{
            runLoder(false)
        })
}

function postClicked(postID){
    // no-op on post details page
}

setUI()