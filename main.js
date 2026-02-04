const API_URL = "http://localhost:3000";
async function LoadPosts() {
    let res = await fetch(`${API_URL}/posts`);
    let posts = await res.json();
    let body = document.getElementById("post_table_body");
    body.innerHTML = '';

    posts.forEach(post => {
        let isDeleted = post.isDeleted === true;
        let rowClass = isDeleted ? 'soft-deleted' : '';
        let statusText = isDeleted ? '(Đã xóa)' : 'Hoạt động';
        
       
        let deleteBtn = isDeleted ? '' : `<button class="delete-btn" onclick="SoftDeletePost('${post.id}')">Xóa</button>`;

        body.innerHTML += `
            <tr class="${rowClass}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${statusText}</td>
                <td>
                    <button class="edit-btn" onclick="EditPost('${post.id}')">Sửa</button>
                    ${deleteBtn}
                </td>
            </tr>`;
    });
}
async function SavePost() {
    let id = document.getElementById("post_id").value;
    let title = document.getElementById("post_title").value;
    let views = document.getElementById("post_views").value;

    if (!title) return alert("Vui lòng nhập tiêu đề!");
    if (!id) {
        let res = await fetch(`${API_URL}/posts`);
        let posts = await res.json();
        
        let maxId = 0;
        posts.forEach(p => {
            let currentId = parseInt(p.id); 
            if (!isNaN(currentId) && currentId > maxId) {
                maxId = currentId;
            }
        });
        
        let newId = (maxId + 1).toString();

        await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: newId, 
                title: title, 
                views: Number(views), 
                isDeleted: false 
            })
        });

    } else {
        await fetch(`${API_URL}/posts/${id}`, {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, views: Number(views) })
        });
    }

    ClearPostForm();
    LoadPosts();
}

async function SoftDeletePost(id) {
    if (!confirm("Bạn có chắc muốn xóa bài viết này không?")) return;

    await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    
    LoadPosts();
}
async function EditPost(id) {
    let res = await fetch(`${API_URL}/posts/${id}`);
    let post = await res.json();
    document.getElementById("post_id").value = post.id;
    document.getElementById("post_title").value = post.title;
    document.getElementById("post_views").value = post.views;
}

function ClearPostForm() {
    document.getElementById("post_id").value = "";
    document.getElementById("post_title").value = "";
    document.getElementById("post_views").value = "";
}

async function LoadComments() {
    let res = await fetch(`${API_URL}/comments`);
    let comments = await res.json();
    let body = document.getElementById("cmt_table_body");
    body.innerHTML = '';

    comments.forEach(cmt => {
        body.innerHTML += `
            <tr>
                <td>${cmt.id}</td>
                <td>${cmt.text}</td>
                <td>${cmt.postId}</td>
                <td>
                    <button class="edit-btn" onclick="EditComment('${cmt.id}')">Sửa</button>
                    <button class="delete-btn" onclick="DeleteComment('${cmt.id}')">Xóa</button>
                </td>
            </tr>`;
    });
}

async function SaveComment() {
    let id = document.getElementById("cmt_id").value;
    let text = document.getElementById("cmt_text").value;
    let postId = document.getElementById("cmt_postid").value;

    if (!text || !postId) return alert("Nhập đủ nội dung và Post ID!");

    if (!id) {
        let res = await fetch(`${API_URL}/comments`);
        let cmts = await res.json();
        let maxId = 0;
        cmts.forEach(c => {
            let currentId = parseInt(c.id);
            if (!isNaN(currentId) && currentId > maxId) maxId = currentId;
        });
        let newId = (maxId + 1).toString();

        await fetch(`${API_URL}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, text: text, postId: postId })
        });
    } else {
        await fetch(`${API_URL}/comments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, postId: postId })
        });
    }
    ClearCmtForm();
    LoadComments();
}

async function DeleteComment(id) {
    if (!confirm("Xóa comment này?")) return;
    await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE' });
    LoadComments();
}

async function EditComment(id) {
    let res = await fetch(`${API_URL}/comments/${id}`);
    let cmt = await res.json();
    document.getElementById("cmt_id").value = cmt.id;
    document.getElementById("cmt_text").value = cmt.text;
    document.getElementById("cmt_postid").value = cmt.postId;
}

function ClearCmtForm() {
    document.getElementById("cmt_id").value = "";
    document.getElementById("cmt_text").value = "";
    document.getElementById("cmt_postid").value = "";
}

// Chạy khi trang tải xong
window.onload = function() {
    LoadPosts();
    LoadComments();
};