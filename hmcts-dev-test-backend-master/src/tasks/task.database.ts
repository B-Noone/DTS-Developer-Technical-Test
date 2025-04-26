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
    // const task: UnitTask = {
    //     task_id: id,
    //     title: taskData.title,
    //     description: taskData.description,
    //     status: taskData.status,
    //     due_date: taskData.due_date,
    // };

    return res;
  };