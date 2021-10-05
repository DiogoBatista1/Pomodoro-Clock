const AUDIO = "./break.wav";

function App() {
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimeOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    
    let breakAudio = React.useRef(null);

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const formatTime = (time, arg) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (arg === "timeSets") {
            return ( time / 60 )
        } else {
            return (
            (minutes < 10 ? "0" + minutes : minutes) 
            + ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        )
        }
    }

    const changeTime = (amount, type) =>{
        if (type === "break") {
            if(breakTime <= 60 && amount < 0 || breakTime >= 60 * 60) {
                return;
            }
            setBreakTime((prev) => prev + amount);
        } else {
            if(sessionTime <= 60 && amount < 0 || breakTime >= 60 * 60) {
                return;
            }
            setSessionTime((prev) => prev + amount);
            if(!timerOn) {
                setDisplayTime(sessionTime + amount);
            }
        }
    }

    const controlTime = () => {
        let second = 1000.
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;

        if(!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if(prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if(prev <= 0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        } 
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval);
        }

        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"))
        } setTimeOn(!timerOn);
    }
    const resetTime = () => {
        clearInterval(localStorage.getItem("interval-id"));
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
        setOnBreak(false);
        setTimeOn(false);
        breakAudio.currentTime = 0;
    }

    return(
      <div className="container items-center">
        <div className="row">
          <h1>Pomodoro Clock</h1>
            <div id="break-label">
                <Length 
                    title={"Break Length"}
                    changeTime={changeTime}
                    type={"break"}
                    time={breakTime}
                    formatTime={formatTime}
                    />
            </div>
            <div id="session-label">
                <Length 
                    title={"Session Length"}
                    changeTime={changeTime}
                    type={"session"}
                    time={sessionTime}
                    formatTime={formatTime}
                    />
            </div>
        </div>
            <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
            <h1 id="time-left">{formatTime(displayTime)}</h1>
            <button className="btn-large deep-orange darken-3" onClick={controlTime} id="start_stop">
                {timerOn ? (
                    <i className="material-icons">pause_circle_filled</i>
                ) : (
                    <i className="material-icons">play_circle_filled</i>
                )}
            </button>
            <button className="btn-large deep-orange darken-3" onClick={resetTime} id="reset">
                <i className="material-icons">autorenew</i>
            </button>
            <audio ref={(a) => (breakAudio = a)} src={AUDIO} id="beep" />
      </div>
    ) 
}

function Length({title, changeTime, type, time, formatTime}){
    function id (arg) {
        if (type === "break" && arg === "down") {
            return "break-decrement"
        } else if (type != "break" && arg === "down") { 
            return "session-decrement"
        } else if (type === "break" && arg === "up"){
            return "break-increment"
        } else if (type != "break" && arg === "up") { 
            return "session-increment"
        } else if(arg === "length" && type === "break"){
            return "break-length";
        } else if(arg === "length" && type === "session"){
            return "session-length";
        }
    }
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button 
                    className="btn-small deep-orange darken-3"
                    onClick={() => changeTime(-60, type)}
                    id={id("down")}
                >
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3 id={id("length")}>{formatTime(time, "timeSets")}</h3>
                <button 
                    className="btn-small deep-orange darken-3"
                    onClick={() => changeTime(60, type)}
                    id={id("up")}
                >
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));