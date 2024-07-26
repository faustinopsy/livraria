document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main-content');

    menuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    main.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
});
