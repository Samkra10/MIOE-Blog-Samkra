document.addEventListener('DOMContentLoaded', function() {
    fetch('posts.txt')
        .then(response => response.text())
        .then(data => {
            const posts = parsePosts(data);
            displayPosts(posts);
        })
        .catch(error => console.error('Error:', error));
});

function parsePosts(data) {
    const posts = [];
    const lines = data.split('\n');
    let currentPost = {};

    for (let line of lines) {
        if (line.startsWith('Titel: ')) {
            if (Object.keys(currentPost).length > 0) {
                posts.push(currentPost);
                currentPost = {};
            }
            currentPost.title = line.substring(7);
        } else if (line.startsWith('Untertitel: ')) {
            currentPost.subtitle = line.substring(11);
        } else if (line.startsWith('Name: ')) {
            currentPost.name = line.substring(6);
        } else if (line.startsWith('Datum: ')) {
            currentPost.date = line.substring(7);
        } else if (line.startsWith('Uhrzeit: ')) {
            currentPost.time = line.substring(9);
        } else if (line.trim() !== '') {
            currentPost.content = (currentPost.content || '') + line + '\n';
        }
    }

    if (Object.keys(currentPost).length > 0) {
        posts.push(currentPost);
    }

    return posts;
}

function displayPosts(posts) {
    const container = document.getElementById('posts-container');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-title">
                <h3>${post.title}</h3>
                <p class="post-subtitle">${post.subtitle}</p>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    Von ${post.name} am ${post.date} um ${post.time}
                </div>
                <div class="post-text">${post.content}</div>
            </div>
        `;
        container.appendChild(postElement);

        const titleElement = postElement.querySelector('.post-title');
        const contentElement = postElement.querySelector('.post-content');
        titleElement.addEventListener('click', () => {
            contentElement.style.display = contentElement.style.display === 'none' ? 'block' : 'none';
        });
    });
}
