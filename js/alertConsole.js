window.console.log = function() {
    const style = "color:red; font-size:1.1em;";
    const style2 = "color:green; font-weight:bold; font-size:1.3em;background-color: gold";
    const styleLink = "color:blue; font-size:1.1em; text-decoration: underline;";
    const emoji = "🚀";
    const url = location.hostname;
    console.group("Desenvolvedores:");
    console.info("%c-------------------------------------------------------------", style);
    console.info("%cEste é mais um site desenvolvido ", style2);
    console.info(`%c${emoji} %cCopie e cole no navegador: %c${url}/#devs`, style, "", styleLink);
    console.info("%cTodos os direitos reservados © 2024", style);
    console.info("%c-------------------------------------------------------------", style);
    console.info("");
    console.groupEnd();
    window.console.log = function() {
        return false;
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.location.hash = '#logout';
    }
});

window.addEventListener('resize', () => {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
        //window.location.href = '#logout';
        console.log('DevTools detectado!');
    }

});
window.addEventListener('keydown', (event) => {
    console.log(event)
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
        window.location.href = '#logout';
        console.log('DevTools detectado!');
    }
});