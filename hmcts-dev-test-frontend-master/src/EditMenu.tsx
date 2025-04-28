import React, { useEffect } from "react";

interface data {
    id: string;
    title: string;
    status: string;
    dueDate: Date;
    description?: string;
}

interface ControlMenuProps {
    id: string;
    title: string;
    status: string;
    dueDate: Date;
    description?: string;
    finishClick: (data: data) => void;
}

const CheckValidDate = (newDate: string) => {
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {
        return false;
    }
    return true;
}


function EditMenu({ id, title, status, dueDate, description, finishClick }: ControlMenuProps) {
    console.log("EditMenu:", dueDate);
    const dateToUse = CheckValidDate(dueDate.toString()) ? dueDate.toISOString() : new Date().toISOString();
    const [titleString, setTitleString] = React.useState(title);
    const [descriptionString, setDescriptionString] = React.useState(description || "");
    const [statusString, setStatusString] = React.useState(status);
    const [dueDateString, setDueDateString] = React.useState(dateToUse);
    const [errorMsg, setErrorMsg] = React.useState<string>("")
    
    const [data, setData] = React.useState<data>();
    
    const CloseMenu = () => {
        setErrorMsg("");
        const centerScreen = document.querySelector('#EditMenu') as HTMLElement;
        if (centerScreen) {
            centerScreen.style.display = 'none';
        }
    }

    useEffect(() => {
        setData({
            id: id,
            title: titleString,
            description: descriptionString,
            status: statusString,
            dueDate: new Date(dueDateString),
        });
    }, [titleString, descriptionString, statusString, dueDateString, id, title, description, status, dueDate]);

    useEffect(() => {
        setDueDateString(dateToUse);
    }, [dateToUse])

    const handleClick = () => {
        setErrorMsg("");
        if (!CheckValidDate(data?.dueDate.toString() ?? "")) {
            setErrorMsg("Invalid Date");
            setDueDateString(dateToUse);
            return;
        }

        console.log("Finish Pressed");
        console.log(data);
        if (data) {
            finishClick(data);
        }
    }

    return (
        <div id="EditMenu" className="center-screen">
            <div className="control-menu">
                <p>ID</p>
                <p>{id}</p>
                <p>Title</p>
                <input type="text" placeholder={title} value={titleString} onChange={(e) => setTitleString(e.target.value)} />
                <p>Description</p>
                <input type="text" placeholder={description} value={descriptionString} onChange={(e) => setDescriptionString(e.target.value)} />
                <p>Status</p>
                <input type="text" placeholder={status} value={statusString} onChange={(e) => setStatusString(e.target.value)} />
                <p>Due Date</p>
                <input type="text" placeholder={dueDateString} value={dueDateString} onChange={(e) => setDueDateString(e.target.value)} />
                <button className="control-menu-button-cancel" onClick={CloseMenu}>Cancel</button>
                <button id="FinishButtonEdit" className="control-menu-button-finish" onClick={handleClick}>Finish</button>
                {errorMsg && (
                    <p>{errorMsg}</p>
                )}
            </div>
        </div>
    );
}

export default EditMenu;