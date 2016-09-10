(function (Timer, document, window) {
    Timer.Component = React.createClass({
        displayName: 'Component',

        getInitialState: function () {
            return {
                minutes: 0,
                seconds: 0,
                running: false
            };
        },

        componentDidMount: function () {
            this.timer = setInterval(this.update, 500);
            this.chime = new Audio('../sounds/chime.mp3');
        },

        start: function (minutes, seconds) {
            this.setState({
                running: true,
                endTime: Date.now() + minutes * 60000 + seconds * 1000 + 1000
            });
        },

        update: function () {
            var remaining, minutes, seconds;
            if (!this.state.running) return;
            remaining = Math.floor((this.state.endTime - Date.now()) / 1000);
            seconds = remaining % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds; // Append '0' if less than 10
            minutes = Math.floor(remaining / 60);
            this.setState({
                minutes: minutes,
                seconds: seconds
            });
            if (remaining === 0) {
                this.finished();
            }
        },

        finished: function () {
            this.setState({
                running: false
            });
            this.chime.play();
        },

        render: function () {
            return React.createElement(
                'div',
                { className: 'counter' },
                React.createElement(
                    'p',
                    null,
                    this.state.minutes,
                    ':',
                    this.state.seconds
                )
            );
        }
    });

    Timer.View = ReactDOM.render(React.createElement(Timer.Component, null), document.getElementById('timer'));
})(Timer, document, window);