
var Autocreacion = (function(){
    
    function debug(o){
        console.log(o);
    }
    
    
    function UnaAutocreacion(templateElem,fieldSelector,classToRemove){
        this.templateElem = $(templateElem).clone();
        this.parentElem = $(templateElem).parent();
        this.fieldSelector = fieldSelector;
        this.classToRemove = classToRemove;

        var self = this;
        
        this.fieldChanged = function(jqEvent){
            var field = $(jqEvent.currentTarget);



            var line = self.lineOf(field);

            debug( "line:" + $(line).prop("class" ) );
            
            if( !line.hasClass(self.classToRemove) ){
                debug( "Ya no tiene la clase:" + self.classToRemove );
                return;
            }

            line.removeClass(self.classToRemove);
            var newLine = $(self.templateElem).clone();
            newLine = $(newLine);
            $(fieldSelector,newLine).change( self.fieldChanged )

            $(self.parentElem).append(newLine);

        }

        this.lineOf = function(field){
            return $(field).parent();
        } 
        
        $(fieldSelector,templateElem).change( this.fieldChanged )
        
    }
    
    return{
        autocreacion: function(templateElem,fieldSelector,classToRemove){
            return new UnaAutocreacion(templateElem,fieldSelector,classToRemove);
        }
    };
    
})();