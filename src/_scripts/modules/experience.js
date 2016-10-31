'use strict'

const $ = require('jquery');

let TweenMax = require('Gsap');

export default class Experience {
    constructor() {
        let self = this;
        this._gooey = $('.experience');
        this._dots = '.experience-gooey-dot';
        this._cursorClass = '.experience-gooey-cursor';

        // this.radius = this._gooey.outerWidth() / 2;
        // this.left = this._gooey.offset().left + this.radius;
        // this.top = this._gooey.offset().top + this.radius;
        // this.hMax  = (this._gooey.outerWidth() - $(this._cursorClass).outerWidth()) / 2.75;
        // this.vMax  = (this._gooey.outerHeight() - $(this._cursorClass).outerHeight()) / 2.75;

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
            self.enableMovement($(this));
        });

        this._gooey.on('mouseleave', function() {
            $(this).find(self._dots).each(function(i){
                self.stopCircleAnim($(this), 0.5 + (i * 0.1));
            });
            self.moveBoxBack($(this));
        });
    }

    enableMovement(_gooey) {
        let self = this;
        let _cursor = _gooey.find(this._cursorClass);
        let _radius = _gooey.outerWidth() / 2;
        let _left = _gooey.offset().left + _radius;
        let _top = _gooey.offset().top + _radius;
        let _hMax  = (_gooey.outerWidth() - _cursor.outerWidth()) / 2.75;
        let _vMax  = (_gooey.outerHeight() - _cursor.outerHeight()) / 2.75;

        _gooey.on("mousemove", function(e) {
            self.moveBox(e,_cursor,_left,_top,_hMax,_vMax);
        });
    }

    moveBox(e,_cursor,_left,_top,_hMax,_vMax) {
        let self = this;

        let y = e.pageY - _top;
        let x = e.pageX - _left;

        if (x > _hMax) {
            x = _hMax;
        }
        if (x < _hMax * -1) {
            x = _hMax * -1;
        }
        if (y > _vMax) {
            y = _vMax;
        }
        if (y < _vMax * -1) {
            y = _vMax * -1;
        }

        TweenMax.to(_cursor, 0.35, {
            x: x,
            y: y,
            rotation: 20,
            scale: 1,
            ease: Power3.easenone
        });
    };

    moveBoxBack(_gooey) {
        let self = this;
        let _cursor = _gooey.find(this._cursorClass);

        _gooey.off("mousemove", self.moveBox);

        TweenMax.to(_cursor, 2.5, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.9,
            ease: Elastic.easeOut.config(1.6, 0.2),
        });
    };

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
}
