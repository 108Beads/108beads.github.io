(function(){

    function BeadSlideControl(beads, slideDistance){
        this.beads = beads;
        this.slideDistance = slideDistance;
        this.moveYStart = false;
        this.isSwipe = false;
        this.isTouchEnd = true;
    }

    BeadSlideControl.prototype = {
        touchStart: function (e){
            //timer = setTimeout(longTap, touchduration);
            this.moveYStart = e.data.global.y;
        },
        touchMove: function(e) {

            if (!this.moveYStart) return;

            if (e.data.global.y - this.moveYStart >= 200 * this.slideDistance && !this.isSwipe && this.isTouchEnd) {
                this.isSwipe = true;
                console.log('swipe down');

                this.beads.moveDown();

                this.isTouchEnd = false;
            }
        },
        touchEnd: function(){
            this.isTouchEnd = true;
            this.moveYStart = false;
        }
    };

    window.BeadSlideControl = BeadSlideControl;
})();
