/**
 * pulltorefresh-h5-iscroll - 一款基于IScroll5的H5下拉刷新实现，包括多种皮肤的实现
 * @version v3.0.0
 * @author 
 */
!
function(t, i, s) {
    function e(s, e) {
        this.wrapper = "string" == typeof s ? i.querySelector(s) : s,
        this.scroller = this.wrapper.children[0],
        this.scrollerStyle = this.scroller.style,
        this.options = {
            resizeScrollbars: !0,
            mouseWheelSpeed: 20,
            snapThreshold: .334,
            disablePointer: !h.hasPointer,
            disableTouch: h.hasPointer || !h.hasTouch,
            disableMouse: h.hasPointer || h.hasTouch,
            startX: 0,
            startY: 0,
            scrollY: !0,
            directionLockThreshold: 5,
            momentum: !0,
            bounce: !0,
            bounceTime: 600,
            bounceEasing: "",
            preventDefault: !0,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            HWCompositing: !0,
            useTransition: !0,
            useTransform: !0,
            bindToWrapper: "undefined" == typeof t.onmousedown
        };
        for (var o in e) this.options[o] = e[o];
        this.translateZ = this.options.HWCompositing && h.hasPerspective ? " translateZ(0)": "",
        this.options.useTransition = h.hasTransition && this.options.useTransition,
        this.options.useTransform = h.hasTransform && this.options.useTransform,
        this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical": this.options.eventPassthrough,
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault,
        this.options.scrollY = "vertical" != this.options.eventPassthrough && this.options.scrollY,
        this.options.scrollX = "horizontal" != this.options.eventPassthrough && this.options.scrollX,
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough,
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold,
        this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? h.ease[this.options.bounceEasing] || h.ease.circular: this.options.bounceEasing,
        this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling,
        this.options.tap === !0 && (this.options.tap = "tap"),
        this.options.useTransition || this.options.useTransform || /relative|absolute/i.test(this.scrollerStyle.position) || (this.scrollerStyle.position = "relative"),
        "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1),
        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1,
        3 == this.options.probeType && (this.options.useTransition = !1),
        this.x = 0,
        this.y = 0,
        this.directionX = 0,
        this.directionY = 0,
        this._events = {},
        this._init(),
        this.refresh(),
        this.scrollTo(this.options.startX, this.options.startY),
        this.enable()
    }
    function o(t, s, e) {
        var o = i.createElement("div"),
        n = i.createElement("div");
        return e === !0 && (o.style.cssText = "position:absolute;z-index:9999", n.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),
        n.className = "iScrollIndicator",
        "h" == t ? (e === !0 && (o.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", n.style.height = "100%"), o.className = "iScrollHorizontalScrollbar") : (e === !0 && (o.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", n.style.width = "100%"), o.className = "iScrollVerticalScrollbar"),
        o.style.cssText += ";overflow:hidden",
        s || (o.style.pointerEvents = "none"),
        o.appendChild(n),
        o
    }
    function n(s, e) {
        this.wrapper = "string" == typeof e.el ? i.querySelector(e.el) : e.el,
        this.wrapperStyle = this.wrapper.style,
        this.indicator = this.wrapper.children[0],
        this.indicatorStyle = this.indicator.style,
        this.scroller = s,
        this.options = {
            listenX: !0,
            listenY: !0,
            interactive: !1,
            resize: !0,
            defaultScrollbars: !1,
            shrink: !1,
            fade: !1,
            speedRatioX: 0,
            speedRatioY: 0
        };
        for (var o in e) this.options[o] = e[o];
        if (this.sizeRatioX = 1, this.sizeRatioY = 1, this.maxPosX = 0, this.maxPosY = 0, this.options.interactive && (this.options.disableTouch || (h.addEvent(this.indicator, "touchstart", this), h.addEvent(t, "touchend", this)), this.options.disablePointer || (h.addEvent(this.indicator, h.prefixPointerEvent("pointerdown"), this), h.addEvent(t, h.prefixPointerEvent("pointerup"), this)), this.options.disableMouse || (h.addEvent(this.indicator, "mousedown", this), h.addEvent(t, "mouseup", this))), this.options.fade) {
            this.wrapperStyle[h.style.transform] = this.scroller.translateZ;
            var n = h.style.transitionDuration;
            if (!n) return;
            this.wrapperStyle[n] = h.isBadAndroid ? "0.0001ms": "0ms";
            var a = this;
            h.isBadAndroid && r(function() {
                "0.0001ms" === a.wrapperStyle[n] && (a.wrapperStyle[n] = "0s")
            }),
            this.wrapperStyle.opacity = "0"
        }
    }
    var r = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame ||
    function(i) {
        t.setTimeout(i, 1e3 / 60)
    };
    t.requestAnimationFrame = r;
    var h = function() {
        function e(t) {
            return r !== !1 && ("" === r ? t: r + t.charAt(0).toUpperCase() + t.substr(1))
        }
        var o = {},
        n = i.createElement("div").style,
        r = function() {
            for (var t, i = ["t", "webkitT", "MozT", "msT", "OT"], s = 0, e = i.length; s < e; s++) if (t = i[s] + "ransform", t in n) return i[s].substr(0, i[s].length - 1);
            return ! 1
        } ();
        o.getTime = Date.now ||
        function() {
            return (new Date).getTime()
        },
        o.extend = function(t, i) {
            for (var s in i) t[s] = i[s]
        },
        o.addEvent = function(t, i, s, e) {
            t.addEventListener(i, s, !!e)
        },
        o.removeEvent = function(t, i, s, e) {
            t.removeEventListener(i, s, !!e)
        },
        o.prefixPointerEvent = function(i) {
            return t.MSPointerEvent ? "MSPointer" + i.charAt(7).toUpperCase() + i.substr(8) : i
        },
        o.momentum = function(t, i, e, o, n, r) {
            var h, a, l = t - i,
            c = s.abs(l) / e;
            return r = void 0 === r ? 6e-4: r,
            h = t + c * c / (2 * r) * (l < 0 ? -1 : 1),
            a = c / r,
            h < o ? (h = n ? o - n / 2.5 * (c / 8) : o, l = s.abs(h - t), a = l / c) : h > 0 && (h = n ? n / 2.5 * (c / 8) : 0, l = s.abs(t) + h, a = l / c),
            {
                destination: s.round(h),
                duration: a
            }
        };
        var h = e("transform");
        e("transition");
//      console.log(h);
        return o.extend(o, {
            hasTransform: h !== !1,
            hasPerspective: e("perspective") in n,
            hasTouch: "ontouchstart" in t,
            hasPointer: !(!t.PointerEvent && !t.MSPointerEvent),
            hasTransition: e("transition") in n
        }),
        o.isBadAndroid = function() {
            var i = t.navigator.appVersion;
            if (/Android/.test(i) && !/Chrome\/\d/.test(i)) {
                var s = i.match(/Safari\/(\d+.\d)/);
                return ! (s && "object" == typeof s && s.length >= 2) || parseFloat(s[1]) < 535.19
            }
            return ! 1
        } (),
        o.extend(o.style = {},
        {
            transform: h,
            transitionTimingFunction: e("transitionTimingFunction"),
            transitionDuration: e("transitionDuration"),
            transitionDelay: e("transitionDelay"),
            transformOrigin: e("transformOrigin"),
            touchAction: e("touchAction")
        }),
        o.hasClass = function(t, i) {
            var s = new RegExp("(^|\\s)" + i + "(\\s|$)");
            return s.test(t.className)
        },
        o.addClass = function(t, i) {
            if (!o.hasClass(t, i)) {
                var s = t.className.split(" ");
                s.push(i),
                t.className = s.join(" ")
            }
        },
        o.removeClass = function(t, i) {
            if (o.hasClass(t, i)) {
                var s = new RegExp("(^|\\s)" + i + "(\\s|$)", "g");
                t.className = t.className.replace(s, " ")
            }
        },
        o.offset = function(t) {
            for (var i = -t.offsetLeft,
            s = -t.offsetTop; t = t.offsetParent;) i -= t.offsetLeft,
            s -= t.offsetTop;
            return {
                left: i,
                top: s
            }
        },
        o.preventDefaultException = function(t, i) {
            for (var s in i) if (i[s].test(t[s])) return ! 0;
            return ! 1
        },
        o.extend(o.eventType = {},
        {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        }),
        o.extend(o.ease = {},
        {
            quadratic: {
                style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fn: function(t) {
                    return t * (2 - t)
                }
            },
            circular: {
                style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                fn: function(t) {
                    return s.sqrt(1 - --t * t)
                }
            },
            back: {
                style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                fn: function(t) {
                    var i = 4;
                    return (t -= 1) * t * ((i + 1) * t + i) + 1
                }
            },
            bounce: {
                style: "",
                fn: function(t) {
                    return (t /= 1) < 1 / 2.75 ? 7.5625 * t * t: t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                }
            },
            elastic: {
                style: "",
                fn: function(t) {
                    var i = .22,
                    e = .4;
                    return 0 === t ? 0 : 1 == t ? 1 : e * s.pow(2, -10 * t) * s.sin((t - i / 4) * (2 * s.PI) / i) + 1
                }
            }
        }),
        o.tap = function(t, s) {
            var e = i.createEvent("Event");
            e.initEvent(s, !0, !0),
            e.pageX = t.pageX,
            e.pageY = t.pageY,
            t.target.dispatchEvent(e)
        },
        o.click = function(s) {
            var e, o = s.target;
            /(SELECT|INPUT|TEXTAREA)/i.test(o.tagName) || (e = i.createEvent(t.MouseEvent ? "MouseEvents": "Event"), e.initEvent("click", !0, !0), e.view = s.view || t, e.detail = 1, e.screenX = o.screenX || 0, e.screenY = o.screenY || 0, e.clientX = o.clientX || 0, e.clientY = o.clientY || 0, e.ctrlKey = !!s.ctrlKey, e.altKey = !!s.altKey, e.shiftKey = !!s.shiftKey, e.metaKey = !!s.metaKey, e.button = 0, e.relatedTarget = null, e._constructed = !0, o.dispatchEvent(e))
        },
        o.getTouchAction = function(t, i) {
            var s = "none";
            return "vertical" === t ? s = "pan-y": "horizontal" === t && (s = "pan-x"),
            i && "none" != s && (s += " pinch-zoom"),
            s
        },
        o.getRect = function(t) {
            if (t instanceof SVGElement) {
                var i = t.getBoundingClientRect();
                return {
                    top: i.top,
                    left: i.left,
                    width: i.width,
                    height: i.height
                }
            }
            return {
                top: t.offsetTop,
                left: t.offsetLeft,
                width: t.offsetWidth,
                height: t.offsetHeight
            }
        },
        o
    } ();
    e.prototype = {
        version: "5.2.0-snapshot",
        _init: function() {
            this._initEvents(),
            (this.options.scrollbars || this.options.indicators) && this._initIndicators(),
            this.options.mouseWheel && this._initWheel(),
            this.options.snap && this._initSnap(),
            this.options.keyBindings && this._initKeys()
        },
        destroy: function() {
            this._initEvents(!0),
            clearTimeout(this.resizeTimeout),
            this.resizeTimeout = null,
            this._execEvent("destroy")
        },
        _transitionEnd: function(t) {
            t.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
        },
        _start: function(t) {
            if (1 != h.eventType[t.type]) {
                var i;
                if (i = t.which ? t.button: t.button < 2 ? 0 : 4 == t.button ? 1 : 2, 0 !== i) return
            }
            if (this.enabled && (!this.initiated || h.eventType[t.type] === this.initiated)) { ! this.options.preventDefault || h.isBadAndroid || h.preventDefaultException(t.target, this.options.preventDefaultException) || t.preventDefault();
                var e, o = t.touches ? t.touches[0] : t;
                this.initiated = h.eventType[t.type],
                this.moved = !1,
                this.distX = 0,
                this.distY = 0,
                this.directionX = 0,
                this.directionY = 0,
                this.directionLocked = 0,
                this.startTime = h.getTime(),
                this.options.useTransition && this.isInTransition ? (this._transitionTime(), this.isInTransition = !1, e = this.getComputedPosition(), this._translate(s.round(e.x), s.round(e.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")),
                this.startX = this.x,
                this.startY = this.y,
                this.absStartX = this.x,
                this.absStartY = this.y,
                this.pointX = o.pageX,
                this.pointY = o.pageY,
                this._execEvent("beforeScrollStart")
            }
        },
        _move: function(t) {
            if (this.enabled && h.eventType[t.type] === this.initiated) {
                this.options.preventDefault && t.preventDefault();
                var i, e, o, n, r = t.touches ? t.touches[0] : t,
                a = r.pageX - this.pointX,
                l = r.pageY - this.pointY,
                c = h.getTime();
                if (this.pointX = r.pageX, this.pointY = r.pageY, this.distX += a, this.distY += l, o = s.abs(this.distX), n = s.abs(this.distY), !(c - this.endTime > 300 && o < 10 && n < 10)) {
                    if (this.directionLocked || this.options.freeScroll || (o > n + this.options.directionLockThreshold ? this.directionLocked = "h": n >= o + this.options.directionLockThreshold ? this.directionLocked = "v": this.directionLocked = "n"), "h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough) t.preventDefault();
                        else if ("horizontal" == this.options.eventPassthrough) return void(this.initiated = !1);
                        l = 0
                    } else if ("v" == this.directionLocked) {
                        if ("horizontal" == this.options.eventPassthrough) t.preventDefault();
                        else if ("vertical" == this.options.eventPassthrough) return void(this.initiated = !1);
                        a = 0
                    }
                    a = this.hasHorizontalScroll ? a: 0,
                    l = this.hasVerticalScroll ? l: 0,
                    i = this.x + a,
                    e = this.y + l,
                    (i > this.minScrollY || i < this.maxScrollX) && (i = this.options.bounce ? this.x + a / 3 : i > 0 ? 0 : this.maxScrollX),
                    (e > this.minScrollY || e < this.maxScrollY) && (e = this.options.bounce ? this.y + l / 3 : e > this.minScrollY ? this.minScrollY: this.maxScrollY),
                    this.directionX = a > 0 ? -1 : a < 0 ? 1 : 0,
                    this.directionY = l > 0 ? -1 : l < 0 ? 1 : 0,
                    this.moved || this._execEvent("scrollStart"),
                    this.moved = !0,
                    this._translate(i, e),
//                  console.log("move"+e);
                    c - this.startTime > 300 && (this.startTime = c, this.startX = this.x, this.startY = this.y, 1 == this.options.probeType && this._execEvent("scroll")),
                    this.options.probeType > 1 && this._execEvent("scroll")
                }
            }
        },
        _end: function(t) {
            if (this.enabled && h.eventType[t.type] === this.initiated) {
                this.options.preventDefault && !h.preventDefaultException(t.target, this.options.preventDefaultException) && t.preventDefault(),
                this._execEvent("touchEnd");
                var i, e, o = (t.changedTouches ? t.changedTouches[0] : t, h.getTime() - this.startTime),
                n = s.round(this.x),
                r = s.round(this.y),
                a = s.abs(n - this.startX),
                l = s.abs(r - this.startY),
                c = 0,
                p = "";
                if (this.isInTransition = 0, this.initiated = 0, this.endTime = h.getTime(), !this.resetPosition(this.options.bounceTime)) {
                    if (this.scrollTo(n, r), !this.moved) return this.options.tap && h.tap(t, this.options.tap),
                    this.options.click && h.click(t),
                    void this._execEvent("scrollCancel");
                    if (this._events.flick && o < 200 && a < 100 && l < 100) return void this._execEvent("flick");
                    if (this.options.momentum && o < 300 && (i = this.hasHorizontalScroll ? h.momentum(this.x, this.startX, o, this.maxScrollX, this.options.bounce ? this.wrapperWidth: 0, this.options.deceleration) : {
                        destination: n,
                        duration: 0
                    },
                    e = this.hasVerticalScroll ? h.momentum(this.y, this.startY, o, this.maxScrollY, this.options.bounce ? this.wrapperHeight: 0, this.options.deceleration) : {
                        destination: r,
                        duration: 0
                    },
                    n = i.destination, r = e.destination, c = s.max(i.duration, e.duration), this.isInTransition = 1), this.options.snap) {
                        var u = this._nearestSnap(n, r);
                        this.currentPage = u,
                        c = this.options.snapSpeed || s.max(s.max(s.min(s.abs(n - u.x), 1e3), s.min(s.abs(r - u.y), 1e3)), 300),
                        n = u.x,
                        r = u.y,
                        this.directionX = 0,
                        this.directionY = 0,
                        p = this.options.bounceEasing
                    }
                    return n != this.x || r != this.y ? ((n > 0 || n < this.maxScrollX || r > this.minScrollY || r < this.maxScrollY) && (p = h.ease.quadratic), void this.scrollTo(n, r, c, p)) : void this._execEvent("scrollEnd")
                }
            }
        },
        _resize: function() {
            var t = this;
            clearTimeout(this.resizeTimeout),
            this.resizeTimeout = setTimeout(function() {
                t.refresh()
            },
            this.options.resizePolling)
        },
        resetPosition: function(t) {
            var i = this.x,
            s = this.y;
            return t = t || 0,
            !this.hasHorizontalScroll || this.x > 0 ? i = 0 : this.x < this.maxScrollX && (i = this.maxScrollX),
            !this.hasVerticalScroll || this.y > this.minScrollY ? s = this.minScrollY: this.y < this.maxScrollY && (s = this.maxScrollY),
            (i != this.x || s != this.y) && (this.scrollTo(i, s, t, this.options.bounceEasing), !0)
        },
        disable: function() {
            this.enabled = !1
        },
        enable: function() {
            this.enabled = !0
        },
        refresh: function() {
            h.getRect(this.wrapper),
            this.wrapperWidth = this.wrapper.clientWidth,
            this.wrapperHeight = this.wrapper.clientHeight;
            var t = h.getRect(this.scroller);
            this.scrollerWidth = t.width,
            this.scrollerHeight = t.height,
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth,
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight,
            this.minScrollY = this.minScrollY || 0,
            this.maxScrollY > this.minScrollY && (this.maxScrollY = this.minScrollY),
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0,
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0,
            this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth),
            this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight),
            this.endTime = 0,
            this.directionX = 0,
            this.directionY = 0,
            h.hasPointer && !this.options.disablePointer && (this.wrapper.style[h.style.touchAction] = h.getTouchAction(this.options.eventPassthrough, !0), this.wrapper.style[h.style.touchAction] || (this.wrapper.style[h.style.touchAction] = h.getTouchAction(this.options.eventPassthrough, !1))),
            this.wrapperOffset = h.offset(this.wrapper),
            this._execEvent("refresh"),
            this.resetPosition()
        },
        on: function(t, i) {
            this._events[t] || (this._events[t] = []),
            this._events[t].push(i)
        },
        off: function(t, i) {
            if (this._events[t]) {
                var s = this._events[t].indexOf(i);
                s > -1 && this._events[t].splice(s, 1)
            }
        },
        _execEvent: function(t) {
            if (this._events[t]) {
                var i = 0,
                s = this._events[t].length;
                if (s) for (; i < s; i++) this._events[t][i].apply(this, [].slice.call(arguments, 1))
            }
        },
        scrollBy: function(t, i, s, e) {
            t = this.x + t,
//          console.log(i);
            i = this.y + i,
            s = s || 0,
            this.scrollTo(t, i, s, e)
        },
        scrollTo: function(t, i, s, e) {
//      	console.log("scrollTo"+i);
            e = e || h.ease.circular,
            this.isInTransition = this.options.useTransition && s > 0;
            var o = this.options.useTransition && e.style; ! s || o ? (o && (this._transitionTimingFunction(e.style), this._transitionTime(s)), this._translate(t, i)) : this._animate(t, i, s, e.fn)
        },
        scrollToElement: function(t, i, e, o, n) {
            if (t = t.nodeType ? t: this.scroller.querySelector(t)) {
                var r = h.offset(t);
                r.left -= this.wrapperOffset.left,
                r.top -= this.wrapperOffset.top;
                var a = h.getRect(t),
                l = h.getRect(this.wrapper);
                e === !0 && (e = s.round(a.width / 2 - l.width / 2)),
                o === !0 && (o = s.round(a.height / 2 - l.height / 2)),
                r.left -= e || 0,
                r.top -= o || 0,
                r.left = r.left > 0 ? 0 : r.left < this.maxScrollX ? this.maxScrollX: r.left,
                r.top = r.top > 0 ? 0 : r.top < this.maxScrollY ? this.maxScrollY: r.top,
                i = void 0 === i || null === i || "auto" === i ? s.max(s.abs(this.x - r.left), s.abs(this.y - r.top)) : i,
                this.scrollTo(r.left, r.top, i, n)
            }
        },
        _transitionTime: function(t) {
            if (this.options.useTransition) {
                t = t || 0;
                var i = h.style.transitionDuration;
                if (i) {
                    if (this.scrollerStyle[i] = t + "ms", !t && h.isBadAndroid) {
                        this.scrollerStyle[i] = "0.0001ms";
                        var s = this;
                        r(function() {
                            "0.0001ms" === s.scrollerStyle[i] && (s.scrollerStyle[i] = "0s")
                        })
                    }
                    if (this.indicators) for (var e = this.indicators.length; e--;) this.indicators[e].transitionTime(t)
                }
            }
        },
        _transitionTimingFunction: function(t) {
            if (this.scrollerStyle[h.style.transitionTimingFunction] = t, this.indicators) for (var i = this.indicators.length; i--;) this.indicators[i].transitionTimingFunction(t)
        },
        _translate: function(t, i) {
//      	console.log("translate"+i);
            if (this.options.useTransform ? this.scrollerStyle[h.style.transform] = "translate(" + t + "px," + i + "px)" + this.translateZ: (t = s.round(t), i = s.round(i), this.scrollerStyle.left = t + "px", this.scrollerStyle.top = i + "px"), this.x = t, this.y = i, this.indicators) for (var e = this.indicators.length; e--;) this.indicators[e].updatePosition()
        },
        _initEvents: function(i) {
            var s = i ? h.removeEvent: h.addEvent,
            e = this.options.bindToWrapper ? this.wrapper: t;
            s(t, "orientationchange", this),
            s(t, "resize", this),
            this.options.click && s(this.wrapper, "click", this, !0),
            this.options.disableMouse || (s(this.wrapper, "mousedown", this), s(e, "mousemove", this), s(e, "mousecancel", this), s(e, "mouseup", this)),
            h.hasPointer && !this.options.disablePointer && (s(this.wrapper, h.prefixPointerEvent("pointerdown"), this), s(e, h.prefixPointerEvent("pointermove"), this), s(e, h.prefixPointerEvent("pointercancel"), this), s(e, h.prefixPointerEvent("pointerup"), this)),
            h.hasTouch && !this.options.disableTouch && (s(this.wrapper, "touchstart", this), s(e, "touchmove", this), s(e, "touchcancel", this), s(e, "touchend", this)),
            s(this.scroller, "transitionend", this),
            s(this.scroller, "webkitTransitionEnd", this),
            s(this.scroller, "oTransitionEnd", this),
            s(this.scroller, "MSTransitionEnd", this)
        },
        getComputedPosition: function() {
            var i, s, e = t.getComputedStyle(this.scroller, null);
            return this.options.useTransform ? (e = e[h.style.transform].split(")")[0].split(", "), i = +(e[12] || e[4]), s = +(e[13] || e[5])) : (i = +e.left.replace(/[^-\d.]/g, ""), s = +e.top.replace(/[^-\d.]/g, "")),
            {
                x: i,
                y: s
            }
        },
        _initIndicators: function() {
            function t(t) {
                if (h.indicators) for (var i = h.indicators.length; i--;) t.call(h.indicators[i])
            }
            var i, s = this.options.interactiveScrollbars,
            e = "string" != typeof this.options.scrollbars,
            r = [],
            h = this;
            this.indicators = [],
            this.options.scrollbars && (this.options.scrollY && (i = {
                el: o("v", s, this.options.scrollbars),
                interactive: s,
                defaultScrollbars: !0,
                customStyle: e,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenX: !1
            },
            this.wrapper.appendChild(i.el), r.push(i)), this.options.scrollX && (i = {
                el: o("h", s, this.options.scrollbars),
                interactive: s,
                defaultScrollbars: !0,
                customStyle: e,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenY: !1
            },
            this.wrapper.appendChild(i.el), r.push(i))),
            this.options.indicators && (r = r.concat(this.options.indicators));
            for (var a = r.length; a--;) this.indicators.push(new n(this, r[a]));
            this.options.fadeScrollbars && (this.on("scrollEnd",
            function() {
                t(function() {
                    this.fade()
                })
            }), this.on("scrollCancel",
            function() {
                t(function() {
                    this.fade()
                })
            }), this.on("scrollStart",
            function() {
                t(function() {
                    this.fade(1)
                })
            }), this.on("beforeScrollStart",
            function() {
                t(function() {
                    this.fade(1, !0)
                })
            })),
            this.on("refresh",
            function() {
                t(function() {
                    this.refresh()
                })
            }),
            this.on("destroy",
            function() {
                t(function() {
                    this.destroy()
                }),
                delete this.indicators
            })
        },
        _initWheel: function() {
            h.addEvent(this.wrapper, "wheel", this),
            h.addEvent(this.wrapper, "mousewheel", this),
            h.addEvent(this.wrapper, "DOMMouseScroll", this),
            this.on("destroy",
            function() {
                clearTimeout(this.wheelTimeout),
                this.wheelTimeout = null,
                h.removeEvent(this.wrapper, "wheel", this),
                h.removeEvent(this.wrapper, "mousewheel", this),
                h.removeEvent(this.wrapper, "DOMMouseScroll", this)
            })
        },
        _wheel: function(t) {
            if (this.enabled) {
                t.preventDefault();
                var i, e, o, n, r = this;
                if (void 0 === this.wheelTimeout && r._execEvent("scrollStart"), clearTimeout(this.wheelTimeout), this.wheelTimeout = setTimeout(function() {
                    r.options.snap || r._execEvent("scrollEnd"),
                    r.wheelTimeout = void 0
                },
                400), "deltaX" in t) 1 === t.deltaMode ? (i = -t.deltaX * this.options.mouseWheelSpeed, e = -t.deltaY * this.options.mouseWheelSpeed) : (i = -t.deltaX, e = -t.deltaY);
                else if ("wheelDeltaX" in t) i = t.wheelDeltaX / 120 * this.options.mouseWheelSpeed,
                e = t.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                else if ("wheelDelta" in t) i = e = t.wheelDelta / 120 * this.options.mouseWheelSpeed;
                else {
                    if (! ("detail" in t)) return;
                    i = e = -t.detail / 3 * this.options.mouseWheelSpeed
                }
                if (i *= this.options.invertWheelDirection, e *= this.options.invertWheelDirection, this.hasVerticalScroll || (i = e, e = 0), this.options.snap) return o = this.currentPage.pageX,
                n = this.currentPage.pageY,
                i > 0 ? o--:i < 0 && o++,
                e > 0 ? n--:e < 0 && n++,
                void this.goToPage(o, n);
                o = this.x + s.round(this.hasHorizontalScroll ? i: 0),
                n = this.y + s.round(this.hasVerticalScroll ? e: 0),
                this.directionX = i > 0 ? -1 : i < 0 ? 1 : 0,
                this.directionY = e > 0 ? -1 : e < 0 ? 1 : 0,
                o > 0 ? o = 0 : o < this.maxScrollX && (o = this.maxScrollX),
                n > this.minScrollY ? n = this.minScrollY: n < this.maxScrollY && (n = this.maxScrollY),
                this.scrollTo(o, n, 0),
                this.options.probeType > 1 && this._execEvent("scroll")
            }
        },
        _initSnap: function() {
            this.currentPage = {},
            "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)),
            this.on("refresh",
            function() {
                var t, i, e, o, n, r, a, l = 0,
                c = 0,
                p = 0,
                u = this.options.snapStepX || this.wrapperWidth,
                d = this.options.snapStepY || this.wrapperHeight;
                if (this.pages = [], this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
                    if (this.options.snap === !0) for (e = s.round(u / 2), o = s.round(d / 2); p > -this.scrollerWidth;) {
                        for (this.pages[l] = [], t = 0, n = 0; n > -this.scrollerHeight;) this.pages[l][t] = {
                            x: s.max(p, this.maxScrollX),
                            y: s.max(n, this.maxScrollY),
                            width: u,
                            height: d,
                            cx: p - e,
                            cy: n - o
                        },
                        n -= d,
                        t++;
                        p -= u,
                        l++
                    } else for (r = this.options.snap, t = r.length, i = -1; l < t; l++) a = h.getRect(r[l]),
                    (0 === l || a.left <= h.getRect(r[l - 1]).left) && (c = 0, i++),
                    this.pages[c] || (this.pages[c] = []),
                    p = s.max( - a.left, this.maxScrollX),
                    n = s.max( - a.top, this.maxScrollY),
                    e = p - s.round(a.width / 2),
                    o = n - s.round(a.height / 2),
                    this.pages[c][i] = {
                        x: p,
                        y: n,
                        width: a.width,
                        height: a.height,
                        cx: e,
                        cy: o
                    },
                    p > this.maxScrollX && c++;
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0),
                    this.options.snapThreshold % 1 === 0 ? (this.snapThresholdX = this.options.snapThreshold, this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), this.snapThresholdY = s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
                }
            }),
            this.on("flick",
            function() {
                var t = this.options.snapSpeed || s.max(s.max(s.min(s.abs(this.x - this.startX), 1e3), s.min(s.abs(this.y - this.startY), 1e3)), 300);
                this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, t)
            })
        },
        _nearestSnap: function(t, i) {
            if (!this.pages.length) return {
                x: 0,
                y: 0,
                pageX: 0,
                pageY: 0
            };
            var e = 0,
            o = this.pages.length,
            n = 0;
            if (s.abs(t - this.absStartX) < this.snapThresholdX && s.abs(i - this.absStartY) < this.snapThresholdY) return this.currentPage;
            for (t > 0 ? t = 0 : t < this.maxScrollX && (t = this.maxScrollX), i > this.minScrollY ? i = this.minScrollY: i < this.maxScrollY && (i = this.maxScrollY); e < o; e++) if (t >= this.pages[e][0].cx) {
                t = this.pages[e][0].x;
                break
            }
            for (o = this.pages[e].length; n < o; n++) if (i >= this.pages[0][n].cy) {
                i = this.pages[0][n].y;
                break
            }
            return e == this.currentPage.pageX && (e += this.directionX, e < 0 ? e = 0 : e >= this.pages.length && (e = this.pages.length - 1), t = this.pages[e][0].x),
            n == this.currentPage.pageY && (n += this.directionY, n < 0 ? n = 0 : n >= this.pages[0].length && (n = this.pages[0].length - 1), i = this.pages[0][n].y),
            {
                x: t,
                y: i,
                pageX: e,
                pageY: n
            }
        },
        goToPage: function(t, i, e, o) {
            o = o || this.options.bounceEasing,
            t >= this.pages.length ? t = this.pages.length - 1 : t < 0 && (t = 0),
            i >= this.pages[t].length ? i = this.pages[t].length - 1 : i < 0 && (i = 0);
            var n = this.pages[t][i].x,
            r = this.pages[t][i].y;
            e = void 0 === e ? this.options.snapSpeed || s.max(s.max(s.min(s.abs(n - this.x), 1e3), s.min(s.abs(r - this.y), 1e3)), 300) : e,
            this.currentPage = {
                x: n,
                y: r,
                pageX: t,
                pageY: i
            },
            this.scrollTo(n, r, e, o)
        },
        next: function(t, i) {
            var s = this.currentPage.pageX,
            e = this.currentPage.pageY;
            s++,
            s >= this.pages.length && this.hasVerticalScroll && (s = 0, e++),
            this.goToPage(s, e, t, i)
        },
        prev: function(t, i) {
            var s = this.currentPage.pageX,
            e = this.currentPage.pageY;
            s--,
            s < 0 && this.hasVerticalScroll && (s = 0, e--),
            this.goToPage(s, e, t, i)
        },
        _initKeys: function(i) {
            var s, e = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            if ("object" == typeof this.options.keyBindings) for (s in this.options.keyBindings)"string" == typeof this.options.keyBindings[s] && (this.options.keyBindings[s] = this.options.keyBindings[s].toUpperCase().charCodeAt(0));
            else this.options.keyBindings = {};
            for (s in e) this.options.keyBindings[s] = this.options.keyBindings[s] || e[s];
            h.addEvent(t, "keydown", this),
            this.on("destroy",
            function() {
                h.removeEvent(t, "keydown", this)
            })
        },
        _key: function(t) {
            if (this.enabled) {
                var i, e = this.options.snap,
                o = e ? this.currentPage.pageX: this.x,
                n = e ? this.currentPage.pageY: this.y,
                r = h.getTime(),
                a = this.keyTime || 0,
                l = .25;
//              console.log("key"+s.round(i.y));
                switch (this.options.useTransition && this.isInTransition && (i = this.getComputedPosition(), this._translate(s.round(i.x), s.round(i.y)), this.isInTransition = !1), this.keyAcceleration = r - a < 200 ? s.min(this.keyAcceleration + l, 50) : 0, t.keyCode) {
                case this.options.keyBindings.pageUp:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? o += e ? 1 : this.wrapperWidth: n += e ? 1 : this.wrapperHeight;
                    break;
                case this.options.keyBindings.pageDown:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? o -= e ? 1 : this.wrapperWidth: n -= e ? 1 : this.wrapperHeight;
                    break;
                case this.options.keyBindings.end:
                    o = e ? this.pages.length - 1 : this.maxScrollX,
                    n = e ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    o = 0,
                    n = 0;
                    break;
                case this.options.keyBindings.left:
                    o += e ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.up:
                    n += e ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.right:
                    o -= e ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.down:
                    n -= e ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                default:
                    return
                }
                if (e) return void this.goToPage(o, n);
                o > 0 ? (o = 0, this.keyAcceleration = 0) : o < this.maxScrollX && (o = this.maxScrollX, this.keyAcceleration = 0),
                n > this.minScrollY ? (n = this.minScrollY, this.keyAcceleration = 0) : n < this.maxScrollY && (n = this.maxScrollY, this.keyAcceleration = 0),
                this.scrollTo(o, n, 0),
                this.keyTime = r
            }
        },
        _animate: function(t, i, s, e) {
//      	console.log("animate"+i);
            function o() {
                var u, d, f, m = h.getTime();
                return m >= p ? (n.isAnimating = !1, n._translate(t, i), void(n.resetPosition(n.options.bounceTime) || n._execEvent("scrollEnd"))) : (m = (m - c) / s, f = e(m), u = (t - a) * f + a, d = (i - l) * f + l, n._translate(u, d), n.isAnimating && r(o), void(3 == n.options.probeType && n._execEvent("scroll")))
            }
            var n = this,
            a = this.x,
            l = this.y,
            c = h.getTime(),
            p = c + s;
            this.isAnimating = !0,
            o()
        },
        handleEvent: function(t) {
            switch (t.type) {
            case "touchstart":
            case "pointerdown":
            case "MSPointerDown":
            case "mousedown":
                this._start(t);
                break;
            case "touchmove":
            case "pointermove":
            case "MSPointerMove":
            case "mousemove":
                this._move(t);
                break;
            case "touchend":
            case "pointerup":
            case "MSPointerUp":
            case "mouseup":
            case "touchcancel":
            case "pointercancel":
            case "MSPointerCancel":
            case "mousecancel":
                this._end(t);
                break;
            case "orientationchange":
            case "resize":
                this._resize();
                break;
            case "transitionend":
            case "webkitTransitionEnd":
            case "oTransitionEnd":
            case "MSTransitionEnd":
                this._transitionEnd(t);
                break;
            case "wheel":
            case "DOMMouseScroll":
            case "mousewheel":
                this._wheel(t);
                break;
            case "keydown":
                this._key(t);
                break;
            case "click":
                this.enabled && !t._constructed && (t.preventDefault(), t.stopPropagation())
            }
        }
    },
    n.prototype = {
        handleEvent: function(t) {
            switch (t.type) {
            case "touchstart":
            case "pointerdown":
            case "MSPointerDown":
            case "mousedown":
                this._start(t);
                break;
            case "touchmove":
            case "pointermove":
            case "MSPointerMove":
            case "mousemove":
                this._move(t);
                break;
            case "touchend":
            case "pointerup":
            case "MSPointerUp":
            case "mouseup":
            case "touchcancel":
            case "pointercancel":
            case "MSPointerCancel":
            case "mousecancel":
                this._end(t)
            }
        },
        destroy: function() {
            this.options.fadeScrollbars && (clearTimeout(this.fadeTimeout), this.fadeTimeout = null),
            this.options.interactive && (h.removeEvent(this.indicator, "touchstart", this), h.removeEvent(this.indicator, h.prefixPointerEvent("pointerdown"), this), h.removeEvent(this.indicator, "mousedown", this), h.removeEvent(t, "touchmove", this), h.removeEvent(t, h.prefixPointerEvent("pointermove"), this), h.removeEvent(t, "mousemove", this), h.removeEvent(t, "touchend", this), h.removeEvent(t, h.prefixPointerEvent("pointerup"), this), h.removeEvent(t, "mouseup", this)),
            this.options.defaultScrollbars && this.wrapper.parentNode && this.wrapper.parentNode.removeChild(this.wrapper)
        },
        _start: function(i) {
            var s = i.touches ? i.touches[0] : i;
            i.preventDefault(),
            i.stopPropagation(),
            this.transitionTime(),
            this.initiated = !0,
            this.moved = !1,
            this.lastPointX = s.pageX,
            this.lastPointY = s.pageY,
            this.startTime = h.getTime(),
            this.options.disableTouch || h.addEvent(t, "touchmove", this),
            this.options.disablePointer || h.addEvent(t, h.prefixPointerEvent("pointermove"), this),
            this.options.disableMouse || h.addEvent(t, "mousemove", this),
            this.scroller._execEvent("beforeScrollStart")
        },
        _move: function(t) {
            var i, s, e, o, n = t.touches ? t.touches[0] : t,
            r = h.getTime();
            this.moved || this.scroller._execEvent("scrollStart"),
            this.moved = !0,
            i = n.pageX - this.lastPointX,
            this.lastPointX = n.pageX,
            s = n.pageY - this.lastPointY,
            this.lastPointY = n.pageY,
            e = this.x + i,
            o = this.y + s,
            this._pos(e, o),
            1 == this.scroller.options.probeType && r - this.startTime > 300 ? (this.startTime = r, this.scroller._execEvent("scroll")) : this.scroller.options.probeType > 1 && this.scroller._execEvent("scroll"),
            t.preventDefault(),
            t.stopPropagation()
        },
        _end: function(i) {
            if (this.initiated) {
                if (this.initiated = !1, i.preventDefault(), i.stopPropagation(), h.removeEvent(t, "touchmove", this), h.removeEvent(t, h.prefixPointerEvent("pointermove"), this), h.removeEvent(t, "mousemove", this), this.scroller.options.snap) {
                    var e = this.scroller._nearestSnap(this.scroller.x, this.scroller.y),
                    o = this.options.snapSpeed || s.max(s.max(s.min(s.abs(this.scroller.x - e.x), 1e3), s.min(s.abs(this.scroller.y - e.y), 1e3)), 300);
                    this.scroller.x == e.x && this.scroller.y == e.y || (this.scroller.directionX = 0, this.scroller.directionY = 0, this.scroller.currentPage = e, this.scroller.scrollTo(e.x, e.y, o, this.scroller.options.bounceEasing))
                }
                this.moved && this.scroller._execEvent("scrollEnd")
            }
        },
        transitionTime: function(t) {
            t = t || 0;
            var i = h.style.transitionDuration;
            if (i && (this.indicatorStyle[i] = t + "ms", !t && h.isBadAndroid)) {
                this.indicatorStyle[i] = "0.0001ms";
                var s = this;
                r(function() {
                    "0.0001ms" === s.indicatorStyle[i] && (s.indicatorStyle[i] = "0s")
                })
            }
        },
        transitionTimingFunction: function(t) {
            this.indicatorStyle[h.style.transitionTimingFunction] = t
        },
        refresh: function() {
            this.transitionTime(),
            this.options.listenX && !this.options.listenY ? this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? "block": "none": this.options.listenY && !this.options.listenX ? this.indicatorStyle.display = this.scroller.hasVerticalScroll ? "block": "none": this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block": "none",
            this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (h.addClass(this.wrapper, "iScrollBothScrollbars"), h.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px": this.wrapper.style.bottom = "8px")) : (h.removeClass(this.wrapper, "iScrollBothScrollbars"), h.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px": this.wrapper.style.bottom = "2px")),
            h.getRect(this.wrapper),
            this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = s.max(s.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8), this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth, this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0, this.maxBoundaryX = this.maxPosX), this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX),
            this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ? (this.indicatorHeight = s.max(s.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), this.maxPosY = this.wrapperHeight - this.indicatorHeight, this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY),
            this.updatePosition()
        },
        updatePosition: function() {
            var t = this.options.listenX && s.round(this.sizeRatioX * this.scroller.x) || 0,
            i = this.options.listenY && s.round(this.sizeRatioY * this.scroller.y) || 0;
            this.options.ignoreBoundaries || (t < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = s.max(this.indicatorWidth + t, 8), this.indicatorStyle.width = this.width + "px"), t = this.minBoundaryX) : t > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = s.max(this.indicatorWidth - (t - this.maxPosX), 8), this.indicatorStyle.width = this.width + "px", t = this.maxPosX + this.indicatorWidth - this.width) : t = this.maxBoundaryX: "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, this.indicatorStyle.width = this.width + "px"), i < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = s.max(this.indicatorHeight + 3 * i, 8), this.indicatorStyle.height = this.height + "px"), i = this.minBoundaryY) : i > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = s.max(this.indicatorHeight - 3 * (i - this.maxPosY), 8), this.indicatorStyle.height = this.height + "px", i = this.maxPosY + this.indicatorHeight - this.height) : i = this.maxBoundaryY: "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, this.indicatorStyle.height = this.height + "px")),
            this.x = t,
            this.y = i,
            this.scroller.options.useTransform ? this.indicatorStyle[h.style.transform] = "translate(" + t + "px," + i + "px)" + this.scroller.translateZ: (this.indicatorStyle.left = t + "px", this.indicatorStyle.top = i + "px")
        },
        _pos: function(t, i) {
            t < 0 ? t = 0 : t > this.maxPosX && (t = this.maxPosX),
            i < 0 ? i = 0 : i > this.maxPosY && (i = this.maxPosY),
            t = this.options.listenX ? s.round(t / this.sizeRatioX) : this.scroller.x,
            i = this.options.listenY ? s.round(i / this.sizeRatioY) : this.scroller.y,
            this.scroller.scrollTo(t, i)
        },
        fade: function(t, i) {
            if (!i || this.visible) {
                clearTimeout(this.fadeTimeout),
                this.fadeTimeout = null;
                var s = t ? 250 : 500,
                e = t ? 0 : 300;
                t = t ? "1": "0",
                this.wrapperStyle[h.style.transitionDuration] = s + "ms",
                this.fadeTimeout = setTimeout(function(t) {
                    this.wrapperStyle.opacity = t,
                    this.visible = +t
                }.bind(this, t), e)
            }
        }
    },
    e.utils = h,
    t.IScroll = e
} (window, document, Math);


var PullToRefreshTools = window.PullToRefreshTools ||
function(t, i) {
    return function() {
        t.uuid = function(t, i) {
            var s, e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
            o = [];
            if (i = i || e.length, t) for (s = 0; s < t; s++) o[s] = e[0 | Math.random() * i];
            else {
                var n;
                for (o[8] = o[13] = o[18] = o[23] = "-", o[14] = "4", s = 0; s < 36; s++) o[s] || (n = 0 | 16 * Math.random(), o[s] = e[19 == s ? 3 & n | 8 : n])
            }
            return o.join("")
        },
        t.noop = function() {},
        t.extend = function() {
            var s, e, o, n, r, h, a = arguments[0] || {},
            l = 1,
            c = arguments.length,
            p = !1;
            for ("boolean" == typeof a && (p = a, a = arguments[l] || {},
            l++), "object" == typeof a || t.isFunction(a) || (a = {}), l === c && (a = this, l--); l < c; l++) if (null != (s = arguments[l])) for (e in s) o = a[e],
            n = s[e],
            a !== n && (p && n && (t.isPlainObject(n) || (r = t.isArray(n))) ? (r ? (r = !1, h = o && t.isArray(o) ? o: []) : h = o && t.isPlainObject(o) ? o: {},
            a[e] = t.extend(p, h, n)) : n !== i && (a[e] = n));
            return a
        },
        t.isFunction = function(i) {
            return "function" === t.type(i)
        },
        t.isPlainObject = function(i) {
            return t.isObject(i) && !t.isWindow(i) && Object.getPrototypeOf(i) === Object.prototype
        },
        t.isArray = Array.isArray ||
        function(t) {
            return t instanceof Array
        },
        t.isWindow = function(t) {
            return null != t && t === t.window
        },
        t.isObject = function(i) {
            return "object" === t.type(i)
        },
        t.type = function(t) {
            return null == t ? String(t) : s[{}.toString.call(t)] || "object"
        },
        t.each = function(t, i, s) {
            if (!t) return this;
            if ("number" == typeof t.length)[].every.call(t,
            function(t, s) {
                return i.call(t, s, t) !== !1
            });
            else for (var e in t) if (s) {
                if (t.hasOwnProperty(e) && i.call(t[e], e, t[e]) === !1) return t
            } else if (i.call(t[e], e, t[e]) === !1) return t;
            return this
        },
        t.selector = function(t) {
            return "string" == typeof t && (t = document.querySelector(t)),
            t
        };
        var s = {};
        t.each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"],
        function(t, i) {
            s["[object " + i + "]"] = i.toLowerCase()
        }),
        function() {
            function i(i) {
                this.os = {},
                this.os.name = "browser";
                var s = [function() {
                    var t = i.match(/(Android);?[\s\/]+([\d.]+)?/);
                    return t && (this.os.android = !0, this.os.version = t[2], this.os.isBadAndroid = !/Chrome\/\d/.test(window.navigator.appVersion), this.os.name += "_Android", this.os.name += "_mobile"),
                    this.os.android === !0
                },
                function() {
                    var t = i.match(/(iPhone\sOS)\s([\d_]+)/);
                    if (t) this.os.ios = this.os.iphone = !0,
                    this.os.version = t[2].replace(/_/g, "."),
                    this.os.name += "_iphone",
                    this.os.name += "_mobile";
                    else {
                        var s = i.match(/(iPad).*OS\s([\d_]+)/);
                        s && (this.os.ios = this.os.ipad = !0, this.os.version = s[2].replace(/_/g, "."), this.os.name += "_iOS", this.os.name += "_mobile")
                    }
                    return this.os.ios === !0
                }]; [].every.call(s,
                function(i) {
                    return ! i.call(t)
                })
            }
            i.call(t, navigator.userAgent)
        } (),
        function() {
            function i(t) {
                this.os = this.os || {};
                var i = t.match(/EpointEJS/i);
                i && (this.os.ejs = !0, this.os.name += "_ejs");
                var s = t.match(/DingTalk/i);
                s && (this.os.dd = !0, this.os.name += "_dd")
            }
            i.call(t, navigator.userAgent)
        } ()
    } (),
    function() {
        var i = !1,
        s = /xyz/.test(function() {
            xyz
        }) ? /\b_super\b/: /.*/,
        e = function() {};
        e.extend = function(t) {
            function e() { ! i && this.init && this.init.apply(this, arguments)
            }
            var o = this.prototype;
            i = !0;
            var n = new this;
            i = !1;
            for (var r in t) n[r] = "function" == typeof t[r] && "function" == typeof o[r] && s.test(t[r]) ?
            function(t, i) {
                return function() {
                    var s = this._super;
                    this._super = o[t];
                    var e = i.apply(this, arguments);
                    return this._super = s,
                    e
                }
            } (r, t[r]) : t[r];
            return e.prototype = n,
            e.prototype.constructor = e,
            e.extend = this.extend,
            e
        },
        t.Clazz = e
    } (),
    function() {
        t.namespace = function(t, i) {
            var s = window.PullToRefreshTools;
            if (!t) return s;
            for (var e = t.split("."), o = e.length, n = 0; n < o - 1; n++) {
                var r = e[n];
                s[r] = s[r] || {},
                s = s[r]
            }
            return s[e[o - 1]] = i,
            s[e[o - 1]]
        },
        t.getNameSpaceObj = function(t, i) {
            if (!i) return null;
            for (var s = i.split("."), e = s.length, o = 0; o < e; o++) t && (t = t[s[o]]);
            return t
        }
    } (),
    "undefined" != typeof module && module.exports ? module.exports = t: "function" == typeof define && (define.amd || define.cmd) && define(function() {
        return t
    }),
    t
} ({}); !
function(t, i) {
    var s = {
        down: {
            height: 75,
            contentdown: "下拉可以刷新",
            contentover: "释放立即刷新",
            contentrefresh: "正在刷新",
            contentrefreshsuccess: "刷新成功",
            contentrefresherror: "刷新失败",
            isSuccessTips: !0,
            callback: i.noop
        },
        up: {
            auto: !0,
            offset: 100,
            isFastLoading: !1,
            contentdown: "",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了",
            callback: i.noop
        },
        scroll: {
            bounceTime: 500,
            successAnimationTime: 500,
            eventPassthrough: !1
        },
        container: "#pullrefresh"
    },
    e = i.Clazz.extend({
        init: function(t) {
            t = i.extend(!0, {},
            s, t),
            this.container = i.selector(t.container),
            this.options = t,
            this.wrapper = this.container,
            this.scrollWrap = this.container.children[0],
            this.scroller = new IScroll(this.container, {
                probeType: 2,
                tap: !1,
                mouseWheel: !0,
                eventPassthrough: this.options.scroll.eventPassthrough
            }),
            this._initParams(),
            this._initPullToRefreshTipsHook && this._initPullToRefreshTipsHook(this.enablePullDown, this.enablePullUp),
            this._initEvent(),
            t.down && t.down.auto ? this.pulldownLoading() : t.up && t.up.auto && this.pullupLoading()
        },
        _initParams: function() {
            this.enablePullDown = !!this.options.down,
            this.enablePullUp = !!this.options.up,
            this.finished = !1,
            this.offsetY = this.offsetY || 0,
            this.topHeiht = this.options.down && this.options.down.height ? this.options.down.height: 0
        },
        _initEvent: function() {
            var t = this;
            this.scroller.on("scrollStart",
            function() {
                t._handleScrollStart(this)
            }),
            this.scroller.on("scroll",
            function() {
                t._handleScroll(this)
            }),
            this.scroller.on("touchEnd",
            function() {
                t._handleTouchEnd(this)
            }),
            this.scroller.on("scrollEnd",
            function() {
                t._handleScrollEnd(this)
            }),
            this.scroller.on("refresh",
            function() {
                t.scroller.hasVerticalScroll = !0,
                0 == t.scroller.maxScrollY && (t.scroller.maxScrollY = -t.offsetY)
            }),
            this.refresh()
        },
        _handleScrollStart: function(t) {
            this.allowPullDownLoading = !1,
            this.startY = t.y,
            this.startX = t.x,
            this.lastY = t.y;
            var i = (new Date).getTime();
            this.startTime = i,
            this.pulldown = !1
        },
        _handleScroll: function(t) {
            if (!this._isFastScroll()) {
                var i = Math.abs(t.x - this.startX),
                s = Math.abs(t.y - this.startY),
                e = t.y + this.offsetY;
                if (this.lastY = t.y, !(Math.abs(t.distX) > Math.abs(t.distY)) && s > 5 && s > i && !this.loading && !this.allowPullDownSuccessLoading) {
                    var o = this.options.down && this.options.down.height ? this.options.down.height: 0;
                    this.enablePullDown && (!this.pulldown && !this.loading && t.directionY == -1 && t.y + this.offsetY >= 0 && (this.pulldown = !0), t.y + this.offsetY >= o && t.directionY == -1 ? this.loading || (this.allowPullDownLoading = !0) : t.y + this.offsetY < o && t.y + this.offsetY >= 0 && 1 === t.directionY && (this.allowPullDownLoading = !1), this.pulldown && this._pullingHook && this._pullingHook(e, o)),
                    this.enablePullUp && this.options.up && t.y - this.offsetY - this.options.up.offset <= this.scroller.maxScrollY - o && 1 == t.directionY && this._scrollbottom()
                }
            }
        },
        _setOffsetY: function(t, i) {
            var s = this;
            s.offsetY = t || 0,
            s.scroller.minScrollY = -t,
            s.scroller.scrollTo(0, -s.offsetY),
            i && i()
        },
        _handleTouchEnd: function(t) {
            var i = this;
            i.allowPullDownLoading ? i.pulldownLoading(void 0, i.options.scroll.bounceTime) : i.enablePullDown && i._pulldownLoaingAnimationEndHook && i._pulldownLoaingAnimationEndHook()
        },
        _handleScrollEnd: function(t) {
            var i = this,
            s = i.options.down && i.options.down.height ? i.options.down.height: 0;
            i._scrollEndHook && i._scrollEndHook(),
            i.enablePullUp && i.options.up && !i.loading && i.options.up.isFastLoading && t.y - i.offsetY - i.options.up.offset <= i.scroller.maxScrollY - s && i._scrollbottom()
        },
        _isFastScroll: function() {
            var t = !1,
            i = (new Date).getTime(),
            s = i - this.startTime;
            return t = !(s > 100)
        },
        _scrollbottom: function() {
            this.enablePullUp && !this.finished && (this.loading || (this.pulldown = !1, this.pullupLoading()))
        },
        _endPulldownToRefresh: function(t) {
            var i = this;
            if (this.options.down && i.loading) {
                i.allowPullDownLoading = !1,
                i.loading = !1,
                i.allowPullDownSuccessLoading = !0;
                var s;
                i._pulldownLoaingAnimationSuccessHook && i._pulldownLoaingAnimationSuccessHook(function() {
                    s && clearTimeout(s),
                    i.allowPullDownSuccessLoading = !1,
                    i._checkPullDownLoadingEnd()
                },
                t),
                s = setTimeout(function() {
                    s && clearTimeout(s),
                    i.allowPullDownSuccessLoading = !1,
                    i._checkPullDownLoadingEnd()
                },
                i.options.scroll.successAnimationTime)
            }
        },
        _checkPullDownLoadingEnd: function() {
            var t = this;
            t.allowPullDownSuccessLoading || (t._pulldownLoaingAnimationEndHook && t._pulldownLoaingAnimationEndHook(), t.scroller.scrollTo(0, -t.offsetY, t.options.scroll.bounceTime), setTimeout(function() {
                t.scroller.minScrollY = -t.offsetY,
                t.scroller.refresh()
            },
            t.options.scroll.bounceTime))
        },
        _endPullupToRefresh: function(t) {
            var i = this;
            i.pulldown || (i.loading = !1, i.scroller.refresh(), t && (i.finished = !0), i._pullupLoaingAnimationSuccessHook && i._pullupLoaingAnimationSuccessHook(t))
        },
        pulldownLoading: function(t, i) {
            var s = this;
            this.options.down && (s.loading || ("undefined" == typeof t && (t = this.options.down.height - this.offsetY), s.scroller.minScrollY = s.topHeiht - s.offsetY, setTimeout(function() {
                s.scroller.scrollTo(0, t, i || 0),
                s._pulldownLoaingAnimationHook && s._pulldownLoaingAnimationHook(),
                s.loading = !0;
                var e = s.options.down.callback;
                e && e.call(s)
            },
            0)))
        },
        pullupLoading: function(t, i, s) {
            if (this.enablePullUp && this.options.up) {
                if (this.finished && this.refresh(!0), i = i || 0, this.loading) return;
                this.scroller.scrollTo(i, this.scroller.maxScrollY, s),
                this.pulldown = !1,
                this._pullupLoaingAnimationHook && this._pullupLoaingAnimationHook(!1),
                this.loading = !0,
                t = t || this.options.up.callback,
                t && t.call(this)
            }
        },
        disablePullupToRefresh: function() {
            this.enablePullUp = !1,
            this._disablePullUpHook && this._disablePullUpHook()
        },
        enablePullupToRefresh: function() {
            this.enablePullUp = !0,
            this._enablePullUpHook && this._enablePullUpHook()
        },
        refresh: function(t) {
            t && this.finished && (this.enablePullupToRefresh(), this.finished = !1),
            this.scroller.refresh()
        },
        resetLoadingState: function(t, i, s) {
            t && this._endPulldownToRefresh(s),
            i ? this._endPullupToRefresh(!0) : this._endPullupToRefresh(!1)
        },
        endPullDownToRefresh: function(t) {
            null == t && (t = !0),
            this.resetLoadingState(!0, !1, t)
        },
        endPullUpToRefresh: function(t, i) {
            null == i && (i = !0),
            this.resetLoadingState(!1, t, i)
        },
        setSuccessTips: function(t) {
            this.successTips = t
        }
    });
    i.namespace("core", e)
} ({},
PullToRefreshTools),
function(t, i) {
    var s = "mui-",
    e = s + "pull-top-pocket",
    o = s + "pull-bottom-pocket",
    n = s + "pull",
    r = s + "pull-loading",
    h = s + "pull-caption",
    a = s + "pull-caption-down",
    l = s + "pull-caption-refresh",
    c = s + "pull-caption-nomore",
    p = s + "icon",
    u = s + "spinner",
    d = s + "icon-pulldown",
    f = s + "icon-checkmarkempty",
    m = s + "icon-info",
    g = s + "block",
    v = s + "hidden",
    y = s + "visibility",
    w = r + " " + p + " " + d,
    S = r + " " + p + " " + d,
    b = r + " " + p + " " + u,
    T = r + " " + p + " " + f,
    x = r + " " + p + " " + m,
    P = ['<div class="' + n + '">', '<div class="{icon}"></div>', '<div class="' + h + '">{contentrefresh}</div>', "</div>"].join(""),
    k = i.core.extend({
        _initPullToRefreshTipsHook: function(t, i) {
            this._initPocket(),
            i || this.bottomPocket && this.bottomPocket.classList.add(v),
            t || this.topPocket && this.topPocket.classList.add(v)
        },
        _initPulldownRefreshState: function() {
            this.pullPocket = this.topPocket,
            this.pullPocket.classList.add(g),
            this.pullPocket.classList.add(y),
            this.pullCaption = this.topCaption,
            this.pullLoading = this.topLoading
        },
        _initPullupRefreshState: function() {
            this.pullPocket = this.bottomPocket,
            this.pullPocket.classList.add(g),
            this.pullPocket.classList.add(y),
            this.pullCaption = this.bottomCaption,
            this.pullLoading = this.bottomLoading
        },
        _pullingHook: function(t, i) {
            t >= i ? this._setCaption(!0, this.options.down.contentover) : t < i && this._setCaption(!0, this.options.down.contentdown)
        },
        _pulldownLoaingAnimationHook: function() {
            this._setCaption(!0, this.options.down.contentrefresh)
        },
        _pulldownLoaingAnimationSuccessHook: function(t, i) {
            this.options.down.isSuccessTips ? this._setCaption(!0, i ? this.options.down.contentrefreshsuccess: this.options.down.contentrefresherror) : t()
        },
        _pulldownLoaingAnimationEndHook: function() {
            this._setCaption(!0, this.options.down.contentdown, !0),
            this.topPocket.classList.remove(y)
        },
        _pullupLoaingAnimationHook: function(t) {
            this.options.up && this._setCaption(!1, this.options.up.contentrefresh)
        },
        _pullupLoaingAnimationSuccessHook: function(t) {
            this.options.up && (t ? this._setCaption(!1, this.options.up.contentnomore) : this._setCaption(!1, this.options.up.contentdown))
        },
        _disablePullUpHook: function() {
            this.bottomPocket.className = "mui-pull-bottom-pocket " + v
        },
        _enablePullUpHook: function() {
            this.options.up && (this.bottomPocket.classList.remove(v), this._setCaption(!1, this.options.up.contentdown))
        },
        _createPocket: function(t, i, s) {
            var e = document.createElement("div");
            return e.className = t,
            e.innerHTML = P.replace("{contentrefresh}", i.contentinit).replace("{icon}", s),
            e
        },
        _initPocket: function() {
            var t = this.options;
            t.down && t.down.hasOwnProperty("callback") && (this.topPocket = this.wrapper.querySelector("." + e), this.topPocket || (this.topPocket = this._createPocket(e, t.down, S), this.wrapper.insertBefore(this.topPocket, this.wrapper.firstChild)), this.topLoading = this.topPocket.querySelector("." + r), this.topCaption = this.topPocket.querySelector("." + h)),
            t.up && t.up.hasOwnProperty("callback") && (this.bottomPocket = this.scrollWrap.querySelector("." + o), this.bottomPocket || (this.bottomPocket = this._createPocket(o, t.up, b), this.scrollWrap.appendChild(this.bottomPocket)), this.bottomLoading = this.bottomPocket.querySelector("." + r), this.bottomCaption = this.bottomPocket.querySelector("." + h))
        },
        _setCaptionClass: function(t, i, s) {
            if (this.options.up && !t) switch (s) {
            case this.options.up.contentdown:
                i.className = h + " " + a;
                break;
            case this.options.up.contentrefresh:
                i.className = h + " " + l;
                break;
            case this.options.up.contentnomore:
                i.className = h + " " + c
            }
        },
        _setCaption: function(t, i, s) {
            if (!this.loading) {
                t ? this._initPulldownRefreshState() : this._initPullupRefreshState();
                var e = this.options,
                o = this.pullPocket,
                n = this.pullCaption,
                r = this.pullLoading,
                t = this.pulldown,
                h = this;
                o && (s ? setTimeout(function() {
                    n.innerHTML = h.lastTitle = i,
                    t ? r.className = S: (h._setCaptionClass(!1, n, i), r.className = b),
                    r.style.webkitAnimation = "",
                    r.style.webkitTransition = "",
                    r.style.webkitTransform = ""
                },
                100) : i !== this.lastTitle && (n.innerHTML = i, t ? i === e.down.contentrefresh ? (r.className = b, r.style.webkitAnimation = "spinner-spin 1s step-end infinite") : i === e.down.contentover ? (r.className = w, r.style.webkitTransition = "-webkit-transform 0.3s ease-in", r.style.webkitTransform = "rotate(180deg)") : i === e.down.contentdown ? (r.className = S, r.style.webkitTransition = "-webkit-transform 0.3s ease-in", r.style.webkitTransform = "rotate(0deg)") : i === e.down.contentrefreshsuccess ? (r.className = T, r.style.webkitTransition = "-webkit-transform 0.3s ease-in", r.style.webkitTransform = "scale(1.2,1.2)", r.style.webkitAnimation = "none", n.innerHTML = h.successTips || i) : i === e.down.contentrefresherror && (r.className = x, r.style.webkitTransition = "-webkit-transform 0.3s ease-in", r.style.webkitTransform = "scale(1.2,1.2)", r.style.webkitAnimation = "none") : e.up && (i === e.up.contentrefresh ? r.className = b + " " + y: r.className = b + " " + v, h._setCaptionClass(!1, n, i)), this.lastTitle = i))
            }
        }
    });
    k.init = function(t) {
        return new k(t)
    },
    i.namespace("skin.defaults", k)
} ({},
PullToRefreshTools);