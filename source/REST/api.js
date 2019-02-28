import { MAIN_URL, TOKEN } from './config';

export const api = {
    async fetchMediator ( method, body, url = '' ) {
        const response = await fetch(`${MAIN_URL}/${url}`, {
            method:  method,
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json',
            },
            body: body && JSON.stringify(body),
        });

        if( method === 'DELETE' ) {
            if (response.status !== 204) {
                throw new Error('Task was not deleted.');
            }
            return;
        }

        const { message, data } = await response.json();

        if (response.status !== 200 ) {
            throw new Error( message );
        }

        return data;
    },
    async fetchTasks () {
        return await this.fetchMediator('GET');
    },
    async createTask (newTask) {
        return await this.fetchMediator('POST', { message: newTask });
    },
    async updateTask (newTask) {
        return await this.fetchMediator('PUT', [newTask] );
    },
    async removeTask (id) {
        await this.fetchMediator('DELETE', null, id);
    },
    async completeAllTasks (tasks) {
        const promises = [];

        for (const task of tasks) {
            promises.push(
                fetch(MAIN_URL, {
                    method:  'PUT',
                    headers: {
                        Authorization:  TOKEN,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([{
                        ...task,
                        completed: true,
                    }]),
                }),
            );
        }

        const responses = await Promise.all(promises);
        const success = responses.every((result) => result.status === 200);

        if (!success) {
            throw new Error('Tasks were not completed');
        }
    },
};
