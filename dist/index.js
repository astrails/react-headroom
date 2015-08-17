// Generated by CoffeeScript 1.8.0
var PropTypes, PureRenderMixin, React, objectAssign, raf, shouldUpdate;

React = require('react');

objectAssign = require('react/lib/Object.assign');

PureRenderMixin = require('react/addons').addons.PureRenderMixin;

raf = require('raf');

PropTypes = React.PropTypes;

shouldUpdate = require('./shouldUpdate');

module.exports = React.createClass({
  displayName: 'Headroom',
  mixins: [PureRenderMixin],
  currentScrollY: 0,
  lastKnownScrollY: 0,
  ticking: false,
  propTypes: {
    parent: React.PropTypes.node,
    children: PropTypes.any.isRequired,
    disableInlineStyles: PropTypes.bool,
    disable: PropTypes.bool,
    upTolerance: PropTypes.number,
    downTolerance: PropTypes.number,
    onPin: PropTypes.func,
    onUnpin: PropTypes.func,
    onUnfix: PropTypes.func,
    wrapperStyle: PropTypes.object
  },
  getDefaultProps: function() {
    return {
      parent: function() {
        return window;
      },
      disableInlineStyles: false,
      disable: false,
      upTolerance: 5,
      downTolerance: 0,
      onPin: function() {},
      onUnpin: function() {},
      onUnfix: function() {},
      wrapperStyle: {}
    };
  },
  getInitialState: function() {
    return {
      state: 'unfixed',
      translateY: 0,
      className: 'headroom headroom--pinned'
    };
  },
  componentDidMount: function() {
    this.setState({
      height: this.refs.inner.getDOMNode().offsetHeight
    });
    if (!this.props.disable) {
      return this.props.parent().addEventListener('scroll', this.handleScroll);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.disable && !this.props.disable) {
      this.unfix();
      return this.props.parent().removeEventListener('scroll', this.handleScroll);
    } else if (!nextProps.disable && this.props.disable) {
      return this.props.parent().addEventListener('scroll', this.handleScroll);
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.children !== this.props.children) {
      return this.setState({
        height: this.refs.inner.getDOMNode().offsetHeight
      });
    }
  },
  componentWillUnmount: function() {
    return this.props.parent().removeEventListener('scroll', this.handleScroll);
  },
  handleScroll: function() {
    if (!this.ticking) {
      this.ticking = true;
      return raf(this.update);
    }
  },
  unpin: function() {
    this.props.onUnpin();
    return this.setState({
      translateY: "-100%",
      className: "headroom headroom--unpinned"
    }, (function(_this) {
      return function() {
        return setTimeout((function() {
          return _this.setState({
            state: "unpinned"
          });
        }), 0);
      };
    })(this));
  },
  pin: function() {
    this.props.onPin();
    return this.setState({
      translateY: 0,
      className: "headroom headroom--pinned",
      state: "pinned"
    });
  },
  unfix: function() {
    this.props.onUnfix();
    return this.setState({
      translateY: 0,
      className: "headroom headroom--unfixed",
      state: "unfixed"
    });
  },
  update: function() {
    var action, distanceScrolled, scrollDirection, _ref;
    this.currentScrollY = this.getScrollY();
    _ref = shouldUpdate(this.lastKnownScrollY, this.currentScrollY, this.props, this.state), action = _ref.action, scrollDirection = _ref.scrollDirection, distanceScrolled = _ref.distanceScrolled;
    if (action === "pin") {
      this.pin();
    } else if (action === "unpin") {
      this.unpin();
    } else if (action === "unfix") {
      this.unfix();
    }
    this.lastKnownScrollY = this.currentScrollY;
    return this.ticking = false;
  },
  getScrollY: function() {
    if (this.props.parent().pageYOffset !== void 0) {
      return this.props.parent().pageYOffset;
    } else if (this.props.parent().scrollTop !== void 0) {
      return this.props.parent().scrollTop;
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }
  },
  render: function() {
    var style, wrapperStyles;
    style = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      WebkitTransform: "translateY(" + this.state.translateY + ")",
      MsTransform: "translateY(" + this.state.translateY + ")",
      transform: "translateY(" + this.state.translateY + ")"
    };
    if (this.state.state !== "unfixed") {
      style = objectAssign(style, {
        WebkitTransition: "all .2s ease-in-out",
        MozTransition: "all .2s ease-in-out",
        OTransition: "all .2s ease-in-out",
        transition: "all .2s ease-in-out"
      });
    }
    if (!this.props.disableInlineStyles) {
      style = objectAssign(style, this.props.style);
    } else {
      style = this.props.style;
    }
    wrapperStyles = objectAssign(this.props.wrapperStyle, {
      height: this.state.height ? this.state.height : void 0
    });
    return React.createElement("div", {
      "style": wrapperStyles,
      "className": "headroom-wrapper"
    }, React.createElement("div", React.__spread({
      "ref": "inner"
    }, this.props, {
      "style": style,
      "className": this.state.className
    }), this.props.children));
  }
});
