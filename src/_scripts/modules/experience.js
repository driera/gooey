'use strict'

const $ = require('jquery');

let TweenMax = require('Gsap');

export default class Experience {
    constructor() {
        let self = this;
        this._gooey = $('.experience');
        this._dots = '.experience-gooey-dot';
        this.$box = $('.experience-gooey-cursor');

        this.enabled = false;
        this.radius = this._gooey.outerWidth() / 2;
        this.left = this._gooey.offset().left + this.radius;
        this.top = this._gooey.offset().top + this.radius;
        this.hMax  = (this._gooey.outerWidth() - this.$box.outerWidth()) / 2.75;
        this.vMax  = (this._gooey.outerHeight() - this.$box.outerHeight()) / 2.75;

        $(window).ready(function() {
            self.addEvents();
        });
    }

    addEvents() {
        let self = this;
        this._gooey.on('mouseenter', function() {
            $(this).find(self._dots).each(function(i){
                self.startCircleAnim($(this), 23 + (i * 0.1), 0.1, 1 + (i * 0.2), 1.25 + (i * 0.7));
            });
            self.enableMovement();
        });

        this._gooey.on('mouseleave', function() {
            $(this).find(self._dots).each(function(i){
                self.stopCircleAnim($(this), 0.5 + (i * 0.1));
            });
            self.moveBoxBack();
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

    enableMovement(e) {
        let self = this;

        if (this.enabled) return;
        this.enabled = true;
        this._gooey.on("mousemove", function(e) {
            self.moveBox(e);
        });
    }

    moveBox(e) {
        let self = this;
        let y = e.pageY - this.top;
        let x = e.pageX - this.left;
        if (x > this.hMax) {
            x = this.hMax;
        }
        if (x < this.hMax * -1) {
            x = this.hMax * -1;
        }
        if (y > this.vMax) {
            y = this.vMax;
        }
        if (y < this.vMax * -1) {
            y = this.vMax * -1;
        }

        TweenMax.to(self.$box, 0.35, {
            x: x,
            y: y,
            rotation: 20,
            scale: 1,
            ease: Power3.easenone
        });
    };

    moveBoxBack(e) {
        let self = this;
        this._gooey.off("mousemove", function(e) {
            self.moveBox(e);
        });
        this.enabled = false;
        TweenMax.to(self.$box, 2.5, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.9,
            ease: Elastic.easeOut.config(1.6, 0.2),
        });
    };
}
