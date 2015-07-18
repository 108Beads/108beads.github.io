(function (){
    function Beads(scale, beads, winWidth, winHeight){
        this.beads = this.decipherBeads(beads);
        this.scale = scale;
        this.count = 0;
        this.topBeads = [];
        this.bottomBeads = [];
        this.beadSize = BeadScale(scale);
        this.beadTexture = [
            ['assets/img/bead.png'],
            ['assets/img/bigBead.png']
        ];
        this.numberOfBeadTransitions = 0;
        this.winWidth = winWidth;
        this.winHeight = winHeight;

        this.animateSpeed = 300;

        this.topBeadsLocations = [];
        this.bottomBeadsLocations = [];

        this.sendCount();
    }

    Beads.prototype = {
        decipherBeads: function(beads){
            var array = [];
            for(var i = 0; i < beads.length; i++){
                for(var j = 0; j < beads[i].repetitions; j++){
                    array = array.concat(beads[i].pattern);
                }
            }

            return array;
        },
        createBeads: function(winHeight, stage){
            var i;
            var numOfTopBeads = Math.floor((winHeight / 2 + this.beadSize[0]/2) / this.beadSize[0]) + 2;
            var numOfBottomBeads = Math.floor((winHeight / 2 - this.beadSize[0]/2) / this.beadSize[0]) + 1;

            for(i = 0; i < numOfTopBeads; i++){
                this.topBeads[i] = this.createBead();
                stage.addChild(this.topBeads[i]);
            }

            for(i = 0; i < numOfBottomBeads; i++){
                this.bottomBeads[i] = this.createBead();
                stage.addChild(this.bottomBeads[i]);
            }

            this.findPositions();
            this.place();
        },
        createBead: function(){
            var bead = new PIXI.Sprite(PIXI.Texture.fromImage(this.beadTexture[0]));

            bead.anchor.x = 0.5;
            bead.anchor.y = 0.5;

            bead.scale = {x: this.scale, y:this.scale};

            bead.position.x = this.winWidth/2;

            return bead;
        },
        remove: function(stage){
            for(var i = 0; i < this.topBeads.length; i++)
                stage.removeChild(this.topBeads[i])

            for(i = 0; i < this.bottomBeads.length; i++)
                stage.removeChild(this.bottomBeads[i])
        },
        moveDown: function(){
            //add count
            this.addCount();

            //calculate distances
            this.findPositions();

            //animate beads
            //place beads in correct position and change image
            this.animateBeadsDown();
        },
        findPositions: function(){
            this.topBeadsLocations = [];
            this.bottomBeadsLocations = [];

            for(var i = 0; i < this.topBeads.length; i++){
                if(i === 0){
                    this.topBeadsLocations.push(this.winHeight/2);
                }else{
                    this.topBeadsLocations.push(this.getDistanceFor('top', i));
                }
            }

            for(i = 0; i < this.bottomBeads.length + 1; i++){
                if(i === 0) {
                    if(this.count === 0 ){
                        this.bottomBeadsLocations.push(this.winHeight / 2 + this.beadBrakeDistance(
                                this.beads[this.count],
                                0));
                    }else if(this.count === this.beads.length - 1){
                        this.bottomBeadsLocations.push(this.winHeight / 2 + this.beadBrakeDistance(
                                this.beads[this.count],
                                this.beads[this.count - 1]));
                    }else{
                        this.bottomBeadsLocations.push(this.winHeight / 2 + this.beadBrakeDistance(
                                0,
                                this.beads[this.count - 1]));
                    }

                }else{
                    this.bottomBeadsLocations.push(this.getDistanceFor('bottom', i));
                }
            }
        },
        getDistanceFor: function (orientation, id) {
            var i = 1;
            var currentBeadId = this.count;
            var otherBeadId;
            var startPosition = 0;
            var currentRadius;
            var otherRadius;
            if(orientation == 'top'){
                currentBeadId += id - 1;
                otherBeadId = currentBeadId + 1;
                startPosition = this.topBeadsLocations[id - 1];
            }else if(orientation == 'bottom'){
                currentBeadId -= id;
                otherBeadId = currentBeadId -1;
                startPosition = this.bottomBeadsLocations[id -1];
                i = -1;
            }

            if(currentBeadId >= 0 && currentBeadId < this.beads.length){
                currentRadius = this.beadSize[this.beads[currentBeadId]] / 2;
            }else{
                currentRadius = this.beadSize[0] / 2;
            }

            if(otherBeadId >= 0 && otherBeadId < this.beads.length){
                otherRadius = this.beadSize[this.beads[otherBeadId]] / 2;
            }else{
                otherRadius = this.beadSize[0] / 2;
            }

            return Math.floor(startPosition - currentRadius * i - otherRadius * i);
        },
        place: function(){
            var beadId;
            for(var i = 0; i < this.topBeads.length; i++){
                this.topBeads[i].position.y = this.topBeadsLocations[i];
                beadId = this.count + i;
                if(beadId >= 0 && beadId < this.beads.length){
                    this.topBeads[i].alpha = 1;
                    this.topBeads[i].texture = PIXI.Texture.fromImage(this.beadTexture[this.beads[beadId]]);
                    //console.log(this.beads[beadId]);
                }else{
                    this.topBeads[i].alpha = 0;
                }
            }

            for(i = 0; i < this.bottomBeads.length; i++){
                this.bottomBeads[i].position.y = this.bottomBeadsLocations[i];
                beadId = this.count - 1 - i;
                if(beadId >= 0 && beadId < this.beads.length){
                    this.bottomBeads[i].alpha = 1;
                    this.bottomBeads[i].texture = PIXI.Texture.fromImage(this.beadTexture[this.beads[beadId]]);
                }else{
                    this.bottomBeads[i].alpha = 0;
                }
            }
        },
        animateBeadsDown: function(){
            for(var i = 0; i < this.topBeads.length; i++){
                if(i === 0){
                    this.animateBead(this.topBeads[0], this.bottomBeadsLocations[0]);
                }else{
                    this.animateBead(this.topBeads[i], this.topBeadsLocations[i - 1]);
                }
            }

            for(i = 0; i < this.bottomBeads.length; i++){
                this.animateBead(this.bottomBeads[i], this.bottomBeadsLocations[i + 1]);
            }
        },
        animateBead: function(bead, position){
            var self = this;

            createjs.Tween.get(bead.position).to({y:position}, this.animateSpeed).call(function(){
                self.whenAllFinish();
            });

        },

        whenAllFinish: function(){
            console.log(this.topBeads);
            this.numberOfBeadTransitions ++;

            if(this.topBeads.length + this.bottomBeads.length == this.numberOfBeadTransitions){
                this.numberOfBeadTransitions = 0;
                //this.placeBeads();
                this.place();

                //this.callback({name: 'beads', number: this.beads.length - this.count});
                if(this.beads.length == this.count){
                    this.vibrate(4);
                }else{
                    this.vibrate(this.beads[this.count-1] + 1);
                }

                this.endSlide();

            }
        },
        beadBrakeDistance: function(sizeTop, sizeBottom){
            sizeTop = sizeTop || 0;

            //radius of current bead
            var cr = this.beadSize[sizeTop][0] / 2;

            var pr = this.beadSize[sizeBottom][0] / 2;

            //radius of small bead
            var rs = this.beadSize[0] / 2;


            return cr + rs + pr;
        },
        reset: function(){
            this.count = 0;

            this.findPositions();
            this.place();

            this.sendCount();
        },
        hide: function(speed){
            for(var i = 0; i < this.topBeads.length; i++){
                createjs.Tween.get(this.topBeads[i]).to({alpha:0}, speed);
            }

            for(i = 0; i < this.bottomBeads.length; i++){
                createjs.Tween.get(this.bottomBeads[i]).to({alpha:0}, speed);
            }
        },
        show: function(speed){
            var beadId;
            for(var i = 0; i < this.topBeads.length; i++){
                beadId = this.count + i;
                if(beadId >= 0 && beadId < this.beads.length){
                    createjs.Tween.get(this.topBeads[i]).to({alpha:1}, speed);
                }
            }

            for(i = 0; i < this.bottomBeads.length; i++){
                beadId = this.count - 1 - i;
                if(beadId >= 0 && beadId < this.beads.length){
                    createjs.Tween.get(this.bottomBeads[i]).to({alpha:1}, speed);
                }
            }
        },
        addCount: function(){
            this.count ++;

            this.sendCount();
        },
        sendCount: function(){
            var countEvent = jQuery.Event( 'count:add' );
            countEvent.count = this.beads.length - this.count;
            $(document).trigger(countEvent);
        },
        vibrate: function(amount){
            var vibrateEvent = jQuery.Event( 'vibrate:amount' );
            vibrateEvent.vibrate = amount;
            $(document).trigger(vibrateEvent);
        },
        endSlide: function(){
            $(document).trigger('slide:end');
        }
    };

    window.Beads = Beads;
})();