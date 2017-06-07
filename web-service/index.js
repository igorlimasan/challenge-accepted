var express = require('express');
var app = express();
var fs = require('fs');

var conteudo = fs.readFileSync("./base/locales.json");
var locais = JSON.parse(conteudo);

var obj = fs.readFileSync("./base/weather.json");
var tempo = JSON.parse(obj);

function replaceAccent(s){
    var r=s.toLowerCase();
    //r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/æ/g),"ae");
    r = r.replace(new RegExp(/ç/g),"c");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/œ/g),"oe");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    r = r.replace(new RegExp(/[ýÿ]/g),"y");
    r = r.replace(new RegExp(/\W/g),"");
    return r;
};


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/',function(req,res){
    res.send('Api Teste');
    
});


/**Retorna todas as info. sobre todos os locais
 * return: JSON Object com os locais
 */
app.get('/api/get_locales',function(req,res,next){
    res.send(locais);
});

/**
 * Retorna as informações de um local específico baseado no id do local
 */
app.get('/api/get_locale_id/:id',function(req,res,next){
    var id = req.params.id;
    var local;
    console.log(id)
    if(id === null) local=null;
    else{
        for(var i = 0; i < locais.length; i++){
            temps = locais[i];
            console.log('Id do local: '+temps.id);
            if (temps.id == id){
                local = temps;
                return res.send(local);
                
            }

        }
    }
    res.send({error:'NOT FOUND'});
});



/** Retorna todas as informações sobre o tempo de todos os locais*/
app.get('/api/get_all_weather', function(req,res,next){
    res.send(tempo);
});

/**Retorna as informações sobre o tempo com base no Id do local */
app.get('/api/get_weather_by_locale_id/:id',function(req,res,next){
    id = req.params.id;
    if(id === null) req.send({error:'NOT FOUND'});
    for(i = 0; i < tempo.length; i++){
        weather = tempo[i];
        console.log(weather);
        if(weather.locale.id == id){
            return res.send(weather);
            
        }
    }
    res.send({error:'NOT FOUND'});

});

app.get('/api/get_weather_by_locale_name/:name',function(req,res,next){
    nome = unescape(req.params.name);
    if(nome === null) req.send({error:'NOT FOUND'});
    for(i = 0; i < tempo.length;i++){
        weather=tempo[i];
        console.log("Cidade json: " + weather.locale.name.toLowerCase().replace(" ","") + "\nCidade solicitada: "+nome.replace(" ",""));
        //if(weather.locale.name.toLowerCase().replace(" ","") === nome.toLowerCase().replace(" ","")){

            if(replaceAccent(weather.locale.name.toLowerCase().replace(" ","")) === 
            replaceAccent(nome.toString().toLowerCase().replace(" ",""))){
            res.send(weather);
        }
    }
       res.send({error:'NOT FOUND'});

});

/**Caso rota não exista retorna um 'Page not found' */
app.get('*', function(req, res){
  res.status(404).send("What???");
});

app.listen(9000);
