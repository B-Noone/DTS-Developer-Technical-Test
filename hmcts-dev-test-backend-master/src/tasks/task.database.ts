import { runSQLGetAsync, runSQLPostAsync } from "../manageSQLServer";
import { Task, Tasks, UnitTask } from "./task.interface";
import { v4 as random } from "uuid";

export const findAll = async (): Promise<UnitTask[]> => {
    try {
        const sql = `SELECT * FROM task`;
        var res = await runSQLGetAsync(sql).then((result: UnitTask[]) => {
            return result;
        });
        return res;
    } catch (error) {
        console.log(`Error ${error}`);
        return [];
    }
}

export const findOne = async (id: string): Promise<UnitTask | null> => {
    try {
        const sql = `SELECT * FROM task WHERE id = '${id}'`;
        var res = await runSQLGetAsync(sql).then((result: UnitTask[]) => {
            return result[0];
        });
        return res;
    } catch (error) {
        console.log(`Error ${error}`);
        return null;
    }
}

export const findTasks = async (taskParam: Task): Promise<UnitTask[]> => {
    try {
        let conditions = [];

        for (const [key, value] of Object.entries(taskParam)) {
            if (value) {
                conditions.push(`${key} = '${value}'`);
            }
        }

        const clause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
        const sql = `SELECT * FROM task` + clause;

        console.log(sql);

        var res = await runSQLGetAsync(sql).then((result: UnitTask[]) => {
            return result;
        });
        return res;
    } catch (error) {
        console.log(`Error ${error}`);
        return [];
    }
}

export const create = async (taskData: UnitTask): Promise<UnitTask | null> => {
    let id = random();

    let check_task = await findOne(id);

    while (check_task) {
        id = random();
        check_task = await findOne(id);
    }

    const sql = `INSERT INTO task (id, title, description, status, due_date) VALUES ('${id}', '${taskData.title}', '${taskData.description}', '${taskData.status}', '${taskData.due_date}')`;
    var res = await runSQLPostAsync(sql).then(() => {
        return findOne(id);
    });
    return res;
};

export const update = async (id: string, taskData: Task): Promise<UnitTask | null> => {
    try {
        const task: UnitTask | null = await findOne(id);

        if (!task) {
            return null;
        }

        //Cover the case where the taskData is not provided for some fields
        for (const [key, value] of Object.entries(task)) {
            if (!(taskData as any)[key]) {
                (taskData as any)[key] = (task as UnitTask)[key as keyof UnitTask];
            }
        }

        //Convert date to string if it is a Date object as it is not supported by SQL Server
        let date: string = '';
        if (taskData.due_date) {
            if (typeof (taskData.due_date) != 'string') {
                date = taskData.due_date.toISOString();
            }
            else {
                date = taskData.due_date;
            }
        }else{
            date = task.due_date.toISOString();
        }

        const sql = `UPDATE task SET title = '${taskData.title}', description = '${taskData.description}', status = '${taskData.status}', due_date = '${date}' WHERE id = '${id}'`;
        var res = await runSQLPostAsync(sql).then(() => {
            return findOne(id);
        });
        return res;
    }
    catch (error) {
        console.log(`Error ${error}`);
        return null;
    }
};

export const remove = async (id: string): Promise<Boolean> => {
    try {
        const sql = `DELETE FROM task WHERE id = '${id}'`;
        var res = await runSQLPostAsync(sql).then(() => {
            return true;
        });
        return res;
    } catch (error) {
        console.log(`Error ${error}`);
        return false;
    }
}