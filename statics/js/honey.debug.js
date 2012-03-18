/**
 *  
 *  open a debug panel
 *  show debugs
 *  
 *  honey.debug( msg, color )
 *
 *  color in firebug
 *      
 *      red ----- console.warn
 *      blue  --- console.info
 *      default - console.log
 *
 */

honey.def( function( H ) {
    
    //H.css( ROOT +'files/debug.css' );    
    H.debug = function( $msg, $color ) {
        
        if ( window.console ) {
            
            var method = { 
                red: 'warn',
                blue: 'info' 
            }

            console[ method[$color] || 'log' ]( $msg );
            
            return H;
        }

        var
        doc = document,
        msg = doc.createElement('p'),
        head = doc.getElementById('honey-debug-head') || doc.createElement('div'), 
        close = doc.getElementById('honey-debug-close') || doc.createElement('a'), 
        box = doc.getElementById('honey-debug') || doc.createElement('div'); 

        if (!doc.getElementById('honey-debug')) { 
            box.id = 'honey-debug';
            head.id = 'honey-debug-head';

            close.id = 'honey-debug-close';
            close.innerHTML = 'Close';
            close.href = "#";

            doc.body.appendChild(box);
            box.appendChild(head);
            head.appendChild(close);
            
            close.onclick = function() {
                box.style.display = 'none';
                return false;
            };

        }

        msg.innerHTML = $msg;
        msg.style.color = $color || 'gray';
        box.appendChild(msg);
        box.scrollTop = box.scrollHeight;

        return H;
    }

} );
