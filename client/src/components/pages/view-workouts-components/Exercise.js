import Set from "./Set"

export default function Exercise({ exerciseIndex, exercise}) {
    return (
        <div key={exerciseIndex} className="view--exercise-entry">
            <h2>{exercise.name}</h2>
            {exercise.sets.map((set, setIndex) => {
                return <Set
                    type={exercise.type}
                    set={set}
                    setIndex={setIndex}
                />

            })}
        </div>
    )
}