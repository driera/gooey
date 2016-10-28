'use strict'

const $ = require('jquery');

let TweenMax = require('Gsap');

export default class Experience {
    constructor() {
        let self = this;
        this._gooey = '.experience';
        this._dots = $('.experience-gooey-dot');

        $(window).ready(function() {
            self.addEvents();
        });
    }

    addEvents() {
        let self = this;
        $(this._gooey).on('mouseenter', function() {
            self._dots.each(function(i){
                self.startCircleAnim($(this),20,0.1,1+(i*0.2),1.25+(i*0.7));
                self.followCursor();
            });
        });

        $(this._gooey).on('mouseleave', function() {
            self._dots.each(function(i){
                self.stopCircleAnim($(this),0.8+(i*0.1));
            });
        });
    }

    setupCircle($obj){
        if(typeof($obj.data("circle")) == "undefined"){
            $obj.data("circle", {
                radius: 0,
                angle: 0
            });

            function updateCirclePos(){
                var circle = $obj.data("circle");
                TweenMax.set($obj, {
                    x:Math.cos(circle.angle)*circle.radius,
                    y:Math.sin(circle.angle)*circle.radius,
                })
                requestAnimationFrame(updateCirclePos);
            }
            updateCirclePos();
        }
    }

    startCircleAnim($obj,radius,delay,startDuration,loopDuration) {
        let sentido;
        this.setupCircle($obj);
        $obj.data("circle").radius = 0;
        $obj.data("circle").angle = 0;
        TweenMax.to($obj.data("circle"), startDuration, {
            delay:delay,
            radius:radius,
            ease:Quad.easeInOut
        });
        TweenMax.to($obj.data("circle"), loopDuration, {
            delay:delay,
            angle:Math.PI * 2 * (Math.random() < 0.5 ? -1 : 1),
            ease:Linear.easeNone,
            repeat:-1
        });
    }

    stopCircleAnim($obj,duration) {
        TweenMax.to($obj.data("circle"), duration, {
            radius: 0,
            ease: Quad.easeInOut,
            onComplete:function() {
                TweenMax.killTweensOf($obj.data("circle"));
            }
        });
    }

    followCursor() {
        let self = this;
        this.$box = $('.experience-gooey-cursor');
        this.$container = $(".experience");
        this.$outline = $(".experience");

        this.enabled = false;
        this.left = $container.offset().left;
        this.max  = $container.outerWidth() - $box.outerWidth();

        $box.on("mouseenter", self.enableMovement);
        $container.on("mouseleave", self.moveBoxBack);

    }

    enableMovement() {
        if (enabled) return;
        enabled = true;
        TweenMax.set($outline, { outlineColor: "green" });
        $container.on("mousemove", moveBox);
    }
    
    moveBox(e) {
        let self = this;
        let x = e.pageX - this.left;
        if (x > max) { x = max; }
        TweenMax.to($box, 0.5, { x: x, rotation: 20, 		ease: Power1.easenone	 });
    };

    moveBoxBack() {
        $container.off("mousemove", moveBox);
        enabled = false;
        TweenMax.set($outline, { outlineColor: "red" });
        TweenMax.to($box, 0.75, { rotation: 0, ease: Back.easeOut });
    };

}
