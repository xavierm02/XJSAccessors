( function ( ) {
    var undefined;
    
    function toArray( array ) {
        return [ ].slice.call( array );
    }
    
    function XJSAccessors( object, parentStorage ) {
        if ( arguments.length < 2 ) {
            parentStorage = object;
        }
        this.object = object;
        var storage = this.storage = Object.create( parentStorage );
        var getters = this.getters = { };
        var setters = this.setters = { };
        var isProtected = this.isProtected = { };
        
        var that = this;
        
        object.get = function ( name ) {
            return that.hasGetter( name ) ? that.getGetter( name ).apply( object, arguments ) : storage[ name ];
        };
        object.set = function ( name, value ) {
            if ( that.getIsProtected( name ) ) {
                throw new Error( name + ' is a protected property and therefore can not have its value set!' );
            } else {
                return storage[ name ] = that.hasSetter( name ) ? that.getSetter( name ).apply( object, arguments ) : value;
            }
        };
        object.isProtected = function ( name ) {
            return that.getIsProtected( name );
        };
        object.forIn = function( callback, that ) {
            if ( argument.length < 2 ) {
                that = this;
            }
            for ( var name in this ) {
                callback.call( that, this.get( name ), name, this );
            }
        };
    }
    
    var XJSAccessorsPrototype = XJSAccessors.prototype;
    
    XJSAccessorsPrototype.get = function ( name ) {
        return this.storage[ name ];
    };
    XJSAccessorsPrototype.set = function ( name, value ) {
        return this.storage[ name ] = value;
    };
    
    XJSAccessorsPrototype.getGetter = function ( name ) {
        return this.getters[ name ];
    };
    XJSAccessorsPrototype.setGetter = function ( name, value ) {
        if ( typeof value === 'function' ) {
            return this.getters[ name ] = value;
        } else {
            throw new Error( 'Getter given for ' + name + ' must be a function!' );
        }
    };
    XJSAccessorsPrototype.deleteGetter = function ( name ) {
        return delete this.getters[ name ];
    };
    XJSAccessorsPrototype.hasGetter = function ( name ) {
        return this.getters.hasOwnProperty( name );
    };
    
    XJSAccessorsPrototype.getSetter = function ( name ) {
        return this.setters[ name ];
    };
    XJSAccessorsPrototype.setSetter = function ( name, value ) {
        if ( typeof value === 'function' ) {
            if ( this.getIsProtected( name ) ) {
                throw new Error( name + ' is a protected property and therefore can not have a setter!' );
            } else {
                return this.setters[ name ] = value;
            }
        } else {
            throw new Error( 'Setter given for ' + name + ' must be a function!' );
        }
    };
    XJSAccessorsPrototype.deleteSetter = function ( name ) {
        return delete this.setters[ name ];
    };
    XJSAccessorsPrototype.hasSetter = function ( name ) {
        return this.setters.hasOwnProperty( name );
    };
    
    XJSAccessorsPrototype.defineProperty = function ( p ) {
        if ( ! p.hasOwnProperty( 'name' ) ) {
            throw new Error( 'defineProperty\'s parameter needs a name property!' );
        } else {
            var name = p.name + '';
            if ( p.hasOwnProperty( 'value' ) ) {
                this.set( name, p.value );
            }
            if ( p.hasOwnProperty( 'getter' ) ) {
                this.setGetter( name, p.getter );
            }
            if ( p.hasOwnProperty( 'setter' ) ) {
                this.setSetter( name, p.setter );
            }
            if ( p.hasOwnProperty( 'isProtected' ) ) {
                this.setIsProtected( name, p.isProtected );
            }
        }
    };
    
    XJSAccessorsPrototype.defineProperties = function ( properties ) {
        properties.forEach( function ( property ) {
            this.defineProperty( property );
        }, this );
    };
    
    XJSAccessorsPrototype.protect = function ( name ) {
        if ( this.hasSetter( name ) ) {
            throw new Error( name + ' has a setter and therefore can not be protected!' );
        } else {
            return this.isProtected[ name ] = true;
        }
    };
    XJSAccessorsPrototype.unprotect = function ( name ) {
        return delete this.isProtected[ name ];
    };
    XJSAccessorsPrototype.getIsProtected = function ( name ) {console.log(this.isProtected)
        return this.isProtected.hasOwnProperty( name );
    };
    XJSAccessorsPrototype.setIsProtected = function ( name, isProtected ) {
        if ( isProtected ) {
            this.protect( name );
        } else {
            this.unprotect( name );
        }
    };
    
    this.XJSAccessors = XJSAccessors;
} )( );