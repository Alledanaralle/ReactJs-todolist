import { useState, useEffect } from 'react'

const ToDoList = () => {
    const [fillTask, setFillTask] = useState('')
    const [displayTask, setDisplayTask] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editIndex, setIsEditIndex] = useState(null)
    const [editTaskNext, setIsEditTaskNext] = useState('')
    const [taskEmpty, setTaskEmpty] = useState(false)

    const taskChecked = (index) => {
        const newTask = displayTask.map((task, i) => i === index ? {
            ...task, checked: !task.checked
        } : task)
        setDisplayTask(newTask)
    }

    const addTask = () => {
        if (fillTask.trim() !== '') {
            setDisplayTask([...displayTask, { text: fillTask, checked: false }])
            setFillTask('')
            setTaskEmpty(false)
        } else {
            setTaskEmpty(true)
        }
    }

    const addEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (isEditing) {
                confirmEditTask()
            } else {
                addTask()
            }
        }
    }

    const deleteTask = (index) => {
        const newTask = displayTask.filter((_, i) =>
            i !== index)
        setDisplayTask(newTask)
        setTaskEmpty(false)
    }

    const deleteAllTasks = () => {
        setDisplayTask([])
        setTaskEmpty(false)
    }

    const handleInput = (e) => {
        if (isEditing) {
            setIsEditTaskNext(e.target.value)
        } else {
            setFillTask(e.target.value)
        }
    }

    const editTask = (index) => {
        setIsEditing(true)
        setIsEditIndex(index)
        setIsEditTaskNext(displayTask[index].text)
        setTaskEmpty(false)
    }

    const confirmEditTask = () => {
        const updatedTasks = displayTask.map((task, index) => index === editIndex ? {
            ...task, text: editTaskNext
        } : task
        )

        if (!editTaskNext.trim()) {
            setTaskEmpty(true)
            return;
        } else {
            setTaskEmpty(false)
            setDisplayTask(updatedTasks)
            setIsEditing(false)
            setIsEditIndex(null)
            setIsEditTaskNext('')
        }
    }

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'))
        if (savedTasks && Array.isArray(savedTasks)) {
            setDisplayTask(savedTasks)
        }
    }, [])

    useEffect(() => {
        if (displayTask.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(displayTask))
        } else {
            localStorage.removeItem('tasks')
        }
    }, [displayTask])

    return (
        <div className='overflow-auto min-h-dvh bg-slate-900 flex justify-center items-center flex-col'>
            <div className='max-w-[30em] w-[95%] py-4 sm:px-6 px-5 bg-slate-950 text-[#e0e0e0] rounded-lg'>
                <div className='flex justify-between w-full'>
                    <h2 className='text-2xl sm:text-3xl mt-2 font-[500]'>
                        To-Do List <i className="ri-sticky-note-add-line"></i>
                    </h2>
                    <button
                        type='button'
                        onClick={deleteAllTasks}
                        className='bg-blue-600 hover:bg-blue-700 rounded sm:px-2 px-[.4rem] py-[.5em] text-[.9rem] sm:text-base text-nowrap'>
                        Delete All Tasks
                    </button>
                </div>

                <div className='rounded-full bg-[#9ca3af85] mt-3 w-full h-[2px]'></div>
                <div className='pt-6 pb-4 flex items-center gap-2'>
                    <input type='text'
                        placeholder={isEditing ? 'Edit Your Tasks?' : 'What You Gonna Do?'}
                        value={isEditing ? editTaskNext : fillTask}
                        onChange={handleInput}
                        onKeyDown={addEnter}
                        className={`py-3 px-4 w-full bg-transparent outline-none border-2 ${taskEmpty ? 'border-[#ff0000cb]' : 'border-[#e4e4e47e]'} rounded-lg text-[.9rem] sm:text-base hover:border-blue-600 focus:border-blue-600 transition`} />
                    <button
                        type='button'
                        onClick={isEditing ? confirmEditTask : addTask}
                        className='bg-blue-600 hover:bg-blue-700 rounded-md sm:px-4 px-2 py-[.85em] text-[.9rem] sm:text-base text-nowrap'>
                        {isEditing ? 'Edit Tasks' : 'Add Tasks'}
                    </button>
                </div>
                {
                    taskEmpty && (
                        <p className='text-[red] relative bottom-3'>
                            * Task Cannot be Empty!
                        </p>
                    )
                }
                <ul className='max-h-[40dvh] overflow-auto'>
                    {displayTask.map((task, index) => (
                        <li
                            onClick={() => taskChecked(index)}
                            key={index}
                            className='flex relative items-center p-2 justify-between cursor-pointer bg-slate-900 rounded px-4 my-1 overflow-auto'>
                            <div className='flex gap-4 items-center'>
                                <div className={`relative border-2 sm:w-[20.5px] sm:h-[20.5px] w-[18px] h-[18px] rounded ${task.checked ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-[#e4e4e4e0]'}`}>
                                    {task.checked && (
                                        <i className="ri-check-line text-[.95rem] sm:text-[1rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                                    )}
                                </div>
                                <p className={`text-base sm:text-lg ${task.checked ? 'line-through opacity-[.8]' : ''}`}>
                                    {task.text}
                                </p>
                            </div>
                            <div className='gap-1 flex'>
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask(index)
                                    }}
                                    className='ri-delete-bin-6-fill text-lg sm:text-[1.3rem] px-2 py-1'>
                                </button>
                                <button type='button'
                                    className='ri-pencil-line text-lg sm:text-[1.3rem] px-2 py-1'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        editTask(index);
                                    }}>
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ToDoList
