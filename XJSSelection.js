// This code is not meant to be used
// It is just here as a usecase
// Something similar will be developped in the future
// But at the moment, you shouldn't rely on it

( function ( ) {
    var undefined;
    var defaultWindow = this;
    
    function toArray( array ) {
        return [ ].slice.call( array );
    }
    
    function XJSSelection( window ) {
        if ( arguments.length < 1 ) {
            window = defaultWindow;
        }
        var selection;
        if ( typeof window.getSelection === "function" ) {
            selection = window.getSelection( );
        } else if ( window.document.selection ) {
            selection = window.document.selection;
        } else {
            throw new Error( 'Your JavaScript implementation does not support "window.getSelection".' );
        }
        var accessors = new XJSAccessors( this, selection );
        accessors.defineProperties( [
            {
                name: 'selection',
                value: selection,
                isProtected: true
            },
            {
                name: 'range',
                isProtected: true,
                getter: function ( name, index ) {
                    if ( arguments.length < 2 ) {
                        index = 0;
                    } else {
                        index = +index;
                    }
                    if ( index < 0 || index >= this.get( 'rangeCount' ) ) {
                        throw new Error( 'There is no range at index ' + index + '!' );
                    }
                    var range;
                    if ( typeof selection.getRangeAt === 'function' ) {
                        range = selection.getRangeAt( index );
                    } else if ( typeof selection.createRangeCollection === 'function' ) {
                        range = selection.createRangeCollection( )[ index ];
                    } else {
                        throw new Error( 'Your JavaScript implementation does not support "Selection.prototype.getRangeAt".' );
                    }
                    return new XJSRange( window, range );
                }
            }
        ] );
        if ( selection.rangeCount === undefined ) {
            accessors.setGetter( 'rangeCount', function ( ) {
                if ( selection.createRangeCollection !== undefined ) {
                    return selection.createRangeCollection( ).length;
                } else {
                    throw new Error( 'Your JavaScript implementation does not support "Selection.rangeCount".' );
                }
            } );
        }
    }
    
    function XJSRange( window, range ) {
        new XJSAccessors( this, range ).defineProperties( [
            {
                name: 'range',
                value: range
            }
        ] );
    }
    
    this.XJSSelection = XJSSelection;
} )( );