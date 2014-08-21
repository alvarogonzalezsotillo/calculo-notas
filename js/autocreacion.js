
var Autocreacion = (function(){
    
    function debug(o){
        console.log(o);
    }
    
    
    function UnaAutocreacion(templateElem, fieldSelector, classToRemove, removeSelector, creationCallback, removeCallback){
        var templateCopy = $(templateElem).clone();
        var parentElem = $(templateElem).parent();

        debug( "removeSelector:" + removeSelector );
        
        var lineOf = function(field){
            return $(field).parent();
        } 
        
        var removeLine = function(line){
            debug( "removeLine:" + line );
            if( line.hasClass(classToRemove) ){
                return;
            }
            $(line).remove();
            if( removeCallback ){
                removeCallback(line);
            }
        }
        
        var fieldChanged = function(jqEvent){
            var field = $(jqEvent.currentTarget);

            var line = lineOf(field);

            debug( "line:" + $(line).prop("class" ) );
            
            if( !line.hasClass(classToRemove) ){
                debug( "Ya no tiene la clase:" + classToRemove );
                return;
            }

            line.removeClass(classToRemove);
            var newLine = $(templateCopy).clone();
            $(fieldSelector,newLine).change( fieldChanged )
            $(removeSelector,newLine).click( function(){
                debug( "borrando linea" );
                removeLine( newLine );
            });

            $(parentElem).append(newLine);
            
            if( creationCallback ){
                creationCallback(newLine);
            }

        }
        
        

        
        $(fieldSelector,templateElem).change( fieldChanged )
        $(removeSelector,templateElem).click( function(){
            debug( "borrando linea inicial" );
            removeLine( templateElem );
        });
        
    }
    
    return{
        autocreacion: function(templateElem,fieldSelector,classToRemove,removeSelector){
            UnaAutocreacion(templateElem,fieldSelector,classToRemove,removeSelector);
        }
    };
    
})();