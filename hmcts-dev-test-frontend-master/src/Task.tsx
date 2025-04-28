export interface TaskProps {
    id: string;
    title: string;
    status: string;
    dueDate: Date;
    description?: string;
    removeClick: () => void;
    editClick: () => void;
}

function Task({id, title, status, dueDate, description, removeClick, editClick}: TaskProps, ) {
    return (
        <tr className="task">
            <td>{id}</td>
            <td>{title}</td>
            <td>{description}</td>
            <td>{status}</td>
            <td>{dueDate.toUTCString()}</td>
            <td className="task-edit" onClick={editClick}>Edit</td>
            <td className="task-remove" onClick={removeClick}>X</td>
        </tr>
    );
}

export default Task;