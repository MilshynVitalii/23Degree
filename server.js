let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');

let asyncCss = `<script>
function loadStyle(url){
	let link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	document.body.appendChild(link);
}
loadStyle('css/main.css');
</script>`;

app.use('/css', express.static(path.resolve(__dirname, './build/css')));
app.use('/js', express.static(path.resolve(__dirname, './build/js')));
app.use('/images', express.static(path.resolve(__dirname, './build/images')));
app.use('/fonts', express.static(path.resolve(__dirname, './build/fonts')));
app.use('/favicon.ico', express.static(path.resolve(__dirname, './build/favicon.ico')));

app.use('*', function(req, res){
    let criticalCSS = fs.readFileSync('./build/css/critical.css').toString('UTF-8');
    let html = fs.readFileSync('./build/index.html').toString('UTF-8');
    html = html.replace('<link rel="stylesheet" type="text/css" href="./css/main.css">', `<style>${criticalCSS}</style>`);
    html = html.replace('<!--asyncCss-->', asyncCss);
    res.end(html);
});

console.log('server started')
app.listen(3000);