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


    animate();
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(stage);
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
        $('.count').animate({
            opacity: 0.5
        }, 500);

        beads.show(500);

        // hiding menu
        chooseMenu.hide(1000);
    }

    function showChooseMenu(){
        // revealing main screen
        $('.count').animate({
            opacity: 0
        }, 500);

        beads.hide(500);

        // revealing menu
        chooseMenu.show(1000);
    }

});




