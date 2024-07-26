let cachedBooks = null;

export function renderBooks() {
    if (cachedBooks) {
        render(cachedBooks);
    } else {
        fetch('json/books.json')
            .then(response => response.json())
            .then(data => {
                cachedBooks = data;
                render(data);
            })
            .catch(error => console.error('Error loading books:', error));
    }
}

function render(data) {
    const prateleira1 = document.getElementById('prateleira-1');
    const prateleira2 = document.getElementById('prateleira-2');
    const prateleira3 = document.getElementById('prateleira-3');

    prateleira1.innerHTML = ''; 
    prateleira2.innerHTML = ''; 
    prateleira3.innerHTML = ''; 

    data.prateleira1.forEach(book => {
        const link = document.createElement('a');
        link.href = book.link;
        link.target = '_blank';
        const img = document.createElement('img');
        img.src = book.image;
        img.alt = book.title;
        img.classList.add('book-image'); 
        link.appendChild(img);
        prateleira1.appendChild(link);
    });

    data.prateleira2.forEach(book => {
        const link = document.createElement('a');
        link.href = book.link;
        link.target = '_blank';
        const img = document.createElement('img');
        img.src = book.image;
        img.alt = book.title;
        img.classList.add('book-image'); 
        link.appendChild(img);
        prateleira2.appendChild(link);
    });

    data.prateleira3.forEach(book => {
        const link = document.createElement('a');
        link.href = book.link;
        link.target = '_blank';
        const img = document.createElement('img');
        img.src = book.image;
        img.alt = book.title;
        img.classList.add('book-image'); 
        link.appendChild(img);
        prateleira3.appendChild(link);
    });
}
