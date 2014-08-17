var Colapsable = (function () {
  
    
    
    var escuchadoresColapsable = [];
    
    function buscaPrimeroEnHijosDePadres(jq, selector, original) {


        function esMismoHTMLElement( jq1, jq2 ){
            var o1 = $(jq1);
            var o2 = $(jq2);

            if( o1.size() != 1 ){
                throw "Solo se admite un elemento en jq1:" + o1.size() + " -- " + jq1;
            }

            if( o2.size() != 1 ){
                throw "Solo se admite un elemento en jq2:" + o2.size() + " -- " + jq2;
            }

            return o1.get(0) == o2.get(0);

        }


        function esPadreDe( padre, hijo ){

            console.log( "esPadreDe:" );
            console.log( "  padre:" + toLog(padre) );
            console.log( "  hijo:" + toLog(hijo) );

            var padres = $(hijo).parents();
            for( var i = 0 ; i < padres.size(); i++ ){
                var p = padres.get(i);
                if( esMismoHTMLElement(p,padre) ){
                    return true;
                }
            }
            return false;
        }

        var sib = $(jq).siblings();
        for( var s = 0 ; s < sib.size() ; s++ ){
            var sibling = sib.get(s);
            var found = $(sibling).find(selector);
            for( var i = 0 ; i < found.size() ; i++ ){
                var f = found.get(i);
                if( !esPadreDe( original, f ) ){
                    return f;
                }
            }
        }

        var parent = $(jq).parent();
        if( parent.size() != 0 ){
            return buscaPrimeroEnHijosDePadres(parent,selector,original);
        }
        return null;
    }

    
    
    function convertirEnLlaveExpandible(id){

        var llave = $("<div>-</div>").toggleClass( "llave-expandible" );

        $(id).addClass("oculto-por-llave");
        llave.insertBefore($(id));

        function llaveDeColapsable(id){
            var ret = $(id).prev();
            if( !ret.hasClass("llave-expandible") ){
                throw "La llave no tiene la clase adecuada:" + ret.prop("class");
            }
            return ret;
        }

        function colapsableDeLlave(llave){
            var ret = $(llave).next();
            if( !ret.hasClass("colapsable") ){
                throw "El colapsable no tiene la clase adecuada:" + ret.prop("class");
            }
            return ret;
        }

        function actualizaOrientacionDeTodasLasLlaves(){
            var llaves = $(".llave-expandible");
            llaves.each( function(number,llave){
                actualizaOrientacion( llave, colapsableDeLlave(llave) );
            });
        }

        llave.click( function(){
            muestraOcultaLlave(llave,id);
        });



        function actualizaOrientacion( llave, elem ){
            var lbb = $(llave).offset();
            var ebb = $(elem).offset();

            console.log( "llave lbb: top" + lbb.top + " -- left:" + lbb.left );
            console.log( "elem  ebb: top" + ebb.top + " -- left:" + ebb.left );

            if( lbb.top < ebb.top ){
                console.log( "add abajo" );
                $(llave).addClass( "abajo" );
            }
            else{
                console.log( "remove abajo" );
                $(llave).removeClass( "abajo" );
            }
        }

        function muestraOcultaLlave(llave,elem){
            var delay = 200;
            var total = buscaPrimeroEnHijosDePadres(llave,".nota",llave.parent() );
            total = $(total);
            console.log("total:" + total );
            console.log( "total de llave:" + total.prop("class") );

            var yaCambiado = function(){
                console.log( "tras abrir o cerrar llave" );
                actualizaOrientacionDeTodasLasLlaves();
            }

            if( llave.html() == "-" ){
                llave.html("+");
                llave.addClass("llave-cerrada" );
                $(elem).addClass("oculto-por-llave");
                $(elem).hide(delay,yaCambiado);
                total.removeClass("calculado");
            }
            else{
                llave.html("-");
                llave.removeClass("llave-cerrada" );
                $(elem).removeClass("oculto-por-llave");
                $(elem).show(delay,yaCambiado);
                total.addClass("calculado");
            }

            
            for( var i in escuchadoresColapsable ){
                escuchadoresColapsable[i](llave);
            }
            
        }

        muestraOcultaLlave(llave,id);
        $(window).resize( function(){
            actualizaOrientacionDeTodasLasLlaves( llave,id );
        });
    }


    function actualizaLlavesExpandibles(){
        $(".colapsable").each( function(number,elem){
            convertirEnLlaveExpandible(elem);
        });
    }

  
    return {
        actualizaLlavesExpandibles : actualizaLlavesExpandibles,
        avisaColapsadoExpandido : function( handler ){
            escuchadoresColapsable.push(handle);    
        }
        
    };
    
    
    
    
})()