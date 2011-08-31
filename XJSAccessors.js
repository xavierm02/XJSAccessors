( function ( ) {
    var undefined;
    
    function toArray( array ) {
        return [ ].slice.call( array );
    }
    
    function XJSProperty( p ) {
        if ( typeof p !== 'object' || ! p ) {
            throw new Error( 'defineProperty\'s parameter needs to be an object!' );
        } else if ( ! p.hasOwnProperty( 'name' ) ) {
            throw new Error( 'defineProperty\'s parameter needs a name property!' );
        } else {
            var name = p.name + '';
            this.name = name;
            if ( p.hasOwnProperty( 'value' ) ) {
                this.value = p.value;
            }
            if ( p.hasOwnProperty( 'getter' ) ) {
                this.getter = p.getter;
            }
            if ( p.hasOwnProperty( 'setter' ) ) {
                this.setter = p.setter;
            }
            // need isProtected
        }
    }
    
    function XJSAccessors( object, parentStorage ) {
        if ( arguments.length < 2 ) {
            parentStorage = object;
        }
        this.parentStorage = parentStorage;
        this.object = object;
        
        var properties = this.properties = { };
        
        var accessors = this;
        
        object.get = function ( name ) {
            if ( properties.hasOwnProperty( name ) ) {
                var property = properties[ name ];
                if ( property.hasOwnProperty( 'getter' ) ) {
                    return property.getter.apply( this, arguments );
                } else if ( property.hasOwnProperty( 'value' ) ) {
                    return property.value;
                }
            }
            return parentStorage[ name ];
        };
        object.set = function ( name, value ) {
            // need isProtected
            var property;
            if ( properties.hasOwnProperty( name ) ) {
                property = properties[ name ];
                if ( property.hasOwnProperty( 'setter' ) ) {
                    return property.value = property.settter.apply( this, arguments );
                } else {
                    return property.value = value;
                }
            } else {
                properties[ name ] = {
                    value: value
                };
                return value;
            }
        };
    }
    
    var XJSAccessorsPrototype = XJSAccessors.prototype;
    XJSAccessorsPrototype.defineProperty = function ( p ) {
        this.addProperty( new XJSProperty( p ) );
    };
    
    XJSAccessorsPrototype.defineProperties = function ( properties ) {
        properties.forEach( function ( property ) {
            this.defineProperty( property );
        }, this );
    };
    
    XJSAccessorsPrototype.addProperty = function ( property ) {
        this.setProperty( property.name, property );
    };
    XJSAccessorsPrototype.getProperty = function ( name ) {
        var properties = this.properties;
        if ( properties.hasOwnProperty( name ) ) {
            return properties[ name ];
        } else {
            return properties[ name ] = { };
        }
    };
    XJSAccessorsPrototype.setProperty = function ( name, property ) {
        this.properties[ name ] = property;
    };
    
    this.XJSAccessors = XJSAccessors;
} )( );