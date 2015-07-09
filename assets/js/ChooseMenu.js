(function(){
    function ChooseMenu(beadSets){
        this.beadSets = beadSets;
        this.menu = $('<section>').addClass('choose menu');
        this.header = $('<header>');
        this.footer = $('<footer>');
        this.menuList = $('<ul>').addClass('list');
        this.cancelButton = $('<button>').addClass('cancel left').text('Cancel');
        this.newButton = $('<button>').addClass('new right').text('Make New');
        this.menuListItems = [];
    }

    ChooseMenu.prototype = {
        init: function(){
            $('body').prepend(this.menu);
            this.menu.append(this.header.append(this.cancelButton).append(this.newButton));
            this.menu.append(this.menuList);
            this.menu.append(this.footer);

            this.addListItemsFromBeadSets(this.beadSets);

            this.cancelButton.on('click', function(){
                $(document).trigger('chooseMenu:hide');
            });

            this.newButton.on('click', function(){
                //$(document).trigger('createMenu:show');
            });
        },
        addListItemsFromBeadSets: function(beadSets){
            for(var i = 0; i < beadSets.length; i++){
                this.addListItem(beadSets[i])
            }
        },
        addListItem: function(itemInfo){
            var item = $('<li>').addClass('item');
            var itemButton = $('<button>').text(itemInfo.name);

            item.append(itemButton);
            this.menuList.append(item);
            this.menuListItems.push(item);

            itemButton.on('click', function(){
                var beadsChangeEvent = jQuery.Event( 'beads:change' );
                beadsChangeEvent.beads = itemInfo.beads;
                $(document).trigger(beadsChangeEvent);
            })
        },
        hide: function(speed){
            var self = this;
            new TWEEN.Tween({top:0})
                .to({top:-100}, speed)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(){
                    self.menu.css('top', this.top + '%');
                })
                .start();
        },
        show: function(speed){
            var self = this;
            new TWEEN.Tween({top:-100})
                .to({top:0}, speed)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(){
                    self.menu.css('top', this.top + '%');
                })
                .start();
        }
    };

    window.ChooseMenu = ChooseMenu;

})();
