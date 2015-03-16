// Generated by CoffeeScript 1.9.0

/*
[Project page](https://thaibault.github.com/jQuery-website)

This module provides common logic for the whole web page.

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

Extending this module
---------------------

For conventions see require on https://github.com/thaibault/require

Author
------

t.sickert["~at~"]gmail.com (Torben Sickert)

Version
-------

1.0 stable
 */

(function() {
  var main,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  main = function(less, lessParser, $) {
    var Website;
    Website = (function(_super) {
      __extends(Website, _super);

      function Website() {
        return Website.__super__.constructor.apply(this, arguments);
      }


      /*This plugin holds all needed methods to extend a whole website. */


      /*
          **__name__ {String}**
          Holds the class name to provide inspection features.
       */

      Website.prototype.__name__ = 'Website';

      Website.prototype.initialize = function(options, _at__parentOptions, _at_startUpAnimationIsComplete, _at__viewportIsOnTop, _at__currentMediaQueryMode, _at_languageHandler, _at___analyticsCode) {
        var onLoaded;
        if (options == null) {
          options = {};
        }
        this._parentOptions = _at__parentOptions != null ? _at__parentOptions : {
          logging: false,
          domNodeSelectorPrefix: 'body.{1}',
          onViewportMovesToTop: $.noop(),
          onViewportMovesAwayFromTop: $.noop(),
          onChangeToLargeMode: $.noop(),
          onChangeToMediumMode: $.noop(),
          onChangeToSmallMode: $.noop(),
          onChangeToExtraSmallMode: $.noop(),
          onChangeMediaQueryMode: $.noop(),
          onSwitchSection: $.noop(),
          onStartUpAnimationComplete: $.noop(),
          additionalPageLoadingTimeInMilliseconds: 0,
          trackingCode: null,
          mediaQueryCssIndicator: [['extraSmall', 'xs'], ['small', 'sm'], ['medium', 'md'], ['large', 'lg']],
          domNode: {
            mediaQueryIndicator: '<div class="media-query-indicator">',
            top: '> div.navbar-wrapper',
            scrollToTopButton: 'a[href="#top"]',
            startUpAnimationClassPrefix: '.website-start-up-animation-number-',
            windowLoadingCover: 'div.website-window-loading-cover',
            windowLoadingSpinner: 'div.website-window-loading-cover > div'
          },
          startUpFadeIn: {
            easing: 'swing',
            duration: 'slow'
          },
          windowLoadingCoverFadeOut: {
            easing: 'swing',
            duration: 'slow'
          },
          startUpAnimationElementDelayInMiliseconds: 100,
          windowLoadingSpinner: {
            lines: 9,
            length: 23,
            width: 11,
            radius: 40,
            corners: 1,
            rotate: 75,
            color: '#000',
            speed: 1.1,
            trail: 58,
            shadow: false,
            hwaccel: false,
            className: 'spinner',
            zIndex: 2e9,
            top: 'auto',
            left: 'auto'
          },
          activateLanguageSupport: true,
          language: {},
          scrollToTop: {
            inLinearTime: true,
            options: {
              duration: 'normal'
            },
            button: {
              slideDistanceInPixel: 30,
              showAnimation: {
                duration: 'normal'
              },
              hideAnimation: {
                duration: 'normal'
              }
            }
          },
          domain: 'auto'
        };
        this.startUpAnimationIsComplete = _at_startUpAnimationIsComplete != null ? _at_startUpAnimationIsComplete : false;
        this._viewportIsOnTop = _at__viewportIsOnTop != null ? _at__viewportIsOnTop : false;
        this._currentMediaQueryMode = _at__currentMediaQueryMode != null ? _at__currentMediaQueryMode : '';
        this.languageHandler = _at_languageHandler != null ? _at_languageHandler : null;
        this.__analyticsCode = _at___analyticsCode != null ? _at___analyticsCode : '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new window.Date();\na=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;\nm.parentNode.insertBefore(a,m)})(\nwindow,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');\nga(\'create\', \'{1}\', \'{2}\');ga(\'set\',\'anonymizeIp\',true);\nga(\'send\', \'pageview\');';

        /*
            Initializes the interactive web application.
        
            **options {Object}**    - An options object.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this._onViewportMovesToTop = this.debounce(this.getMethod(this._onViewportMovesToTop));
        this._onViewportMovesAwayFromTop = this.debounce(this.getMethod(this._onViewportMovesAwayFromTop));
        this._options = $.extend(true, {}, this._parentOptions, this._options);
        Website.__super__.initialize.call(this, options);
        this.$domNodes = this.grabDomNode(this._options.domNode);
        this.disableScrolling()._options.windowLoadingCoverFadeOut.always = this.getMethod(this._handleStartUpEffects);
        this.$domNodes.windowLoadingSpinner.spin(this._options.windowLoadingSpinner);
        this._bindScrollEvents().$domNodes.parent.show();
        onLoaded = (function(_this) {
          return function() {
            _this.windowLoaded = true;
            return _this._removeLoadingCover();
          };
        })(this);
        if (window.less != null) {
          window.less.pageLoadFinished.then(onLoaded);
        } else {
          this.on(this.$domNodes.window, 'load', onLoaded);
        }
        this._addNavigationEvents()._addMediaQueryChangeEvents()._triggerWindowResizeEvents()._handleAnalytics();
        if (this._options.language.logging == null) {
          this._options.language.logging = this._options.logging;
        }
        if (this._options.activateLanguageSupport) {
          this.languageHandler = $.Lang(this._options.language);
        }
        return this;
      };

      Website.prototype.disableScrolling = function() {

        /*
            This method disables scrolling on the given web view.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.$domNodes.parent.addClass('disable-scrolling').on('touchmove', function(event) {
          return event.preventDefault();
        });
        return this;
      };

      Website.prototype.enableScrolling = function() {

        /*
            This method disables scrolling on the given web view.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.off(this.$domNodes.parent.removeClass('disable-scrolling'), 'touchmove');
        return this;
      };

      Website.prototype._onViewportMovesToTop = function() {

        /*
            This method triggers if the viewport moves to top.
        
            **returns {$.Website}** - Returns the current instance.
         */
        if (this.$domNodes.scrollToTopButton.css('visibility') === 'hidden') {
          this.$domNodes.scrollToTopButton.css('opacity', 0);
        } else {
          this._options.scrollToTop.button.hideAnimation.always = (function(_this) {
            return function() {
              return _this.$domNodes.scrollToTopButton.css({
                bottom: '-=' + _this._options.scrollToTop.button.slideDistanceInPixel
              });
            };
          })(this);
          this.$domNodes.scrollToTopButton.finish().animate({
            bottom: '+=' + this._options.scrollToTop.button.slideDistanceInPixel,
            opacity: 0
          }, this._options.scrollToTop.button.hideAnimation);
        }
        return this;
      };

      Website.prototype._onViewportMovesAwayFromTop = function() {

        /*
            This method triggers if the viewport moves away from top.
        
            **returns {$.Website}** - Returns the current instance.
         */
        if (this.$domNodes.scrollToTopButton.css('visibility') === 'hidden') {
          this.$domNodes.scrollToTopButton.css('opacity', 1);
        } else {
          this.$domNodes.scrollToTopButton.finish().css({
            bottom: '+=' + this._options.scrollToTop.button.slideDistanceInPixel,
            display: 'block',
            opacity: 0
          }).animate({
            bottom: '-=' + this._options.scrollToTop.button.slideDistanceInPixel,
            queue: false,
            opacity: 1
          }, this._options.scrollToTop.button.showAnimation);
        }
        return this;
      };

      Website.prototype._onChangeMediaQueryMode = function(oldMode, newMode) {

        /*
            This method triggers if the responsive design switches to
            another mode.
        
            **oldMode {String}**    - Saves the previous mode.
        
            **newMode {String}**    - Saves the new mode.
        
            **returns {$.Website}** - Returns the current instance.
         */
        return this;
      };

      Website.prototype._onChangeToLargeMode = function(oldMode, newMode) {

        /*
            This method triggers if the responsive design switches to large
            mode.
        
            **oldMode {String}**    - Saves the previous mode.
        
            **newMode {String}**    - Saves the new mode.
        
            **returns {$.Website}** - Returns the current instance.
         */
        return this;
      };

      Website.prototype._onChangeToMediumMode = function(oldMode, newMode) {

        /*
            This method triggers if the responsive design switches to
            medium mode.
        
            **oldMode {String}**    - Saves the previous mode.
        
            **newMode {String}**    - Saves the new mode.
        
            **returns {$.Website}** - Returns the current instance.
         */
        return this;
      };

      Website.prototype._onChangeToSmallMode = function(oldMode, newMode) {

        /*
            This method triggers if the responsive design switches to small
            mode.
        
            **oldMode {String}**    - Saves the previous mode.
        
            **newMode {String}**    - Saves the new mode.
        
            **returns {$.Website}** - Returns the current instance.
         */
        return this;
      };

      Website.prototype._onChangeToExtraSmallMode = function(oldMode, newMode) {

        /*
            This method triggers if the responsive design switches to extra
            small mode.
        
            **oldMode {String}**    - Saves the previous mode.
        
            **newMode {String}**    - Saves the new mode.
        
            **returns {$.Website}** - Returns the current instance.
         */
        return this;
      };

      Website.prototype._onSwitchSection = function(sectionName) {

        /*
            This method triggers if we change the current section.
        
            **sectionName {String}** - Contains the new section name.
        
            **returns {$.Website}**  - Returns the current instance.
         */
        return this;
      };

      Website.prototype._onStartUpAnimationComplete = function() {

        /*
            This method is complete if last startup animation was
            initialized.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.startUpAnimationIsComplete = true;
        return this;
      };

      Website.prototype._addMediaQueryChangeEvents = function() {

        /*
            This method adds triggers for responsive design switches.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.on(this.$domNodes.window, 'resize', this.getMethod(this._triggerWindowResizeEvents));
        return this;
      };

      Website.prototype._triggerWindowResizeEvents = function() {

        /*
            This method triggers if the responsive design switches its
            mode.
        
            **returns {$.Website}** - Returns the current instance.
         */
        $.each(this._options.mediaQueryCssIndicator, (function(_this) {
          return function(key, value) {
            _this.$domNodes.mediaQueryIndicator.prependTo(_this.$domNodes.parent).addClass("hidden-" + value[1]);
            if (_this.$domNodes.mediaQueryIndicator.is(':hidden') && value[0] !== _this._currentMediaQueryMode) {
              _this.fireEvent.apply(_this, ['changeMediaQueryMode', false, _this, _this._currentMediaQueryMode, value[0]].concat(_this.argumentsObjectToArray(arguments)));
              _this.fireEvent.apply(_this, [_this.stringFormat('changeTo{1}Mode', _this.stringCapitalize(value[0])), false, _this, _this._currentMediaQueryMode, value[0]].concat(_this.argumentsObjectToArray(arguments)));
              _this._currentMediaQueryMode = value[0];
            }
            return _this.$domNodes.mediaQueryIndicator.removeClass("hidden-" + value[1]);
          };
        })(this));
        return this;
      };

      Website.prototype._bindScrollEvents = function() {

        /*
            This method triggers if view port arrives at special areas.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.on(this.$domNodes.window, 'scroll', (function(_this) {
          return function() {
            if (_this.$domNodes.window.scrollTop()) {
              if (_this._viewportIsOnTop) {
                _this._viewportIsOnTop = false;
                return _this.fireEvent.apply(_this, ['viewportMovesAwayFromTop', false, _this].concat(_this.argumentsObjectToArray(arguments)));
              }
            } else if (!_this._viewportIsOnTop) {
              _this._viewportIsOnTop = true;
              return _this.fireEvent.apply(_this, ['viewportMovesToTop', false, _this].concat(_this.argumentsObjectToArray(arguments)));
            }
          };
        })(this));
        if (this.$domNodes.window.scrollTop()) {
          this._viewportIsOnTop = false;
          this.fireEvent.apply(this, ['viewportMovesAwayFromTop', false, this].concat(this.argumentsObjectToArray(arguments)));
        } else {
          this._viewportIsOnTop = true;
          this.fireEvent.apply(this, ['viewportMovesToTop', false, this].concat(this.argumentsObjectToArray(arguments)));
        }
        return this;
      };

      Website.prototype._removeLoadingCover = function() {

        /*
            This method triggers after window is loaded.
        
            **returns {$.Website}** - Returns the current instance.
         */
        window.setTimeout((function(_this) {
          return function() {
            $(_this.stringFormat('[class^="{1}"], [class*=" {1}"]', _this.sliceDomNodeSelectorPrefix(_this._options.domNode.startUpAnimationClassPrefix).substr(1))).hide();
            if (_this.$domNodes.windowLoadingCover.length) {
              return _this.enableScrolling().$domNodes.windowLoadingCover.fadeOut(_this._options.windowLoadingCoverFadeOut);
            } else {
              return _this._options.windowLoadingCoverFadeOut.always();
            }
          };
        })(this), this._options.additionalPageLoadingTimeInMilliseconds);
        return this;
      };

      Website.prototype._handleStartUpEffects = function(elementNumber) {

        /*
            This method handles the given start up effect step.
        
            **elementNumber {Number}** - The current start up step.
        
            **returns {$.Website}**    - Returns the current instance.
         */
        this.$domNodes.windowLoadingSpinner.spin(false);
        if (!$.isNumeric(elementNumber)) {
          elementNumber = 1;
        }
        if ($(this.stringFormat('[class^="{1}"], [class*=" {1}"]', this.sliceDomNodeSelectorPrefix(this._options.domNode.startUpAnimationClassPrefix).substr(1))).length) {
          window.setTimeout(((function(_this) {
            return function() {
              var lastElementTriggered;
              lastElementTriggered = false;
              _this._options.startUpFadeIn.always = function() {
                if (lastElementTriggered) {
                  return _this.fireEvent('startUpAnimationComplete');
                }
              };
              $(_this._options.domNode.startUpAnimationClassPrefix + elementNumber).fadeIn(_this._options.startUpFadeIn);
              if ($(_this._options.domNode.startUpAnimationClassPrefix + (elementNumber + 1)).length) {
                return _this._handleStartUpEffects(elementNumber + 1);
              } else {
                return lastElementTriggered = true;
              }
            };
          })(this)), this._options.startUpAnimationElementDelayInMiliseconds);
        } else {
          this.fireEvent('startUpAnimationComplete');
        }
        return this;
      };

      Website.prototype._addNavigationEvents = function() {

        /*
            This method adds triggers to switch section.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.$domNodes.window.hashchange((function(_this) {
          return function() {
            if (_this.startUpAnimationIsComplete) {
              return _this.fireEvent('switchSection', false, _this, window.location.hash);
            }
          };
        })(this));
        return this._handleScrollToTopButton();
      };

      Website.prototype._handleScrollToTopButton = function() {

        /*
            Adds trigger to scroll top buttons.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this.on(this.$domNodes.scrollToTopButton, 'click', (function(_this) {
          return function(event) {
            event.preventDefault();
            return _this._scrollToTop();
          };
        })(this));
        return this;
      };

      Website.prototype._scrollToTop = function(onAfter) {
        var distanceToTopInPixel;
        if (onAfter == null) {
          onAfter = $.noop();
        }

        /*
            Scrolls to top of page. Runs the given function after viewport
            arrives.
        
            **onAfter {Function}**  - Callback to call after effect has
                                      finished.
        
            **returns {$.Website}** - Returns the current instance.
         */
        this._options.scrollToTop.options.onAfter = onAfter;
        if (this._options.scrollToTop.inLinearTime) {
          distanceToTopInPixel = this.$domNodes.window.scrollTop();
          this._options.scrollToTop.options.duration = distanceToTopInPixel / 4;
          $.scrollTo({
            top: "-=" + distanceToTopInPixel,
            left: '+=0'
          }, this._options.scrollToTop.options);
        } else {
          $.scrollTo({
            top: 0,
            left: 0
          }, this._options.scrollToTop.options);
        }
        return this;
      };

      Website.prototype._handleAnalytics = function() {

        /*
            Executes the page tracking code.
        
            **returns {$.Website}**   - Returns the current instance.
         */
        var exception;
        if (this._options.trackingCode != null) {
          this.debug("Run analytics code: \"" + this.__analyticsCode + "\"", this._options.trackingCode, this._options.domain);
          try {
            (new Function(this.stringFormat(this.__analyticsCode, this._options.trackingCode, this._options.domain)))();
          } catch (_error) {
            exception = _error;
            this.warn('Problem in google analytics code snippet: {1}', exception);
          }
        }
        return this;
      };

      return Website;

    })($.Tools["class"]);
    $.Website = function() {
      return $.Tools().controller(Website, arguments);
    };
    return $.Website["class"] = Website;
  };

  if (this.require != null) {
    this.require.scopeIndicator = 'jQuery.Website';
    this.require([['less.Parser', 'less-2.4.0'], ['jQuery.Tools', 'jquery-tools-1.0.coffee'], ['jQuery.scrollTo', 'jquery-scrollTo-1.4.3.1'], ['jQuery.fn.spin', 'jquery-spin-2.0.1'], ['jQuery.fn.hashchange', 'jquery-observeHashChange-1.0'], ['jQuery.Lang', 'jquery-lang-1.0.coffee']], main);
  } else {
    main(null, null, this.jQuery);
  }

}).call(this);
