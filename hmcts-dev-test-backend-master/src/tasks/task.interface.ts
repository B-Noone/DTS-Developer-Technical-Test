export interface Task {
    title: string,
    description: string | null,
    status: string,
    due_date: Date,
}

export interface UnitTask extends Task {
    task_id: string
};

export interface Tasks {
    [key: string]: UnitTask
};