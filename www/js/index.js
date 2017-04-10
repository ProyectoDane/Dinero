/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var listo,
    listoPlay = function() {
            var url = audios.con_vuelto.presiona_listo;
            var src = "";
            // Android needs the search path explicitly specified
            if (cordova.platformId === 'android') {
                src = '/android_asset/www/' + url;
            }

            listo = new Media(src,
                // success callback
                 function () {
                   console.log("playing" + url);
                },
                // error callback
                function (err) {
                    console.log("playAudio():Audio Error: " + err);
                }
            );
            listo.play();
    },
    listoStop = function() {
        var url = audios.con_vuelto.presiona_listo;
        var src = "";
        // Android needs the search path explicitly specified
        if (cordova.platformId === 'android') {
            src = '/android_asset/www/' + url;
        }

        listo = new Media(src,
            // success callback
             function () {
               console.log("playing" + url);
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + err);
            }
        );
        listo.stop();
    },
    listoPlaying;


function onBackKeyDown(event){
    event.preventDefault();
    return false;
};

function menuKeyDown(event){
    event.preventDefault();
    return false;
};

var app = {
    loadApp : function(){
        //document.addEventListener("deviceready", onDeviceReady, false);
    },

    // Application Constructor
    initialize: function() {
        this.setOnTouchIntro();
        this.setOnClickExitButton();
        $.mobile.allowCrossDomainPages = true;
        document.addEventListener('deviceready', this.onDeviceReady, false);
        loginPageComposer.setUpMenuButtonsAction();
        usrManager.init();
    },
    //Set the introduction screen on touch
    setOnTouchIntro: function() {
        $("#index").on("click",function(){
            $.mobile.navigate( "#login", { transition : "none" });
        });
    },
    setOnClickExitButton:function() {
        $(".e-btn").on("click",function(){
            alert("GRACIAS POR JUGAR! ESPERO QUE VUELVAS PRONTO.");
            navigator.app.exitApp();
        });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() { },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        document.addEventListener("backbutton", onBackKeyDown, true);
        document.addEventListener("menubutton", menuKeyDown, true);
        var url = "audio/intro-primer-pantalla.mp3";
        var src = "";
        // Android needs the search path explicitly specified
        if (cordova.platformId === 'android') {
            src = '/android_asset/www/' + url;
        }

        var bienvenida = new Media(src,
            // success callback
             function () {
               console.log("audio bienvenida");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + err);
            }
        );
        bienvenida.play();
    }
};



var nivelSuperadoManager = {

    setUpAtInit: function(idPaginaJuegoPrevio, $botonBack, $botonFw, objetoPrincipalJuego ){

        /*Setea el botón de siguiente juego en función del juego que viene.*/
        //Ver que hacer cuando pasó el último nivel.
        var numberOfPrevLevel = "1"; //Default Primer Nivel.
        var numberOfNextLevel = "1"; //Default Primer Nivel.
        var idProximoNivelJuego = idPaginaJuegoPrevio; //Default misma pagina.

        if( typeof idPaginaJuegoPrevio == "string" && idPaginaJuegoPrevio.length > 2  ){
            numberOfPrevLevel = idPaginaJuegoPrevio.substring(1,2);
            numberOfNextLevel = (parseInt(numberOfPrevLevel)+1).toString();
            idProximoNivelJuego = idPaginaJuegoPrevio.replace(numberOfPrevLevel, numberOfNextLevel );
        }

        $botonFw.prop("onclick", null); //Antes, limpiar los bindings anteriores.
        if(numberOfPrevLevel != objetoPrincipalJuego.cantidadDeNiveles.toString()){
            $botonFw.bind( "click", function() {
                $.mobile.navigate( "#"+idProximoNivelJuego, { transition : "none" });
            });
        }else{
            $botonFw.css("background-color","white");
        }

        $botonBack.prop("onclick", null); //Antes, limpiar los bindings anteriores.
        $botonBack.bind( "click", function() {
            $.mobile.navigate( "#"+idPaginaJuegoPrevio, { transition : "none" });
        });

        var estadoBotonesNivelPasado
        for(var estadoBotonesNivel in objetoPrincipalJuego.estadoBotonesNav){
            estadoBotonesNivelPasado = objetoPrincipalJuego.estadoBotonesNav[estadoBotonesNivel];
            for(var i=1; i<= numberOfNextLevel; i++ ){
                estadoBotonesNivelPasado[i.toString()] = true;
            }
        };
        estadoBotonesNivelPasado = objetoPrincipalJuego.estadoBotonesNav[idPaginaJuegoPrevio];
        estadoBotonesNivelPasado["s"] = true;


        //TODO: Acá, además después se debería actualizar el localStorage del usuario con el nivel pasado.
    },
    /*Esta función activa los botones correspondientes al panel de navegación usando el atributo "estadoBotonesNavActual"
     * del objeto principal del juego al que pertenece. Para llamar a esta función, asegurarse que todos los botones
     * están escondidos en beforeshow.
     *
     * $botones: Objeto jQuery con los botones. Cada id de un boton deberá tener el formato:
     *              Si es un botón de nivel activo: "n-sufijoId" siendo: n=Numero de Nivel y sufijoId=Sufijo del id del botón.
     *              Si es un boton de siguiente: "s-sufijoId" siendo sufijoId=Sufijo del id del botón.
     *              Si es botón de home: Asegurarse que tenga la clase "hm-btn" ya que siempre se muestra.
     *              Si es botón de back: Asegurarse que tenga la clase "b-btn-on" ya que siempre se muestra.
     * */
    initPanelNav: function(estadoBotonesNavActual, idPaginaActual, sufijoId, cantNiveles){

        var nivelActualStr = "0";

        for( var i=1; i <= cantNiveles; i++ ){
            nivelActualStr = i.toString();
            nivelSuperadoManager.setEstadoBoton( estadoBotonesNavActual, nivelActualStr, idPaginaActual, sufijoId  );
        };
        //Botón siguiente
        nivelSuperadoManager.setEstadoBoton( estadoBotonesNavActual, "s", idPaginaActual, sufijoId  );
        //Botón atrás
        $(idPaginaActual + " #" + "b-" + sufijoId).show();
        //Botón home
        $(idPaginaActual + " .hm-btn").show();
        //Flecha de ir a nivel
        $(idPaginaActual + " .ir-nivel").show();
        //Menu
        $(idPaginaActual + " .m-btn").show();
    },

    setEstadoBoton: function( estadoBotonesNavActual, idEstadoDelBoton, idPaginaActual, sufijoId  ){

        if (estadoBotonesNavActual[idEstadoDelBoton] == true) {
            $(idPaginaActual + " #" + idEstadoDelBoton + "-" + sufijoId).show();
            $(idPaginaActual + " #" + idEstadoDelBoton + "-" + sufijoId + "-off").hide();
            return;
        } else {
            $(idPaginaActual + " #" + idEstadoDelBoton + "-" + sufijoId + "-off").show();
            return;
        }

    }
};

var dialogManager ={

    // currentDialog
    // Usar Media plugin de Phonegap cuando se implemente el audio
    //http://docs.phonegap.com/en/edge/cordova_media_media.md.html
    //TODO: organizar todo lo relativo al audio y la animación en otro archivo js.

    startDialog: function( hideElements, showElements, animationElemPair, soundFilePath, time ){


        this.hideElems(hideElements);
        this.showElems(showElements);
        //levantar el archivo
        //var time = archivo.duration();
        //Si le pasé time == null quiere decir que tiene que usar la duración del audio.
        if(time == null || typeof time == "undefined"){
            time = 5000; //Después acá va el tiempo del audio
        }
        //sonidista.play(archivo);

        this.animar(animationElemPair[0],animationElemPair[1], time);

        return time; //Devuelve el tiempo que dura, para que el próximo diálogo sepa cuando empezar.

    },

    hideElems: function( elems ){

        for ( i = 0; i < elems.length; i++) {
            $(elems[i]).hide();
        }

    },


    showElems: function( elems ) {

        for ( i = 0; i < elems.length; i++) {
            $(elems[i]).show();
        }

    },

    animar: function(imgPos1, imgPos2, timeMiliseconds){

        var animarPaso1 = setInterval( function(){
            $(imgPos1).hide();
            $(imgPos2).show();
            window.setTimeout(function(){
                    $(imgPos2).hide();
                    $(imgPos1).show();
                },250);
            }, 500);

        window.setTimeout(function(){
            window.clearInterval(animarPaso1);
            $(imgPos2).hide();
            $(imgPos1).show();
        },timeMiliseconds);
    }


};

var elemAnimador = {

    setUp: function( $selector, horizontal, vertical, rot, vel ){
        $selector.jrumble({
                x: horizontal,
                y: vertical,
                rotation: rot,
                speed:vel
        });
    },

    start: function(elem, tiempo){

        $(elem).trigger('startRumble');

        window.setTimeout(function(){
            $(elem).trigger('stopRumble');
        },tiempo);

    },

    setUpDraggables: function(selectorDraggables, selectorLimite, selectorSnapDrop, idListoBtn){

        $(selectorDraggables).draggable({
            containment: selectorLimite,
            stack: selectorDraggables,
            snap: selectorSnapDrop,

            revert: function(event, ui) {

                var origTop = $(this).attr("data-origtop");
                var origLeft = $(this).attr("data-origleft");
                $(this).data("ui-draggable").originalPosition = {
                    top : origTop,
                    left : origLeft
                };

                return event !== false ? false : true;
            },
            revertDuration: 1500,
            //create: "",//Fired when the draggable element is first created by calling draggable().
            //stop: "",//Fired when the user lets go of the mouse button after dragging the element.
            //drag: "",//Fired whenever the mouse is moved during the drag operation.
            start: function(event, ui) {


                if($(this).hasClass("dropped")){
                    var $dropable = $(".full-"+$(this).attr("id"));
                    if($dropable.size() == 1){
                        $(this).removeClass("dropped");
                        $dropable.removeClass("full");
                        $dropable.removeClass("full-"+$(this).attr("id"));
                        $dropable.css("background-color","rgba(0,0,0,0)");
                        $dropable.css("border","dashed 3px rgba(0,0,0,0)");
                        $(idListoBtn).hide();
                    }
                }

            }//Fired when the user first starts dragging the element.
        } );

    },

    setUpDropable: function(selectorDropable, idListoBtn, cantidadAComprar, selectorPagJuego){

        $(selectorDropable).droppable( {
            tolerance:"pointer",
            accept: function(){
                if( !$(this).hasClass("full")){
                    return true;
                }
                return false;
            },
            drop: function( event, ui ) {
                var $draggable = $(ui.draggable);
/*                $(this).css("background-color","rgba(232, 245, 57, 0.48)");
                $(this).css("border","solid 3px rgba(232, 245, 57, 0.95)");*/
                $(this).css("background-color","transparent");
                $(this).css("border","transparent");
                $(this).addClass("full-"+$draggable.attr("id"));
                $(this).addClass("full");
                $draggable.addClass("dropped");
                var cantDropableFull = $(selectorPagJuego+" .full").size();
                if( cantDropableFull == cantidadAComprar ){
                    $(idListoBtn).fadeIn();

                        listoPlaying = true;
                        stopAudio();
                        listoPlay();




                }
            },
            activate: function( event, ui ) {
                $(this).css("background-color","rgba(164, 220, 164, 0.60)");
                $(this).css("border","dashed 3px rgba(33, 163, 78, 0.72)");
            },
            deactivate: function( event, ui ) {
                $(this).css("background-color","rgba(0,0,0,0)");
                $(this).css("border","dashed 3px rgba(0,0,0,0)");
            },
            over: function( event, ui ) {},
            out: function( event, ui ) {}
        } );
    },

    setElemComprado: function($comprados, juego_Nivel){

        var numOpc = 1;
        var $elemCompra;
        $.each($comprados, function(key, value){

            $elemCompra = $(value).removeAttr("style").removeClass("dropped").clone();
            $elemCompra.attr("id",juego_Nivel+"-comprado-"+numOpc);
            $elemCompra.find(".producto").addClass("comprado-bolsa").removeClass("producto");
            $elemCompra.find(".precio").addClass("precio-bolsa").removeClass("precio");
            $("#"+juego_Nivel+"-compra-"+numOpc).html($elemCompra.html());

            numOpc++;


        });
    },

    setUpMediosDePago: function( $mediosDePago, idCaja ){

        $mediosDePago.bind( "click", function() {

            var $medioDePago = $(this);
            if(!$medioDePago.hasClass("usado")){
                var $valorCaja = $("#"+idCaja+" span");
                var valorActualCaja = parseInt($valorCaja.html().replace("$", '').trim());
                valorActualCaja += parseInt($medioDePago.data("valor"));
                $valorCaja.html("$"+valorActualCaja);
                $medioDePago.hide();
                $medioDePago.addClass("usado");
            }
        });
    }
};

function randomIntFromInterval(min,max){

    return Math.floor(Math.random()*(max-min+1)+min);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function getOpcionesDeVuelto(vuelto){

    var opc1 = randomIntFromInterval(vuelto+1,vuelto+16);
    var opc2 = 0;
    if(vuelto >= 1){
        if(vuelto == 1){
            opc2 = 0;
        }else{
            opc2 = randomIntFromInterval(vuelto-(vuelto-1),(vuelto-1));
        }
    }else{
        do {
            opc2 = randomIntFromInterval(vuelto+1,vuelto+21);
        }while (opc1 == opc2);
    }
    var opciones = [opc1, vuelto, opc2];
    opciones = shuffle(opciones);

    return opciones;
}

function fillSpanWithCorrectFontSize( $selector, explicitWidth, explicitHeight, colorToShow ){

    $.each( $selector, function(key, value) {
        $(value).textfill({
            explicitWidth : explicitWidth,
            explicitHeight : explicitHeight,
            minFontPixels: 1,
            maxFontPixels: -1,
            debug: false,
            fail: function(){
                $selector.children().css("font-size", "5vh");
            }
        });
    });
    $selector.css("color", colorToShow);
};

var productos = {

    chocoShot_7Pe : {"rutaImg":"../img/prod/barraShot.png", "precio":7 },
    chocoShot_10Pe : {"rutaImg":"../img/prod/barraShot.png", "precio":10 },
    chocoShot_20Pe : {"rutaImg":"../img/prod/barraShot.png", "precio":20 },

    halls_2pe : {"rutaImg":"../img/prod/halls.png", "precio":2 },
    halls_7pe : {"rutaImg":"../img/prod/halls.png", "precio":7 },
    halls_5pe : {"rutaImg":"../img/prod/halls.png", "precio":5 },

    lilaPause_10pe : {"rutaImg":"../img/prod/lilaPause.png", "precio":10 },
    lilaPause_5pe : {"rutaImg":"../img/prod/lilaPause.png", "precio":5 },

    glincoln_15pe : {"rutaImg":"../img/prod/lincoln.png", "precio":15 },
    glincoln_20pe : {"rutaImg":"../img/prod/lincoln.png", "precio":20 },

    tita_5pe : {"rutaImg":"../img/prod/tita.png", "precio":5 },
    tita_2pe : {"rutaImg":"../img/prod/tita.png", "precio":2 },
    tita_7pe : {"rutaImg":"../img/prod/tita.png", "precio":7 },
    tita_4pe : {"rutaImg":"../img/prod/tita.png", "precio":4 },

    beldV_3pe : {"rutaImg":"../img/prod/beld-v.png", "precio":3 },
    beldV_5pe : {"rutaImg":"../img/prod/beld-v.png", "precio":5 },
    beldN_4pe : {"rutaImg":"../img/prod/beld-n.png", "precio":4 },
    beldN_10pe : {"rutaImg":"../img/prod/beld-n.png", "precio":10 },

    oreo_18pe : {"rutaImg":"../img/prod/oreo.png", "precio":18 },
    oreo_12pe : {"rutaImg":"../img/prod/oreo.png", "precio":12 }

};

var mediosDePago = {
    moneda05 : {"rutaImg":"../img/mon/5.png", "valor":0.05, "frase": "LA MONEDA", "tipo":"moneda", "esMoneda": "true"},

    moneda10 : {"rutaImg":"../img/mon/10.png", "valor":0.10, "frase": "LA MONEDA", "tipo":"moneda", "esMoneda": "true"},

    moneda25 : {"rutaImg":"../img/mon/25.png", "valor":0.25, "frase": "LA MONEDA", "tipo":"moneda", "esMoneda": "true"},

    moneda50 : {"rutaImg":"../img/mon/50.png", "valor":0.50, "frase": "LA MONEDA", "tipo":"moneda", "esMoneda": "true"},


    moneda1 : {"rutaImg":"../img/mon/1.png", "valor":1, "frase": "LA MONEDA", "tipo":"moneda", "esMoneda": "true"},
    moneda2 : {"rutaImg":"../img/mon/2.png", "valor":2, "frase": "LA MONEDA", "tipo":"moneda", "esMoneda": "true" },
    bill2 : {"rutaImg":"../img/bill/2f-s.png", "valor":2, "frase": "EL BILLETE", "tipo":"billete", "esMoneda": "false" },
    bill5 : {"rutaImg":"../img/bill/5f-s.png", "valor":5, "frase": "EL BILLETE", "tipo":"billete", "esMoneda": "false" },
    bill10 : {"rutaImg":"../img/bill/10f-s.png", "valor":10, "frase": "EL BILLETE", "tipo":"billete", "esMoneda": "false" },
    bill20 : {"rutaImg":"../img/bill/20f-s.png", "valor":20, "frase": "EL BILLETE", "tipo":"billete", "esMoneda": "false" },
    bill50 : {"rutaImg":"../img/bill/50f-s.png", "valor":50, "frase": "EL BILLETE", "tipo":"billete", "esMoneda": "false" },
    bill100 : {"rutaImg":"../img/bill/100f-s.png", "valor":100, "frase": "EL BILLETE", "tipo":"billete", "esMoneda": "false" }

};

var variantesDePago = {

    monedas:{
                        "2":[   mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.moneda1
                            ],
                        "3":[   mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda1
                            ],
                        "4":[   mediosDePago.moneda1, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda1
                            ],
                        "5":[   mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda1
                            ],
                        "6":[   mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda1
                            ],
                        "7":[   mediosDePago.moneda2, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda1
                            ],
                        "8":[   mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda2
                            ],
                        "9":[   mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda2
                            ],
                        "10":[  mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda2
                            ],
                        "11":[  mediosDePago.moneda2, mediosDePago.moneda2,
                                mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda2
                            ],
                        "12":[  mediosDePago.moneda2, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.moneda2
                            ]
                   },

    billetes:{
                        "4":[   mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "5":[   mediosDePago.bill2,  mediosDePago.bill2,
                                mediosDePago.bill50, mediosDePago.bill5,
                                mediosDePago.bill5,  mediosDePago.bill2
                            ],
                        "6":[   mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill2
                            ],
                        "7":[   mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5
                            ],
                        "8":[   mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill10
                            ],
                        "9":[   mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "10":[  mediosDePago.bill100, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill5
                            ],
                        "11":[  mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill2
                            ],
                        "12":[  mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill20
                            ],
                        "13":[  mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill2
                            ],
                        "14":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "15":[  mediosDePago.bill5, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill5
                            ],
                        "16":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "17":[  mediosDePago.bill5, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "18":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "19":[  mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill5
                            ],
                        "20":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill100
                            ],
                        "21":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "22":[  mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill2
                            ],
                        "23":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill2, mediosDePago.bill2
                            ],
                        "24":[  mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "25":[  mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "26":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill2, mediosDePago.bill20
                            ],
                        "27":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill5
                            ],
                        "28":[  mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill2, mediosDePago.bill2
                            ],
                        "29":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "30":[  mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill50
                            ],
                        "31":[  mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.bill50
                            ],
                        "32":[  mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "33":[  mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill2
                            ],
                        "34":[  mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill2, mediosDePago.bill10
                            ],
                        "35":[  mediosDePago.bill5, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill10
                            ],
                        "36":[  mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "37":[  mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill10
                            ],
                        "38":[  mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill2
                            ],
                        "39":[  mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill50, mediosDePago.bill5
                            ],
                        "40":[  mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill10, mediosDePago.bill20,
                                mediosDePago.bill20, mediosDePago.bill5
                            ]
                 },

    combinado:{
                        "4":[   mediosDePago.bill2, mediosDePago.moneda2,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "5":[   mediosDePago.moneda2,  mediosDePago.bill2,
                                mediosDePago.bill50, mediosDePago.bill5,
                                mediosDePago.bill5,  mediosDePago.moneda1
                            ],
                        "6":[   mediosDePago.moneda1, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.moneda2
                            ],
                        "7":[   mediosDePago.bill2, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.moneda2,
                                mediosDePago.moneda1, mediosDePago.bill5
                            ],
                        "8":[   mediosDePago.bill2, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.moneda2
                            ],
                        "9":[   mediosDePago.bill2, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.moneda2, mediosDePago.moneda1
                            ],
                        "10":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "11":[  mediosDePago.moneda2, mediosDePago.bill10,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill2
                            ],
                        "12":[  mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "13":[  mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.moneda1, mediosDePago.moneda2
                            ],
                        "14":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "15":[  mediosDePago.bill2, mediosDePago.moneda2,
                                mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "16":[  mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.moneda1,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "17":[  mediosDePago.bill50, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "18":[  mediosDePago.moneda1, mediosDePago.bill20,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "19":[  mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill10
                            ],
                        "20":[  mediosDePago.moneda1, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "21":[  mediosDePago.bill5, mediosDePago.moneda2,
                                mediosDePago.bill20, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.moneda1
                            ],
                        "22":[  mediosDePago.moneda2, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.moneda1
                            ],
                        "23":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "24":[  mediosDePago.bill10, mediosDePago.moneda2,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "25":[  mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill10
                            ],
                        "26":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.moneda2, mediosDePago.bill20
                            ],
                        "27":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "28":[  mediosDePago.bill10, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.moneda2, mediosDePago.bill10
                            ],
                        "29":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.moneda1,
                                mediosDePago.moneda1, mediosDePago.moneda2
                            ],
                        "30":[  mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.moneda2
                            ],
                        "31":[  mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill10
                            ],
                        "32":[  mediosDePago.bill20, mediosDePago.moneda2,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill2
                            ],
                        "33":[  mediosDePago.bill2, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "34":[  mediosDePago.moneda2, mediosDePago.bill2,
                                mediosDePago.moneda1, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "35":[  mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.moneda2, mediosDePago.bill10
                            ],
                        "36":[  mediosDePago.moneda2, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "37":[  mediosDePago.bill20, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill10
                            ],
                        "38":[  mediosDePago.bill10, mediosDePago.moneda2,
                                mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.moneda1, mediosDePago.bill5
                            ],
                        "39":[  mediosDePago.moneda2, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.moneda2,
                                mediosDePago.moneda1, mediosDePago.bill5
                            ],
                        "40":[  mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5
                            ]
                },

    billetesVuelto:{
                        "4":[   mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill50,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "5":[   mediosDePago.bill2,  mediosDePago.bill2,
                                mediosDePago.bill50, mediosDePago.bill5,
                                mediosDePago.bill5,  mediosDePago.bill10
                            ],
                        "6":[   mediosDePago.bill10, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill50, mediosDePago.bill2
                            ],
                        "7":[   mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill5
                            ],
                        "8":[   mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill10
                            ],
                        "9":[   mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "10":[  mediosDePago.bill100, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill5
                            ],
                        "11":[  mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "12":[  mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill2, mediosDePago.bill50,
                                mediosDePago.bill10, mediosDePago.bill20
                            ],
                        "13":[  mediosDePago.bill10, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill2
                            ],
                        "14":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "15":[  mediosDePago.bill5, mediosDePago.bill50,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill100
                            ],
                        "16":[  mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill20
                            ],
                        "17":[  mediosDePago.bill5, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill50,
                                mediosDePago.bill10, mediosDePago.bill2
                            ],
                        "18":[  mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "19":[  mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill20
                            ],
                        "20":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill100
                            ],
                        "21":[  mediosDePago.bill5, mediosDePago.bill100,
                                mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "22":[  mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill5, mediosDePago.bill2
                            ],
                        "23":[  mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill2, mediosDePago.bill50
                            ],
                        "24":[  mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill100, mediosDePago.bill50,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "25":[  mediosDePago.bill20, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.bill5,
                                mediosDePago.bill100, mediosDePago.bill50
                            ],
                        "26":[  mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill100, mediosDePago.bill20
                            ],
                        "27":[  mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "28":[  mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "29":[  mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill100
                            ],
                        "30":[  mediosDePago.bill100, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill50
                            ],
                        "31":[  mediosDePago.bill2, mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "32":[  mediosDePago.bill20, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill100, mediosDePago.bill20
                            ],
                        "33":[  mediosDePago.bill10, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill50
                            ],
                        "34":[  mediosDePago.bill10, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill100, mediosDePago.bill10
                            ],
                        "35":[  mediosDePago.bill50, mediosDePago.bill10,
                                mediosDePago.bill10, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill100
                            ],
                        "36":[  mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "37":[  mediosDePago.bill20, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill50,
                                mediosDePago.bill100, mediosDePago.bill10
                            ],
                        "38":[  mediosDePago.bill10, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill50,
                                mediosDePago.bill20, mediosDePago.bill100
                            ],
                        "39":[  mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill50,
                                mediosDePago.bill20, mediosDePago.bill100
                            ],
                        "40":[  mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill50, mediosDePago.bill20,
                                mediosDePago.bill20, mediosDePago.bill100
                            ]
                },

    combinadoVuelto:{
                        "4":[   mediosDePago.bill2, mediosDePago.moneda2,
                                mediosDePago.bill5, mediosDePago.bill2,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "5":[   mediosDePago.moneda2,  mediosDePago.bill2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10,  mediosDePago.moneda1
                            ],
                        "6":[   mediosDePago.moneda1, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "7":[   mediosDePago.bill2, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.moneda2,
                                mediosDePago.moneda1, mediosDePago.bill5
                            ],
                        "8":[   mediosDePago.bill50, mediosDePago.bill20,
                                mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "9":[   mediosDePago.bill2, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.moneda2, mediosDePago.bill50
                            ],
                        "10":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill20, mediosDePago.bill50,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "11":[  mediosDePago.moneda2, mediosDePago.bill10,
                                mediosDePago.bill2, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill20
                            ],
                        "12":[  mediosDePago.moneda2, mediosDePago.bill50,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "13":[  mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill50, mediosDePago.bill10,
                                mediosDePago.moneda1, mediosDePago.moneda2
                            ],
                        "14":[  mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.moneda2, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "15":[  mediosDePago.bill2, mediosDePago.bill20,
                                mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "16":[  mediosDePago.moneda2, mediosDePago.bill50,
                                mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill10, mediosDePago.bill20
                            ],
                        "17":[  mediosDePago.bill50, mediosDePago.bill20,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda1
                            ],
                        "18":[  mediosDePago.moneda1, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "19":[  mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill50, mediosDePago.bill10
                            ],
                        "20":[  mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill50,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "21":[  mediosDePago.bill5, mediosDePago.moneda2,
                                mediosDePago.bill20, mediosDePago.bill10,
                                mediosDePago.bill50, mediosDePago.moneda1
                            ],
                        "22":[  mediosDePago.moneda2, mediosDePago.bill10,
                                mediosDePago.bill20, mediosDePago.bill20,
                                mediosDePago.bill5, mediosDePago.moneda1
                            ],
                        "23":[  mediosDePago.bill50, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill20
                            ],
                        "24":[  mediosDePago.bill10, mediosDePago.bill100,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill50, mediosDePago.bill20
                            ],
                        "25":[  mediosDePago.bill20, mediosDePago.bill50,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill10
                            ],
                        "26":[  mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.bill50, mediosDePago.bill2,
                                mediosDePago.moneda2, mediosDePago.bill20
                            ],
                        "27":[  mediosDePago.bill50, mediosDePago.moneda1,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.moneda2
                            ],
                        "28":[  mediosDePago.bill10, mediosDePago.bill10,
                                mediosDePago.bill5, mediosDePago.bill20,
                                mediosDePago.moneda2, mediosDePago.bill10
                            ],
                        "29":[  mediosDePago.bill5, mediosDePago.bill50,
                                mediosDePago.bill20, mediosDePago.bill10,
                                mediosDePago.moneda1, mediosDePago.moneda2
                            ],
                        "30":[  mediosDePago.moneda1, mediosDePago.bill5,
                                mediosDePago.bill10, mediosDePago.bill50,
                                mediosDePago.bill20, mediosDePago.moneda2
                            ],
                        "31":[  mediosDePago.moneda2, mediosDePago.moneda1,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill100
                            ],
                        "32":[  mediosDePago.bill20, mediosDePago.moneda2,
                                mediosDePago.bill5, mediosDePago.bill10,
                                mediosDePago.bill50, mediosDePago.bill100
                            ],
                        "33":[  mediosDePago.bill50, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "34":[  mediosDePago.moneda2, mediosDePago.bill5,
                                mediosDePago.moneda1, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill50
                            ],
                        "35":[  mediosDePago.moneda1, mediosDePago.moneda2,
                                mediosDePago.bill50, mediosDePago.bill20,
                                mediosDePago.bill100, mediosDePago.bill10
                            ],
                        "36":[  mediosDePago.moneda2, mediosDePago.bill50,
                                mediosDePago.bill10, mediosDePago.bill5,
                                mediosDePago.bill20, mediosDePago.bill10
                            ],
                        "37":[  mediosDePago.bill20, mediosDePago.bill50,
                                mediosDePago.bill5, mediosDePago.moneda1,
                                mediosDePago.moneda2, mediosDePago.bill10
                            ],
                        "38":[  mediosDePago.bill10, mediosDePago.moneda2,
                                mediosDePago.bill20, mediosDePago.bill5,
                                mediosDePago.bill100, mediosDePago.bill50
                            ],
                        "39":[  mediosDePago.moneda2, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill100,
                                mediosDePago.bill50, mediosDePago.bill5
                            ],
                        "40":[  mediosDePago.moneda2, mediosDePago.bill20,
                                mediosDePago.bill10, mediosDePago.bill100,
                                mediosDePago.bill20, mediosDePago.bill50
                            ]
                }
};

var audios = {
    precio_justo: {
        cuanta_plata_tenes:"audio/precio_justo/cuanta_plata_tenes.mp3",
        arrastra_dos_golosinas: "audio/precio_justo/arrastra_dos_golosinas.mp3",
        consigna: "audio/precio_justo/consigna.mp3",
        dedos_o_calculadora: "audio/precio_justo/dedos_o_calculadora.mp3",
        dos_golosinas_sin_vuelto: "audio/precio_justo/dos_golosinas_sin_vuelto.mp3",
        elegi_dos_golosinas: "audio/precio_justo/elegi_dos_golosinas.mp3",
        marca_si_o_no: "audio/precio_justo/marca_si_o_no.mp3",
        paga_las_golosinas: "audio/precio_justo/paga_las_golosinas.mp3",
        pensa_y_calcula: "audio/precio_justo/pensa_y_calcula.mp3",
        que_billete_me_sirve: "audio/precio_justo/que_billete_me_sirve.mp3",
        que_billetes_necesito: "audio/precio_justo/que_billetes_necesito.mp3",
        recorda_no_dan_vuelto: "audio/precio_justo/recorda_no_dan_vuelto.mp3",
        senala_la_golosina: "audio/precio_justo/senala_la_golosina.mp3",
        senalalo: "audio/precio_justo/senalalo.mp3"
    },
    aciertos: {
        elegiste_muy_bien: "audio/aciertos/elegiste_muy_bien.mp3"
    },
    errores: {
        fijate_bien: "audio/errores/fijate_bien.mp3",
        sin_vuelto: "audio/errores/sin_vuelto.mp3",
        intenta_de_nuevo: "audio/errores/intenta_de_nuevo.mp3"
    },
    con_vuelto: {
        me_alcanza: "audio/con_vuelto/me_alcanza.mp3",
        que_golosina_alcanza: "audio/con_vuelto/que_golosina_alcanza.mp3",
        cuanto_daran_de_vuelto: "audio/con_vuelto/cuanto_daran_de_vuelto.mp3",
        elige_golosinas_para_comprar: "audio/con_vuelto/elige_golosinas_para_comprar.mp3",
        arrastra_dos_golosinas: "audio/precio_justo/arrastra_dos_golosinas.mp3",
        arrastra_a_la_bolsa_1_golosina: "audio/con_vuelto/arrastra-a-la-bolsa-1-golosina.mp3",
        presiona_listo: "audio/con_vuelto/presiona_listo.mp3",
        presiona_pagar: "audio/con_vuelto/presiona_pagar.mp3",
        con_que_billete_pagas: "audio/con_vuelto/con_que_billete_pagas.mp3",
        elegi_billete_y_paga: "audio/con_vuelto/elegi_billete_y_paga.mp3",
        elegi_dinero_y_paga: "audio/con_vuelto/elegi_dinero_y_paga.mp3"
    },
    contando_dinero: {
        ayuda_dedos: "audio/contando_dinero/ayuda_dedos.mp3",
        cuanto_dinero_tenes: "audio/contando_dinero/cuanto_dinero_tenes.mp3",
        que_monedas_billetes: "audio/contando_dinero/que_monedas_billetes.mp3",
        senala_la_cantidad_correcta: "audio/contando_dinero/senala_la_cantidad_correcta.mp3"
    },
    intro: {
        conocer_monedas_billetes: "audio/intro/conocer_monedas_billetes.mp3",
        empezamos: "audio/intro/empezamos.mp3",
        guia_menu_principal: "audio/intro/guia_menu_principal.mp3",
        vamos_a_conocerlos: "audio/intro/vamos_a_conocerlos.mp3"
    },
    monedas: {
        monedas_info: "audio/monedas/monedas_info03.mp3",
        conocer_otra_moneda: "audio/monedas/conocer_otra_moneda.mp3",
        moneda_5centavos: "audio/monedas/moneda_5centavos.mp3",
        moneda_10centavos: "audio/monedas/moneda_10centavos.mp3",
        moneda_1peso: "audio/monedas/moneda_1peso.mp3",
        moneda_25centavos: "audio/monedas/moneda_25centavos.mp3",
        moneda_2pesos: "audio/monedas/moneda_2pesos.mp3",
        moneda_50centavos: "audio/monedas/moneda_50centavos.mp3",
        monedas_centavos: "audio/monedas/monedas_centavos.mp3",
        vamos_a_conocerlas: "audio/monedas/vamos_a_conocerlas.mp3",

        cual_es_la_moneda_2pesos: "audio/monedas/cual_es_la_moneda_2pesos.mp3",
        cual_es_la_moneda_1peso: "audio/monedas/cual_es_la_moneda_de_1peso.mp3",
        cual_es_la_moneda_50cent: "audio/monedas/cual_es_la_moneda_de_50cent.mp3",
        cual_es_la_moneda_25cent: "audio/monedas/cual_es_la_moneda_de_25cent.mp3",
        cual_es_la_moneda_10cent: "audio/monedas/cual_es_la_moneda_de_10cent.mp3"

    },
    billetes: {
        los_billetes: "audio/billetes/los_billetes.mp3",
        billete_2pesos: "audio/billetes/billete_2pesos.mp3",
        billete_5pesos: "audio/billetes/billete_5pesos.mp3",
        billete_10pesos: "audio/billetes/billete_10pesos.mp3",
        billete_20pesos: "audio/billetes/billete_20pesos.mp3",
        billete_50pesos: "audio/billetes/billete_50pesos.mp3",
        billete_100pesos: "audio/billetes/billete_100pesos.mp3",
        billete_500pesos: "audio/billetes/billete_500pesos.mp3",

        bill2: "audio/billetes/cual_es_el_billete_2pesos.mp3",
        bill5: "audio/billetes/cual_es_el_billete_5pesos.mp3",
        bill10: "audio/billetes/cual_es_el_billete_10pesos.mp3",
        bill20: "audio/billetes/cual_es_el_billete_20pesos.mp3",
        bill50: "audio/billetes/cual_es_el_billete_50pesos.mp3",
        bill100: "audio/billetes/cual_es_el_billete_100pesos.mp3"
    },
    monedas_y_billeres_en_argentina: "audio/argentina.mp3"
};
