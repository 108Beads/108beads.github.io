jQuery(function($){

    ///////////////////////////////////////
    // CHECK IF VIBRATION API IS AVAILABLE
    ///////////////////////////////////////
    var supportsVibrate = "vibrate" in navigator;;

    // VARIABLES

    var beadSlideControl;
    var scale;
    var createMenu;


    // CREATE THE RENDERER

    var renderer = PIXI.autoDetectRenderer($( window ).width(), $( window ).height());
    $('.app').append(renderer.view);

    scale = getPortraitWidth() / 750;

    var stage = new PIXI.Container();
    stage.interactive = true;
    stage
        .on('mousedown', function(e){beadSlideControl.touchStart(e)})
        .on('touchstart', function(e){beadSlideControl.touchStart(e)})

        .on('mousemove', function(e){beadSlideControl.touchMove(e)})
        .on('touchmove', function(e){beadSlideControl.touchMove(e)})

        .on('mouseup', function(e){beadSlideControl.touchEnd(e)})
        .on('touchend', function(e){beadSlideControl.touchEnd(e)})
        .on('mouseupoutside', function(e){beadSlideControl.touchEnd(e)})
        .on('touchendoutside', function(e){beadSlideControl.touchEnd(e)});


    $(document)
        .on('chooseMenu:hide', function(){
            hideChooseMenu();
        })
        .on('beads:change', function(event){
            beads.remove(stage);
            beads = new Beads(scale, event.beads, renderer.width, renderer.height);
            beads.createBeads(getPortraitHeight(), stage);

            beadSlideControl.beads = beads;

            hideChooseMenu();
        })
        .on('count:add', function(event) {
            if(event.count > 0){
                $('.count').text(event.count).removeClass('icon');
            }else{
                $('.count').text(event.count).addClass('icon');
            }
        })
        .on('vibrate:amount', function(event){
            if(event.vibrate == 1){
                vibrate(50);
            }else if(event.vibrate == 2){
                vibrate([50, 200, 50]);
            }else if(event.vibrate == 4){
                vibrate([50, 200, 50, 200, 50, 200, 50]);
            }
        })
        .on('slide:end', function(){
            beadSlideControl.isSwipe = false;
        })
        .on('createMenu:show', function(){
            openCreateMenu();
        })
        .on('createMenu:hide', function(){
            hideCreateMenu();
        });



    // LOCAL BEAD SETS

    var beadSets = [
        {
            name: 'Standard',
            beads: [
                {
                    pattern:[0],
                    repetitions: 108
                }
            ]
        },
        {
            name: 'With Breakpoints',
            beads: [
                {
                    pattern:[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    repetitions: 10
                },
                {
                    pattern:[0, 0, 0, 0, 0, 0, 0, 0],
                    repetitions: 1
                }
            ]
        }//,
        //{
        //    name: "A.N. 5.1X6X2",
        //    beads: [
        //        {
        //            pattern:[0,0,0,0,0,1],
        //            repetitions: 12
        //        }
        //    ]
        //}
    ];

    var chooseMenu = new ChooseMenu(beadSets);
    chooseMenu.init();

    var background = new PIXI.Sprite.fromImage('assets/img/bg.jpg');
    background.width = renderer.width;
    background.height = renderer.height;
    stage.addChild(background);

    // CREATING THE BEADS IN THE RENDERER
    var beads = new Beads(scale, beadSets[0].beads, renderer.width, renderer.height);
    beads.createBeads(getPortraitHeight(), stage);

    beadSlideControl = new BeadSlideControl(beads, scale);


    function vibrate(value){
        if(supportsVibrate){
            navigator.vibrate(value);
        }
    }

    function getPortraitHeight(){

        if(renderer.height > renderer.width){
            return renderer.height;
        }else{
            return renderer.width;
        }
    }

    function getPortraitWidth(){

        if(renderer.width < renderer.height){
            return renderer.width;
        }else{
            return renderer.height;
        }
    }

    var _time;
    animate();
    function animate(time) {
        requestAnimationFrame(animate);
        _time = time;
        renderer.render(stage);
        TWEEN.update(time);
    }


    function openCreateMenu(){
        createMenu = new EditAndCreateMenu(scale);
        createMenu.init();

        chooseMenu.hide(500);
        createMenu.show(1000);
    }

    function hideCreateMenu(){
        chooseMenu.show(1000);
        createMenu.hide(1000);

    }


    $('.count').on('click', function(){
        if($(this).text() == '0'){
            beads.reset();
        }else{
            showChooseMenu();
        }
    });

    function hideChooseMenu(){
        // revealing main screen
        new TWEEN.Tween({bottom:0, opacity: 0})
            .to({bottom:100, top:0, opacity: 0.5}, 500)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function(){
                $('.count').css('opacity', this.opacity);
            })
            .start();

        beads.show(500);

        // hiding menu
        chooseMenu.hide(1000);
    }

    function showChooseMenu(){
        // revealing main screen
        new TWEEN.Tween({bottom:100, opacity: 0.5})
            .to({bottom:0, top:-100, opacity: 0}, 500)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function(){
                $('.count').css('opacity', this.opacity);
            })
            .start();

        beads.hide(500);

        // revealing menu
        chooseMenu.show(1000);
    }



    //$('.sets ul').append('<li><button class="add">Add New</button></li>').on('click', function(){
    //    new TWEEN.Tween({bottom:100})
    //        .to({bottom:0}, 350)
    //        .easing(TWEEN.Easing.Cubic.InOut)
    //        .onUpdate(function(){
    //            $('.newSet').css('bottom', this.bottom + '%');
    //        })
    //        .start();
    //
    //    $('.newSet .back').on('click', function(){
    //        new TWEEN.Tween({bottom:0})
    //            .to({bottom:100}, 350)
    //            .easing(TWEEN.Easing.Cubic.InOut)
    //            .onUpdate(function(){
    //                $('.newSet').css('bottom', this.bottom + '%');
    //            })
    //            .start();
    //    });
    //
    //    $('.newSet .add').on('click', function(){
    //        $('.newSet .patterns').append('<li><button>small</button><button>big</button><button>remove one</button></li>');
    //    })
    //});


    //var timer = 0;
    //var touchduration = 500;
//var moveYStart = false;
    //var isSwipe = false;
    //var isTouchEnd = true;
    //function touchStart(e){
    //    //timer = setTimeout(longTap, touchduration);
    //    moveYStart = e.data.global.y;
    //}
    //
    //function touchMove(e){
    //    if(!moveYStart) return;
    //
    //    if(e.data.global.y - moveYStart >= 200 * scale && !isSwipe && isTouchEnd){
    //        isSwipe = true;
    //        console.log('swipe down');
    //
    //        beads.moveDown(TWEEN);
    //
    //        isTouchEnd = false;
    //    }
    //}
    //
    //function touchEnd(){
    //    isTouchEnd = true;
    //    moveYStart = false;
    //}


    //function tap(){
    //    clearTimeout(timer);
    //    timer = 0;
    //
    //    console.log('tap');
    //    navigator.vibrate(50);
    //
    //    beads.moveBeadDown(TWEEN);
    //    beads.count++;
    //}



    //function longTap(){
    //    clearTimeout(timer);
    //    timer = 0;
    //
    //    console.log('long tap');
    //    navigator.vibrate([50, 200, 50]);
    //}

    //function addEvents(item, i){
    //    item.on('click', function() {
    //        //beads.remove(stage);
    //        //beads = new Beads(scale, beadSets[i].beads, renderer.width, renderer.height, beadsReturn);
    //        //beads.createBeads(getPortraitHeight(), stage);
    //        //
    //        //hideMainMenu();
    //    })
    //        .on('mousedown', dragStart)
    //        .on('touchstart', dragStart)
    //
    //        .on('mousemove', dragMove)
    //        .on('touchmove', dragMove)
    //
    //        .on('mouseup', dragEnd)
    //        .on('touchend', dragEnd)
    //        .on('mouseupoutside', dragEnd)
    //        .on('touchendoutside', dragEnd);
    //}

    //beadSets.forEach(function(beadSet, i){
    //    $('.sets ul').append('<li><button class="set"></button></li>');
    //    addEvents($('.sets ul li:last-child button.set').text(beadSets[i].name), i);
    //});


    //
    //var startDragX = false;
    //var target = false;
    //var distance = 0;
    //
    //function dragStart(e){
    //    startDragX = e.clientX;
    //    target = e.target;
    //}
    //
    //function dragMove(e){
    //    if(!startDragX) return;
    //    distance = (startDragX - e.clientX) * -1;
    //    if(distance >= 48 || distance <= -48) return;
    //    $(target).css('transform', 'translateX('+ distance +'px)');
    //    console.log(distance);
    //}
    //
    //function dragEnd(){
    //    var self = this;
    //    var distanceBreak = 48/2;
    //    console.log(distance >= distanceBreak || distance <= -distanceBreak);
    //    if(distance >= distanceBreak || distance <= -distanceBreak){
    //        var finalDistance;
    //        if(distance > 0){
    //            finalDistance = 48;
    //        }else{
    //            finalDistance = -48
    //        }
    //        new TWEEN.Tween({distance:distance})
    //            .to({distance:finalDistance}, 350)
    //            .easing(TWEEN.Easing.Cubic.InOut)
    //            .onUpdate(function(){
    //                console.log(this.distance);
    //                $(self.target).css('transform', 'translateX('+ this.distance +'px)');
    //            })
    //            .start();
    //    }else if(distance <= distanceBreak || distance <= -distanceBreak){
    //        new TWEEN.Tween({distance:distance})
    //            .to({distance:0}, 350)
    //            .easing(TWEEN.Easing.Cubic.InOut)
    //            .onUpdate(function(){
    //                $(target).css('transform', 'translateX('+ this.distance +'px)');
    //            })
    //            .start();
    //    }
    //    startDragX = false;
    //    target = false;
    //    distance = 0
    //
    //}
});




