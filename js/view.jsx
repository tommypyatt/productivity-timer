(function (Timer, document, window) {
    Timer.Component = React.createClass({
        getInitialState: function () {
            return {
                minutes: 0,
                seconds: 0,
                running: false
            };
        },

        componentDidMount: function () {
            this.timer = setInterval(this.update, 500);
        },

        start: function (minutes, seconds) {
            this.setState({
                running: true,
                endTime: Date.now() + (minutes * 60000) + (seconds * 1000) + 1000
            });
        },

        update: function () {
            var remaining, minutes, seconds;
            if (!this.state.running) return;
            remaining = Math.floor( ( this.state.endTime - Date.now() ) / 1000 );
            seconds = remaining % 60;
            seconds = (seconds < 10) ? '0' + seconds : seconds; // Append '0' if less than 10
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
            alert('Timer end');
        },

        render: function () {
            return <div className='counter'>
                <p>{this.state.minutes}:{this.state.seconds}</p>
            </div>
        }
    });

    Timer.View = ReactDOM.render(
        <Timer.Component/>,
        document.getElementById('timer')
    );
})(Timer, document, window);