(function (Timer, document, window) {
    Timer.Component = React.createClass({
        getInitialState: function () {
            return {
                minutes: 0,
                seconds: 0,
                running: false,
                customTimer: 5
            };
        },

        componentDidMount: function () {
            this.timer = setInterval(this.update, 500);
            this.chime = new Audio('https://raw.githubusercontent.com/tommypyatt/productivity-timer/gh-pages/sounds/chime.mp3');
            this.favicon = document.getElementById('favicon');
            document.body.addEventListener('keyup', this.onKeyUp);
        },

        onKeyUp: function (event) {
            if (event.code === 'Space') {
                if (this.state.running) {
                    this.pause();
                } else if (!this.state.running && this.state.remaining > 0) {
                    this.continue();
                } else {
                    this.start(25, 0);
                }
            }
        },

        start: function (minutes, seconds) {
            this.setState({
                running: true,
                endTime: Date.now() + (minutes * 60000) + (seconds * 1000) + 1000
            });
            this.favicon.href = 'favicon-normal.ico';
        },

        update: function () {
            var minutes, seconds;
            if (!this.state.running) return;
            this.setState({
                remaining: Math.floor( ( this.state.endTime - Date.now() ) / 1000 )
            });
            seconds = this.state.remaining % 60;
            seconds = (seconds < 10) ? '0' + seconds : seconds; // Append '0' if less than 10
            minutes = Math.floor(this.state.remaining / 60);
            this.setState({
                minutes: minutes,
                seconds: seconds
            });
            if (this.state.remaining === 0) {
                this.finished();
            }
        },

        pause: function () {
            this.setState({
                running: false,
                pausedAt: Date.now()
            });
        },

        stop: function () {
            this.setState({
                running: false,
                remaining: 0,
                minutes: 0,
                seconds: 0
            });
        },

        continue: function () {
            var now = Date.now();
            var pausedFor = Date.now() - this.state.pausedAt;

            this.setState({
                running: true,
                endTime: this.state.endTime + pausedFor
            });
        },

        finished: function () {
            this.setState({
                running: false
            });
            this.chime.play();
            this.favicon.href = 'favicon-alert.ico';
        },

        changeCustom: function (event) {
            this.setState({
                customTimer: event.target.value
            });
        },

        incrementCustomTimer: function () {
            this.setState({
                customTimer: this.state.customTimer + 1
            });
        },

        decrementCustomTimer: function () {
            decrement = this.state.customTimer - 1;
            if (decrement < 0) decrement = 0;

            this.setState({
                customTimer: decrement
            });
        },

        render: function () {
            return <div>
                <div className='counter'>
                    <p>{this.state.minutes}:{this.state.seconds}</p>
                </div>
                <div className="operation">
                    <div className="timers" style={{display: (!this.state.running && !this.state.remaining) ? 'block' : 'none'}}>
                        <p>
                            <a href="#" onClick={() => {this.start(25, 0)}}>Start pomodoro (25 min, default)</a>
                        </p>
                        <p>
                            <a href="#" onClick={() => {this.start(15, 0)}}>Start 15 min</a>
                        </p>
                        <p>
                            <a href="#" onClick={() => {this.start(this.state.customTimer, 0)}}>Start custom ({this.state.customTimer} minute{(this.state.customTimer == 1) ? '' : 's'})</a>
                        </p>
                        <button className="dec" type="button" onClick={this.decrementCustomTimer}>-</button>
                        <input hidden type="number" defaultValue={this.state.customTimer} onChange={this.changeCustom} />
                        <button className="inc" type="button" onClick={this.incrementCustomTimer}>+</button>
                    </div>
                    <p style={{display: (this.state.running) ? 'block' : 'none'}}>
                        <a href="#" onClick={this.pause}>Pause</a>
                    </p>
                    <p style={{display: (this.state.running) ? 'block' : 'none'}}>
                        <a href="#" onClick={this.stop}>Stop</a>
                    </p>
                    <p style={{display: (!this.state.running && this.state.remaining > 0) ? 'block' : 'none'}}>
                        <a href="#" onClick={this.continue}>Continue</a>
                    </p>
                </div>
            </div>
        }
    });

    Timer.View = ReactDOM.render(
        <Timer.Component/>,
        document.getElementById('timer')
    );
})(Timer, document, window);
