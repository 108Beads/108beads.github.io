(function(){
    function BeadScale(scale){
        this.scale = [
            [200 * scale],
            [270 * scale]
        ];

        return this.scale;
    }

    window.BeadScale = BeadScale;
})();