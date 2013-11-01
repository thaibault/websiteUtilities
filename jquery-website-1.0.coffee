#!/usr/bin/env require

# region vim modline

# vim: set tabstop=4 shiftwidth=4 expandtab:
# vim: foldmethod=marker foldmarker=region,endregion:

# endregion

# region header

###!
    Copyright see require on https://github.com/thaibault/require

    Conventions see require on https://github.com/thaibault/require

    @author t.sickert@gmail.com (Torben Sickert)
    @version 1.0 stable
    @fileOverview
    This module provides common logic for the whole web page.
###

## standalone
## do ($=this.jQuery) ->
this.require([
    ['less.Parser', 'less-1.5.0']

    ['jQuery', 'jquery-2.0.3']
    ['jQuery.scrollTo', 'jquery-scrollTo-1.4.3.1']
    ['jQuery.fn.spin', 'jquery-spin-1.2.8']
    ['jQuery.fn.hashchange', 'jquery-observeHashChange-1.0']

    ['jQuery.Tools', 'jquery-tools-1.0.coffee']
    ['jQuery.Lang', 'jquery-lang-1.0.coffee']],
(less, lessParser, $) ->
##

# endregion

# region plugins/classes

    ###*
        @memberOf $
        @class
    ###
    class Website extends $.Tools.class

    # region properties

        ###*
            Saves default options for manipulating the default behaviour.

            @property {Object}
        ###
        _options: {}
        ###*
            Saves default options for manipulating the default behaviour.

            @property {Object}
        ###
        _parentOptions:
            logging: false
            domNodeSelectorPrefix: 'body.{1}'
            onViewportMovesToTop: $.noop()
            onViewportMovesAwayFromTop: $.noop()
            onChangeToDesktopMode: $.noop()
            onChangeToTabletMode: $.noop()
            onChangeToSmartphoneMode: $.noop()
            onChangeMediaQueryMode: $.noop()
            onSwitchSection: $.noop()
            onStartUpAnimationComplete: $.noop()
            additionalPageLoadingTimeInMilliseconds: 0
            mediaQueryCssIndicatorStyleType: 'border-left-style'
            googleTrackingCode: 'UA-0-0'
            scrollInLinearTime: false
            mediaQueryCssIndicator:
                desktop: 'dashed'
                tablet: 'solid'
                smartphone: 'dotted'
            domNode:
                top: 'div.navigation-bar'
                scrollToTopButtons: 'a[href="#top"]'
                startUpAnimationClassPrefix: '.start-up-animation-number-'
                windowLoadingCover: 'div.window-loading-cover'
                windowLoadingSpinner: 'div.window-loading-cover div'
            startUpFadeInOptions:
                easing: 'swing'
                duration: 'slow'
            windowLoadingCoverFadeOutOptions:
                easing: 'swing'
                duration: 'slow'
            startUpAnimationElementDelayInMiliseconds: 100
            windowLoadingSpinnerOptions:
                lines: 9 # The number of lines to draw
                length: 23 # The length of each line
                width: 11 # The line thickness
                radius: 40 # The radius of the inner circle
                corners: 1 # Corner roundness (0..1)
                rotate: 75 # The rotation offset
                color: '#000' # #rgb or #rrggbb
                speed: 1.1 # Rounds per second
                trail: 58 # Afterglow percentage
                shadow: false # Whether to render a shadow
                hwaccel: false # Whether to use hardware acceleration
                className: 'spinner' # CSS class to assign to the spinner
                zIndex: 2e9 # The z-index (defaults to 2000000000)
                top: 'auto' # Top position relative to parent in px
                left: 'auto' # Left position relative to parent in px
            language: {}
        ###*
            Determines weather the view port is on top of the page.

            @property {Boolean}
        ###
        _viewportIsOnTop: true
        ###*
            Describes the current mode defined by the css media queries.

            @property {String}
        ###
        _currentMediaQueryMode: ''
        ###*
            Saves the language handler instance.

            @property {$.Lang}
        ###
        _languageHandler: null
        ###*
            Saves the class name for introspection.

            @property {String}
        ###
        __name__: 'Website'
        ###*
            Saves the generic javaScript code snippet to use google analytics
            statistics.

            @property {String}
        ###
        __googleAnalyticsCode: "
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '{1}', 'github.io');ga('send', 'pageview');"

    # endregion

    # region public methods

        # region special

        ###*
            @description Initializes the interactive web app.

            @param {Object} options An options object.

            @returns {$.Website} Returns the current instance.
        ###
        initialize: (options) ->
            # Wrap event methods with debouncing handler.
            this._onViewportMovesToTop = this.debounce(
                this.getMethod(this._onViewportMovesToTop))
            this._onViewportMovesAwayFromTop = this.debounce(
                this.getMethod(this._onViewportMovesAwayFromTop))
            this._options = $.extend(
                true, this._parentOptions, this._options)
            super options
            this.$domNode = this.grabDomNode this._options.domNode
            this._options.windowLoadingCoverFadeOutOptions.always =
                this.getMethod this._handleStartUpEffects
            this.$domNode.windowLoadingSpinner.spin(
                this._options.windowLoadingSpinnerOptions)
            this._bindScrollEvents().$domNode.parent.show()
            this.$domNode.window.ready this.getMethod(
                this._removeLoadingCover)
            this._addNavigationEvents()._addMediaQueryChangeEvents(
            )._triggerWindowResizeEvents()._handleGoogleAnalytics(
                this._options.trackingCode)
            if not this._options.language.logging?
                this._options.language.logging = this._options.logging
            this._languageHandler = $.Lang this._options.language

        # endregion

    # endregion

    # region protected methods

        # region event

        ###*
            @description This method triggers if the viewport moves to top.

            @returns {$.Website} Returns the current instance.
        ###
        _onViewportMovesToTop: ->
            if this.$domNode.scrollToTopButtons.css(
                'visibility'
            ) isnt 'hidden'
                this.$domNode.scrollToTopButtons.animate(
                    {bottom: '+=30', opacity: 0},
                    {duration: 'normal', always: =>
                        this.$domNode.scrollToTopButtons.css(
                            'bottom', '-=30')})
            this
        ###*
            @description This method triggers if the viewport moves away from
                         top.

            @returns {$.Website} Returns the current instance.
        ###
        _onViewportMovesAwayFromTop: ->
            if this.$domNode.scrollToTopButtons.css(
                'visibility'
            ) isnt 'hidden'
                this.$domNode.scrollToTopButtons.css(
                    bottom: '+=30', display: 'block', opacity: 0
                ).animate(
                    {bottom: '-=30', queue: false, opacity: 1},
                    {duration: 'normal'})
            this
        ###*
            @description This method triggers if the responsive design
                         switches to another mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeMediaQueryMode: (oldMode, newMode) ->
            this
        ###*
            @description This method triggers if the responsive design
                         switches to desktop mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToDesktopMode: (oldMode, newMode) ->
            this
        ###*
            @description This method triggers if the responsive design
                         switches to tablet mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToTabletMode: (oldMode, newMode) ->
            this
        ###*
            @description This method triggers if the responsive design
                         switches to smartphone mode.

            @param {String} oldMode Saves the previous mode.
            @param {String} newMode Saves the new mode.

            @returns {$.Website} Returns the current instance.
        ###
        _onChangeToSmartphoneMode: (oldMode, newMode) ->
            this
        ###*
            @description This method triggers if we change the current section.

            @param {String} sectionName Contains the new section name.

            @returns {$.Website} Returns the current instance.
        ###
        _onSwitchSection: (sectionName) ->
            this
        ###*
            @description This method is complete if last startup animation
                         was initialized.

            @returns {$.Website} Returns the current instance.
        ###
        _onStartUpAnimationComplete: ->
            this

        # endregion

        # region helper

        ###*
            @description This method adds triggers for responsive design
                         switches.

            @returns {$.Website} Returns the current instance.
        ###
        _addMediaQueryChangeEvents: ->
            this.on this.$domNode.window, 'resize', this.getMethod(
                this._triggerWindowResizeEvents)
            this
        ###*
            @description This method triggers if the responsive design
                         switches its mode.

            @returns {$.Website} Returns the current instance.
        ###
        _triggerWindowResizeEvents: ->
            $.each(
                this._options.mediaQueryCssIndicator,
                (mode, cssValue) =>
                    if (this.$domNode.parent.css(
                        this._options.mediaQueryCssIndicatorStyleType
                    ) is cssValue and mode isnt this._currentMediaQueryMode)
                        this.fireEvent.apply(
                            this, [
                                this.stringFormat('changeMediaQueryMode',
                                mode.substr(0, 1).toUpperCase() +
                                    mode.substr 1),
                                false, this, this._currentMediaQueryMode, mode
                            ].concat this.argumentsObjectToArray arguments
                        )
                        this.fireEvent.apply(
                            this, [
                                this.stringFormat('changeTo{1}Mode',
                                mode.substr(0, 1).toUpperCase() +
                                    mode.substr 1),
                                false, this, this._currentMediaQueryMode, mode
                            ].concat this.argumentsObjectToArray arguments
                        )
                        this._currentMediaQueryMode = mode
            )
            this
        ###*
            @description This method triggers if view port arrives at special
                         areas.

            @returns {$.Website} Returns the current instance.
        ###
        _bindScrollEvents: ->
            this.on window, 'scroll', =>
                if this.$domNode.window.scrollTop()
                    if this._viewportIsOnTop
                        this._viewportIsOnTop = false
                        this.fireEvent.apply this, [
                            'viewportMovesAwayFromTop', false, this
                        ].concat this.argumentsObjectToArray arguments
                else if not this._viewportIsOnTop
                    this._viewportIsOnTop = true
                    this.fireEvent.apply this, [
                        'viewportMovesToTop', false, this
                    ].concat this.argumentsObjectToArray arguments
            this
        ###*
            @description This method triggers after window is loaded.

            @returns {$.Website} Returns the current instance.
        ###
        _removeLoadingCover: ->
            window.setTimeout(
                =>
                    ###
                        Hide startup animation dom nodes to show them step
                        by step.
                    ###
                    $(
                        '[class^="' +
                        this.sliceDomNodeSelectorPrefix(
                            this._options.domNode
                                .startUpAnimationClassPrefix
                        ).substr(1) + '"]'
                    ).hide()
                    this.$domNode.windowLoadingCover.fadeOut(
                        this._options.windowLoadingCoverFadeOutOptions)
                , this._options.additionalPageLoadingTimeInMilliseconds)
            this
        ###*
            @description This method handles the given start up effect step.

            @param {Number} elementNumber The current start up step.

            @returns {$.Website} Returns the current instance.
        ###
        _handleStartUpEffects: (elementNumber) ->
            # Stop and delete spinner instance.
            this.$domNode.windowLoadingSpinner.spin false
            if not $.isNumeric elementNumber
                elementNumber = 1
            window.setTimeout((=>
                $(
                    this._options.domNode.startUpAnimationClassPrefix +
                    elementNumber
                ).fadeIn this._options.startUpFadeInOptions
                if ($(
                    this._options.domNode.startUpAnimationClassPrefix +
                    (elementNumber + 1)
                ).length)
                    this._handleStartUpEffects elementNumber + 1
                else
                    this.fireEvent 'startUpAnimationComplete'
            ), this._options.startUpAnimationElementDelayInMiliseconds)
            this
        ###*
            @description This method adds triggers to switch section.

            @returns {$.Website} Returns the current instance.
        ###
        _addNavigationEvents: ->
            this.$domNode.window.hashchange(=>
                this.fireEvent 'switchSection', false,
                this, window.location.hash)
            this._handleScrollToTopButton()
        ###*
            @description Adds trigger to scroll top buttons.

            @returns {$.Website} Returns the current instance.
        ###
        _handleScrollToTopButton: ->
            this.on(
                this.$domNode.scrollToTopButtons, 'click', (event) =>
                    event.preventDefault()
                    this._scrollToTop()
            )
            this.$domNode.scrollToTopButtons.hide()
            this
        ###*
            @description Scrolls to top of page. Runs the given function
                         after viewport arrives.

            @param {Function} onAfter Callback to call after effect has
                                      finished.

            @returns {$.Website} Returns the current instance.
        ###
        _scrollToTop: (onAfter=$.noop()) ->
            if this._options.scrollInLinearTime
                distanceToTop = this.$domNode.window.scrollTop()
                menuHeight = this.$domNode.top.find('div.navbar').outerHeight()
                distanceToScroll = distanceToTop + menuHeight
                if distanceToTop < menuHeight
                    distanceToScroll = distanceToScroll + menuHeight -
                        distanceToTop
                $.scrollTo(
                    {top: "-=#{distanceToScroll}px", left: '+=0'},
                    # Scroll as fast as we have distance to top.
                    {duration: distanceToScroll, onAfter: onAfter})
            else
                $.scrollTo(
                    {top: 0, left: 0},
                    {duration: 'slow', onAfter: onAfter})
            this
        ###*
            @description Scrolls to top of page. Runs the given function
                         after viewport arrives.

            @param {String} trackingCode Google's javaScript embedding code
                                         snippet.

            @returns {$.Website} Returns the current instance.
        ###
        _handleGoogleAnalytics: (trackingCode) ->
            try
                (new Function(this.stringFormat(
                    this.__googleAnalyticsCode, trackingCode
                )))()
            catch exception
                this.warn(
                    'Problem in google analytics code snippet: {1}',
                    exception)
            this

        # endregion

    # endregion

    # region handle $ extending

    ###* @ignore ###
    $.Website = -> $.Tools().controller Website, arguments
    ###* @ignore ###
    $.Website.class = Website

    # endregion

# endregion

## standalone
)