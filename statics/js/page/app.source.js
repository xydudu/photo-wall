//for photo-wall
//
honey.def( function( H ) {
    
    /*
    var app = function() {
        
        $( '#container' ).isotope({
            itemSelector: '.item',
            layoutMode: 'masonry'
        });

    };
    */
    
    /*
    var app = Backbone.View.extend({
		tagName: 'h3',
		events: {
			'click': 'showWorld'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html( 'Hello' );
			return this;
		},
		showWorld: function() {
			this.$el.append( ' World' );
			return this;
		}
	});	
    */

    var Model = Backbone.Model.extend({
        initialize: function() {
            this.loadImg(); 
            this.on( 'change', this.loadImg, this );
        },
        loadImg: function() {
            if ( !this.get( 'src' ) ) return;
            var 
            that = this,
            img = new Image();
            img.onload = function() {
                that.trigger( 'loaded' );
            }
            img.onerror = function() {
                that.trigger( 'imgerr' );
            }
            img.src = '/api/img/'+ this.get( 'src' );
        },
        urlRoot: "/api/view"
    });

    var Collection = Backbone.Collection.extend({
        initialize: function() {
            console.log( 'Collection OK' );
        },
        model: Model,
        url: '/api/list'
    });

    var ItemView = Backbone.View.extend({
        tagName: 'li',
        template: _.template( $('#tmpl-item').html() ),
        render: function() {
            var 
            json = this.model.toJSON(),
            html = this.template( json );
            this.$el.html( html );
            return this;
        }
    });

    var CollectionView = Backbone.View.extend({
        tagName: 'ul',
        initialize: function() {
            this.itemLoadNum = 0;
        },
        renderItem: function( $model ) {
            var itemview = new ItemView({
                model: $model
            }); 
            $model.on( 'loaded', this.itemLoaded, this );
            this.$el.append( itemview.render().el );
        },
        itemLoaded: function() {
            this.itemLoadNum ++;
            if (this.itemLoadNum == this.collection.length) {
                this.trigger( 'allItemLoaded' );
            }
        },
        render: function() {
            this.collection.each( this.renderItem, this );
            return this;
        }
    });
    
    /*
    var linkView = Backbone.View.extend({
        tagName: 'a',
        //events: {
        //    'click': 'goView'
        //},
        initialize: function() {
            this.render();
        },
        goView: function() {
            Backbone.history.navigate( 'view/1', {trigger: true} ); 
        },
        render: function() {
            this.$el.attr('href', '#/view/2').html('link');
            return this;
        } 
    });
    */

    var App = Backbone.Router.extend({
        routes: {
            "/view/:pid": "view",
            "*actions": "list"
        },
        initialize: function() {
            this.loadingBox = $( '#loading' );
            this.container = $( '#container' );
        },

        loading: function( hide ) {
            hide
                ? (this.container.show(), this.loadingBox.hide())
                : (this.container.hide(), this.loadingBox.show());     
        },

        list: function() {
            console.log( 'list' );
            this.loading();
            var 
            that = this,
            container = that.container,
            collection = new Collection(),
            listview = new CollectionView({
                collection: collection
            }); 
            collection.on( 'reset', function(){
                var el = this.render().el;
                container.html( el );
            }, listview );
            listview.on( 'allItemLoaded', function() {
                that.loading( 'hide' ); 
                container
                    .find( 'ul' )
                    .isotope({
                        itemSelector: 'li',
                        layoutMode: 'masonry'
                    });
            });
            collection.fetch();

        },

        view: function( key ) {
            this.loading();
            var 
            that = this,
            model = new Model({ id: key });
            model.on( 'imgerr', function() {
                that.container.html( 'Can not load this Photo!' ); 
                that.loading( 'hide' );
            }, model );
            model.on( 'loaded', function() {
                var view = new ItemView({
                    model: this,
                    el: $( '#container' )
                }); 
                view.render();
                that.loading( 'hide' );
            }, model );
            model.fetch();
        }
    });

    H.app = function() {
        var app = new App(); 
        //Backbone.history.start({pushState: true});
        Backbone.history.start();
        //$( 'body' ).append( new app().el );
    };
});
