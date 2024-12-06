window.addEventListener('load', (event) => {
    if (window.innerWidth <= 1199) {
        let body = document.getElementsByTagName('body')[0];
        body.classList.add('menu-hide');
        body.classList.remove('menu-collapsed');
        body.classList.remove('menu-expanded');
        body.classList.remove('vertical-menu-modern');
        body.classList.add('vertical-overlay-menu');
    }

    window.addEventListener("resize", onResize);

    // checkViewMode();

    // setTimeout(() => {
    //     store.state.isLoading = false;
    // }, 500);
});

function onResize() {
    let body = document.getElementsByTagName('body')[0];
    if (window.innerWidth <= 1199) {
        body.classList.add('menu-hide');
        body.classList.remove('menu-collapsed');
        body.classList.remove('menu-expanded');
        body.classList.remove('vertical-menu-modern');
        body.classList.add('vertical-overlay-menu');
    } else {
        body.classList.remove('menu-hide');
        body.classList.add('menu-collapsed');
        body.classList.add('vertical-menu-modern');
        body.classList.remove('vertical-overlay-menu');
    }
}

function mouseOverMainMenu() {
    let mainMenu = document.getElementById('mainMenu');
    mainMenu.classList.add('expanded');
}

function mouseLeaveMainMenu() {
    let mainMenu = document.getElementById('mainMenu');
    mainMenu.classList.remove('expanded');
}

function toggleMenu(reference) {
    let selectedMenu = this.$refs[reference];
    if (selectedMenu.classList.contains('open')) {
        selectedMenu.classList.remove('open');
    } else {
        selectedMenu.classList.add('open');
    }
}
function collapseSideBar() {
    let body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("menu-expanded")) {
        let body = document.getElementsByTagName("body")[0];
        body.classList.remove("menu-expanded");
        body.classList.add("menu-collapsed");
        document.getElementById('menuFixingIcon').innerHTML = 'lock_open';
    } else {
        body.classList.remove("menu-collapsed");
        body.classList.add("menu-expanded");
        document.getElementById('menuFixingIcon').innerHTML = 'lock';
    }
}
function toggleSidebar() {
    let body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('menu-hide')) {
        body.classList.remove('menu-hide');
        body.classList.add('menu-open');
    } else {
        body.classList.add('menu-hide');
        body.classList.remove('menu-open');
    }
}