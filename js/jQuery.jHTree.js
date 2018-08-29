/*
* jHtree Horizontal Animated jQuery Plugin
* 4/2014 
* By NADy:   @naadydev     naadydev@gmail.com
*/
(function ($) {
    
    $.widget("jHtree.jHTree", {
        options: {
            callType: 'url',
            url: '',
            structureObj: [{}],
            zoomer: true,
            afterDropClass: 'contaftrdrop'
        },
        _init: function () {           
        },
        _setOption: function (key, value) {           
            this._super(key, value);
        },
        _setOptions: function (options) {
            this._super(options);
            this._createUpdate();
        },
        _createUpdate: function () {
            parentthis = this;
            //-----------------------
            if (this.options.callType == 'url') {
                $.getJSON(this.options.url, function (data) {
                   
                })
                    .done(function (data) {
                       
                        parentthis._constructTree(data);
                      
                    })
                    .fail(function (err) {
                        var status = err.status;
                        var statusText = err.statusText;
                       
                      
                    });
            }
            if (this.options.callType == 'obj') {
                //-----------------------
                this._constructTree(this.options.structureObj);
                //-----------------------
            }



        },
        _create: function () {
            this._createUpdate();
        },
        destroy: function () {
            
            $.Widget.prototype.destroy.call(this);
        },
       
        _constructTree: function (jsonStructureObject) {
           
            var $tree = $(this.element);
            $tree.addClass('tree').append("<ul id='tremainul'>");
           
            this._walkerCursor(jsonStructureObject, 'tremainul');
            this._prepareNodes();
            this._treeDarg();
            this._treeDrop();
            this._interactionEvents();
            if (this.options.zoomer) this._zoomer($tree);
        },
        
        _walkerCursor: function (jsonObjs, parentLiNode) {
            for (var i = 0; i < jsonObjs.length; i++) {
                var node = jsonObjs[i];
               
                this._createNode(node, parentLiNode);
                
                if (node.children !== null && typeof node.children === "object") {
                    this._walkerCursor(node.children, node.id);
                }
            }
        },
        
        _createNode: function (node, parentLiNode) {
            var bfrul = '';
            var isTreemainLi = (parentLiNode === "tremainul");
            var beforeDiv = '';
            var afterDiv = '';
            if (node.children) {
                bfrul = '<div class="bfrul"></div>';
            }
            if (!isTreemainLi) {
                beforeDiv = '<div class="before"><div class="funcbtnb ui-state-default ui-corner-all" title="Level Focus" data-func="focus"><span class="ui-icon ui-icon-zoomin"></span></div></div>';
                afterDiv = '<div class="after"><div class="funcbtna ui-state-default ui-corner-all" title="collapse" data-func="clps"><span class="ui-icon ui-icon-triangle-1-n"></span></div></div>';
            }

            var nodeLiElements = '<li id="' + node.id + '" class="tnode" >' + beforeDiv + '<div class="trcont"><div class="ui-widget-header ui-corner-tl ui-corner-tr">' +
                node.head + '</div><div class="ui-widget-content ui-corner-bl ui-corner-br">' +
                node.contents + '</div></div><div class="trchl"><ul>' +
                bfrul + '</ul></div>' + afterDiv + '</li>';

            if (isTreemainLi) {// Firest ul
                $("#" + parentLiNode).append(nodeLiElements);
            }
            else {
                $("> .trchl > ul", "#" + parentLiNode).append(nodeLiElements);
            }
        },
       
        _prepareNodes: function () {
           
            $('.trchl').each(function (e, x) {
                var $obj = $(this);
               
                var $li = $($obj).find('> ul>li');
                var count = $li.length;
                
                if (count == 1)
                {
                    $($li).find('> .before, > .after').css("border-top", "0px");
                }
                if (count > 1) {
                    $li.first().find('> .after').css("border-top", "0px");
                    $li.last().find('> .before').css("border-top", "0px");
                }
              
                var chldinsidlicount = $li.find('.trchl');

               
                $obj.find('div[data-func]').each(function (a, o) {
                    var objbtn = $(o);
                    if (objbtn.data('func') == "reset") {
                        objbtn.show();
                        var objfocus = objbtn.parent().closest('li');
                        var objother = objfocus.parent().find('> li');
                        var targetobjs = $(objother).not(objfocus);
                        targetobjs.hide();
                    }

                    if (objbtn.data('func') == "xpnd") {
                        objbtn.show();
                        objbtn.parent().parent().find('.trchl').hide();
                    }


                });

            });
        },
       
        _treeDarg: function () {

            $("li", ".tree").draggable({
               
                cancel: "a.ui-icon", 
                revert: "invalid", 
                revertDuration: 600,
                containment: "document",
              
                helper: function (event, ui) {

                    var orginalElement = $(this);
                    var header = orginalElement.find('> .trcont').find('.ui-widget-header');
                    var headerCopy = header.text();
                    return $('<div class="ui-state-focus ui-corner-all" />').css("width", header.css("width")).text(headerCopy);
                   

                },
                cursor: "move",
                distance: 20,
                opacity: 0.8,
                snap: '.trcont',
                snapMode: 'inner',
                stack: '.trcont',
                start: function (event, ui) { },
                stop: function (event, ui) { }
            });

        },
       
        _treeDrop: function () {
            var thisparent = this;
            $("li", ".tree").droppable({
             
                greedy: true,
                accept: ".tree ul > li",
                activeClass: "dragactive",
                hoverClass: 'drophover',
                drop: function (event, ui) {

                   
                    var draggableObj = ui.draggable;
                    var droppableObj = $(this);
                   
                    var draggableId = draggableObj.attr("id");
                    var droppableId = droppableObj.attr("id");
                   
                  
                    var $ItemUL = $("ul:first", droppableObj);

                    if ($ItemUL.length) {

                        
                        if (!$ItemUL.find('> .bfrul').length) {
                            $ItemUL.append('<div class="bfrul"></div>');
                        }
                        //---------------
                        $(draggableObj).fadeOut("slow", function () {
                            $(this).appendTo($ItemUL).fadeIn('slow')
                            .effect('shake', { direction: 'down', mode: 'effect' }, 'slow');
                            $(this).find("> .trcont").addClass(thisparent.options.afterDropClass);

                           
                        });
                        

                    }                                     
                    prepareNodesAfterDrop(draggableObj, droppableObj);                   
                    thisparent._trigger("nodeDropComplete", null, { nodeId: draggableId, parentNodeId: droppableId });                   
                }
            });
            function prepareNodesAfterDrop(movedObj, targetObj) {
                
                var parentUl = $(movedObj).parent();
                var parentLis = parentUl.find('> li');
                var objIndex = movedObj.index();
                if (parentLis.length == 1)
                {
                   
                    $('.bfrul', parentUl).fadeOut("slow", function () {
                        $(this).remove();
                    });
                }
                if (parentLis.length > 1)
                {
                    var $besideLi;
                   
                    if (objIndex == 1)
                    {
                       
                        $besideLi = $(movedObj).next('li');
                        if (parentLis.length == 2) {
                            $besideLi.find('> .before ,> .after').css("border-top", "0px");
                        }
                        else
                        {
                            $besideLi.find('> .after').css("border-top", "0px");
                        }
                    }
                    if (objIndex == parentLis.length)
                    {
                        $besideLi = $(movedObj).prev('li');
                        if (parentLis.length == 2) {
                            $besideLi.find('> .before ,> .after').css("border-top", "0px");
                        }
                        else
                        {
                            $besideLi.find('> .before').css("border-top", "0px");
                        }
                    }
                }
              
                var $targetlis = $(targetObj).find('> .trchl > ul > li');
               
                if ($targetlis.length == 0)
                {
                    $(movedObj).find('> .before ,> .after').css("border-top", "0px");
                }
                else 
                {
                    $(movedObj).find('> .before').css("border-top", "0px");
                    $(movedObj).find('> .after').css("border-top", "1px solid #ccc");
                  
                    var $lastLi = $targetlis.last();
                    $lastLi.find("> .before").css("border-top", "1px solid #ccc");
                }
            }

        },
        
        _interactionEvents: function () {
            
            $(".tree").on({
                mouseenter: function () {
                    var parentLi = $(this).parent();
                  
                    parentLi.find('> .before,> .after').find('> .funcbtnb,> .funcbtna').show('blind', { direction: 'vertical' });
                  
                    parentLi.find('.ui-widget-content').addClass('tfocus');
                    parentLi.find('.ui-widget-header').addClass('ui-state-focus');
                },
                mouseleave: function () {

                    var parentLi = $(this).parent();
                    parentLi.find('.ui-widget-content').removeClass('tfocus');
                    parentLi.find('.ui-widget-header').removeClass('ui-state-focus');
                   
                }
            }, ".trcont,.before,.after");
            
            $(".tree").on('mouseleave', '.tnode', function () {

                var funcbtns = $(this).find('> .before,> .after').find('div[data-func]');
                if ($(funcbtns[0]).data('func') == "focus") {
                    $(funcbtns[0]).hide('blind', { direction: 'vertical' });
                }
                if ($(funcbtns[1]).data('func') == "clps") {
                    $(funcbtns[1]).hide('blind', { direction: 'vertical' });
                }

            });
          
            $(".tree").on("click", ".trcont > .ui-widget-header", function () {
                $(this).parent().parent().find('.trchl').slideToggle('slow', "easeOutBounce", function () {
                    // Animation complete.
                });
            });
            
            $(".tree").on("click", "div[data-func]", function () {
                var objbtn = $(this);
                var objfocus = objbtn.parent().closest('li');
                var objother = objfocus.parent().find('> li');
                var targetobjs = $(objother).not(objfocus);

                var objfuncattr = objbtn.data("func");
                if (objfuncattr == 'focus' || objfuncattr == 'reset') {

                    

                    objbtn.find('span').toggleClass('ui-icon-zoomin ui-icon-zoomout');
                    if (objfuncattr == 'focus') {
                       

                        targetobjs.effect('fold', { direction: 'up', mode: 'hide' }, 'normal');
                      
                        objbtn.data("func", "reset");
                        objbtn.attr("title", "Level Reset");
                    }
                    else {
                      
                        targetobjs.effect('fold', { direction: 'up', mode: 'show' }, 'slow');
                        objbtn.data("func", "focus");
                        objbtn.attr("title", "Level Focus");
                    }
                }

                if (objfuncattr == 'clps' || objfuncattr == 'xpnd') {
                  
                    objbtn.find('span').toggleClass("ui-icon-triangle-1-n ui-icon-triangle-1-s");
                    if (objfuncattr == 'clps') {
                        $(this).parent().parent().find('.trchl').effect('fold', { direction: 'up', mode: 'hide' }, 'slow');
                        objbtn.data('func', 'xpnd');
                        objbtn.attr("title", "Expand");
                    } else {
                      
                        $(this).parent().parent().find('.trchl').slideDown('slow', "easeOutBounce", function () { });
                       
                        objbtn.data('func', 'clps');
                        objbtn.attr("title", "Collapse");
                    }
                }
            });
            
        },
      
        _zoomer: function (treeDiv) {
            var zmr = '<div class="zmrcntr"><input type="text" id="zmrval" class="zomrval"><div id="zmrslidr" style="height:200px;"></div></div>';
            $(zmr).insertBefore($(treeDiv));
           
            var brwstp = navigator.userAgent.match(/Mozilla/);
            $("#zmrslidr").slider({
                orientation: "vertical",
                range: "min",
                min: 10,
                animate: 'slow',
                max: 200,
                value: 100,
                slide: function (event, ui) {
                    $("#zmrval").val(ui.value);
                    if (brwstp == true) {

                        $('.tree').css('MozTransform', 'scale(' + ui.value + ')');
                    } else {

                        $('.tree').css('zoom', ' ' + ui.value + '%');
                    }
                }
            });
            $("#zmrval").val($("#zmrslidr").slider("value"));
           
        }
      
    });
   
})(jQuery);