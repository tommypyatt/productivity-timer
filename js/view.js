(function (Timer, document, window) {
    Timer.Component = React.createClass({
        displayName: 'Component',

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
            this.activateWorker();
            this.activateNotifications();
            document.body.addEventListener('keyup', this.onKeyUp);
        },

        activateWorker: function () {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').then(function (reg) {
                    // registration worked
                    console.log('Registration succeeded. Scope is ' + reg.scope);
                }).catch(function (error) {
                    // registration failed
                    console.log('Registration failed with ' + error);
                });
            }
        },

        activateNotifications: function () {
            if (!('Notification' in window)) {
                return;
            }

            Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status);
            });
        },

        pushNotice: function () {
            if (Notification.permission == 'granted') {
                navigator.serviceWorker.getRegistration().then(function (reg) {
                    var options = {
                        body: 'Finished',
                        icon: 'img/notification-flat.png',
                        vibrate: [100, 50, 100],
                        data: {
                            dateOfArrival: Date.now(),
                            //use a "key" (unique) property in the data to determine which notification was called.
                            primaryKey: 1
                        },
                        actions: [{
                            action: 'explore', title: 'Go to the site',
                            icon: 'img/checkmark.png'
                        }, {
                            action: 'close', title: 'Close the notification',
                            icon: 'img/xmark.png'
                        }]
                    };
                    reg.showNotification('Timer', options);
                });
            }
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
                endTime: Date.now() + minutes * 60000 + seconds * 1000 + 1000
            });
            this.favicon.href = 'favicon-normal.ico';
        },

        update: function () {
            var minutes, seconds;
            if (!this.state.running) return;
            this.setState({
                remaining: Math.floor((this.state.endTime - Date.now()) / 1000)
            });
            seconds = this.state.remaining % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds; // Append '0' if less than 10
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
            this.pushNotice();
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
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'counter' },
                    React.createElement(
                        'p',
                        null,
                        this.state.minutes,
                        ':',
                        this.state.seconds
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'operation' },
                    React.createElement(
                        'div',
                        { className: 'timers', style: { display: !this.state.running && !this.state.remaining ? 'block' : 'none' } },
                        React.createElement(
                            'p',
                            null,
                            React.createElement(
                                'a',
                                { href: '#', onClick: () => {
                                        this.start(25, 0);
                                    } },
                                'Start pomodoro (25 min, default)'
                            )
                        ),
                        React.createElement(
                            'p',
                            null,
                            React.createElement(
                                'a',
                                { href: '#', onClick: () => {
                                        this.start(15, 0);
                                    } },
                                'Start 15 min'
                            )
                        ),
                        React.createElement(
                            'p',
                            null,
                            React.createElement(
                                'a',
                                { href: '#', onClick: () => {
                                        this.start(this.state.customTimer, 0);
                                    } },
                                'Start custom (',
                                this.state.customTimer,
                                ' minute',
                                this.state.customTimer == 1 ? '' : 's',
                                ')'
                            )
                        ),
                        React.createElement(
                            'button',
                            { className: 'dec', type: 'button', onClick: this.decrementCustomTimer },
                            '-'
                        ),
                        React.createElement('input', { hidden: true, type: 'number', defaultValue: this.state.customTimer, onChange: this.changeCustom }),
                        React.createElement(
                            'button',
                            { className: 'inc', type: 'button', onClick: this.incrementCustomTimer },
                            '+'
                        )
                    ),
                    React.createElement(
                        'p',
                        { style: { display: this.state.running ? 'block' : 'none' } },
                        React.createElement(
                            'a',
                            { href: '#', onClick: this.pause },
                            'Pause'
                        )
                    ),
                    React.createElement(
                        'p',
                        { style: { display: this.state.running ? 'block' : 'none' } },
                        React.createElement(
                            'a',
                            { href: '#', onClick: this.stop },
                            'Stop'
                        )
                    ),
                    React.createElement(
                        'p',
                        { style: { display: !this.state.running && this.state.remaining > 0 ? 'block' : 'none' } },
                        React.createElement(
                            'a',
                            { href: '#', onClick: this.continue },
                            'Continue'
                        )
                    )
                )
            );
        }
    });

    Timer.View = ReactDOM.render(React.createElement(Timer.Component, null), document.getElementById('timer'));
})(Timer, document, window);