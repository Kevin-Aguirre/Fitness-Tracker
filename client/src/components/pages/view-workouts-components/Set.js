export default function Set({type, set, setIndex}) {
    let setElem;
    switch(type) {
        case "time-based":
            setElem = (
                <div key={setIndex} className="view--set">
                    <div className="view--time">Time: {set.time}</div>
                </div>
            )
            break;
        case "rep-based":
            setElem = (
                <div key={setIndex} className="view--set">
                    <div className="view--reps">Reps: {set.reps}</div>
                </div>
            )
            break;
        case "weight-based":
            setElem = (
                <div key={setIndex} className="view--set">
                    <div className="view--reps">Reps: {set.reps}</div>
                    <div className="view--weight">Weight: {set.weight}</div>
                </div>
            )
            break;
        case "distance-based":
            setElem = (
                <div key={setIndex} className="view--set">
                    <div className="view--time">Time: {set.time}</div>
                    <div className="view--distance">Distance: {set.distance}</div>
                </div>
            )
            break;
        default:
            setElem = (
                <div key={setIndex} className="view--set">
                    Something Went Wrong.
                </div>
            )
            break;
    }
    return setElem
}