var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color( 0, 0, 0, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.ship = new Ship();
        this.ship.setPosition( new cc.Point( 700, 300 ) );
        this.addChild( this.ship );
        this.initBullet();
        this.initLife();        
        this.addKeyboardHandlers();
        this.scheduleUpdate();
        
        return true;
    },

    initBullet: function(){
        this.bullets = [];
        for ( var i = 0; i < 15; i++ ) {
            var p = Math.random();
            var bullet = null; 
            if ( p <= 0.4) {
                bullet = new Bullet();
            } else if ( p <= 0.7 ) {
                bullet = new FastBullet();
            } else {
                bullet = new WaveBullet();
            }
            bullet.randomPosition();
            bullet.setPositionX( 100 - 150 * i );
            this.addChild( bullet );
            bullet.scheduleUpdate();

            this.bullets.push( bullet );
        }
    },

    initLife: function() {
        this.life = 10;
        this.lifeLabel = cc.LabelTTF.create( 10, 'Arial', 32 );
        this.lifeLabel.setPosition( cc.p( 700, 550 ) );
        this.addChild( this.lifeLabel );

    },

    update: function( dt ) {
        var self = this;
        this.bullets.forEach( function( bullet, i ) {
            var x = bullet.getPositionX();
            if ( ( x < screenWidth ) &&
               ( x > screenWidth - 100 ) ) {
                var y = bullet.getPositionY();
                if ( self.isHit(y) ) {
                    bullet.randomPosition();
                    self.life -= 1;
                    self.lifeLabel.setString( self.life );
                }
            }
            if ( x > screenWidth ) {
                bullet.randomPosition();
            }    });
        this.GameOver();
    },

    isHit: function(position){
        return Math.abs( position - this.ship.getPositionY() ) < 25
    },
    
    onKeyDown: function( keyCode, event ) {
        this.ship.move( keyCode );
    },
    
    onKeyUp: function( keyCode, event ) {
    },
    
    addKeyboardHandlers: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed : function( keyCode, event ) {
                self.onKeyDown( keyCode, event );
            },
            onKeyReleased: function( keyCode, event ) {
                self.onKeyUp( keyCode, event );
            }
        }, this);
    },

    GameOver: function(){
        if ( this.life == 0 ) {
            var gameOverLabel = cc.LabelTTF.create( 'Game over', 'Arial', 60 );
            gameOverLabel.setPosition( cc.p( 400, 300 ) );
            this.addChild( gameOverLabel );
            cc.director.pause();
        }
    }



});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});
