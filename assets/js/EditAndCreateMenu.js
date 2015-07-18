(function(){
    function EditAndCreateMenu(scale){
        this.menuSection = $('<section>').addClass('editCreate menu');
        this.header = $('<header>');
        this.cancelButton = $('<button>').addClass('cancel left small').text('X');
        this.nameContainer = $('<div>').addClass('middle');
        this.nameInput = $('<input>').addClass('name').val('Untitled');
        this.doneButton = $('<button>').addClass('done right small').text('V');
        this.slider = $('<div>').addClass('slider');

        this.buttonContainer = $('<div>').addClass('buttonContainer');
        this.addBeadButton = $('<button>').addClass('addBeadButton');

        this.beadSections = [];

        this.beadSize = BeadScale(scale);
        this.timer = false;
        this.touchduration = 500;
    }

    EditAndCreateMenu.prototype = {
        init: function(){
            $('body').prepend(this.menuSection);
            this.menuSection
                .append(this.header)
                .append(this.slider);

            this.header
                .append(this.cancelButton)
                .append(this.nameContainer)
                .append(this.doneButton);

            this.nameContainer.append(this.nameInput);

            this.slider.append(this.buttonContainer);
            this.buttonContainer
                .append(this.addBeadButton)
                .css('margin-top', Math.floor(this.beadSize[0]/2) + 'px');
            this.addBeadButton
                .css('width', Math.floor(this.beadSize[0]) + 'px')
                .css('height', Math.floor(this.beadSize[0]) + 'px')
                .css('transform', 'translateY(-' + Math.floor(this.beadSize[0]/2) + 'px)');


            this.cancelButton.on('click', function(){
                $(document).trigger('createMenu:hide');
            });

            //this.addBeadSection();

            var self = this;
            this.addBeadButton
                .on('touchstart', function(e){self.addButtonTouchStart(e)})
                .on('touchend', function(e){self.addButtonTouchEnd(e)});
        },
        addButtonTouchStart: function(e){
            e.preventDefault();
            var self = this;
            this.timer = setTimeout(function(){
                self.longTap()
            }, self.touchduration);
        },
        addButtonTouchEnd: function(e){
            e.preventDefault();
            if(this.timer){
                this.tap();
            }
        },
        tap: function(){
            if(this.beadSections.length === 0){
                this.addBeadSection();
            }

            clearTimeout(this.timer);
            this.timer = 0;
            this.addBeadToSection(this.beadSections[this.beadSections.length - 1], 0);
        },
        longTap: function(){
            if(this.beadSections.length === 0){
                this.addBeadSection();
            }

            clearTimeout(this.timer);
            this.timer = 0;
            this.addBeadToSection(this.beadSections[this.beadSections.length - 1], 1);
        },
        addBeadSection: function(){
            var section = $('<div>').addClass('beads');
            var repetitionsCountBar = $('<div>').addClass('repetitionsCountBar');
            var repetitionsLabel = $('<label>').text('x ');
            var repetitionsInput = $('<input>').attr('type', 'number').val('1');

            this.buttonContainer.before(section);
            section.append(repetitionsCountBar);
            repetitionsCountBar
                .css('transform', 'translateX(' + (Math.floor(this.beadSize[1]/2) + 16) +'px)')
                .append(repetitionsLabel);

            repetitionsLabel.append(repetitionsInput);

            this.beadSections.push({
                element: section,
                repetitions: {
                    label: repetitionsLabel,
                    input: repetitionsInput
                },
                beads:[]
            })
        },
        addBeadToSection: function(section, size){
            var bead = $('<div>')
                .addClass('bead')
                .css('width', Math.floor(this.beadSize[size]) + 'px')
                .css('height', Math.floor(this.beadSize[size]) + 'px');

            $(section.element).append(bead);
            section.beads.push(bead);

            this.slider.scrollTop(this.slider.prop("scrollHeight"));
        },
        show: function(speed){
            var self = this;
            new TWEEN.Tween({top:-100})
                .to({top:0}, speed)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(){
                    self.menuSection.css('top', this.top + '%');
                })
                .start();
        },
        hide: function(speed){
            var self = this;
            new TWEEN.Tween({top:0})
                .to({top:-100}, speed)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(){
                    self.menuSection.css('top', this.top + '%');
                })
                .onComplete(function(){
                    self.menuSection.remove();
                })
                .start();
        }
    };

    window.EditAndCreateMenu = EditAndCreateMenu;
})();