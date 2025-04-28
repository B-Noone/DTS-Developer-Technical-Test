import React, { useEffect } from "react";

interface data {
    title: string;
    status: string;
    dueDate: Date;
    description?: string;
}

interface ControlMenuProps {
    title: string;
    status: string;
    dueDate: Date;
    description?: string;
    finishClick: (data: data) => void;
}

const CloseMenu = () => {
    // const menu = document.querySelector('.control-menu') as HTMLElement;
    // if (menu) {
    //     menu.style.display = 'none';
    // }
    const centerScreen = document.querySelector('#AddMenu') as HTMLElement;
    if (centerScreen) {
        centerScreen.style.display = 'none';
    }
}

function EditMenu({title, status, dueDate, description, finishClick }: ControlMenuProps) {
    const [titleString, setTitleString] = React.useState(title);
    const [descriptionString, setDescriptionString] = React.useState(description || "");
    const [statusString, setStatusString] = React.useState(status);
    const [dueDateString, setDueDateString] = React.useState(dueDate.toISOString());

    const [data, setData] = React.useState<data>();

    useEffect(() => {
        setData({
            title: titleString,
            description: descriptionString,
            status: statusString,
            dueDate: new Date(dueDateString),
        });
    }, [titleString, descriptionString, statusString, dueDateString]);

    const handleClick = () => {
        console.log("Finish Pressed");
        console.log(data);
        if(data){
            finishClick(data);
        }
    }

    return (
        <div id="AddMenu" className="center-screen">
            <div className="control-menu">
                <p>Title</p>
                <input type="text" value={titleString} onChange={(e) => setTitleString(e.target.value)}/>
                <p>Description</p>
                <input type="text" value={descriptionString} onChange={(e) => setDescriptionString(e.target.value)}/>
                <p>Status</p>
                <input type="text" value={statusString} onChange={(e) => setStatusString(e.target.value)}/>
                <p>Due Date</p>
                <input type="text" value={dueDateString} onChange={(e) => setDueDateString(e.target.value)}/>
                <button className="control-menu-button-cancel" onClick={CloseMenu}>Cancel</button>
                <button id="FinishButtonEdit" className="control-menu-button-finish" onClick={handleClick}>Finish</button>
            </div>
        </div>
    );
}

export default EditMenu;