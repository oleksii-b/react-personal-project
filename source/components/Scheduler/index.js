// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments';

//Components
import Task from 'components/Task';
import Checkbox from '../../theme/assets/Checkbox';
import Spinner from '../Spinner';


export default class Scheduler extends Component {
    state = {
        isTasksFetching: false,
        newTaskMessage:  '',
        tasksFilter:     '',
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _asyncMediator = async ( callback ) => {
        try {
            this._setTasksFetchingState(true);
            await callback();
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _fetchTasksAsync = async () => {
        this._asyncMediator( async ()=>{
            const tasks = await api.fetchTasks();

            this.setState({ tasks: sortTasksByGroup(tasks) });
        } );
    };

    _createTaskAsync = async (e) => {
        e.preventDefault();
        const { newTaskMessage } = this.state;

        if (!newTaskMessage.length) return null;

        this._asyncMediator( async ()=>{
            const newTask = await api.createTask(newTaskMessage);

            this.setState(({ tasks }) => ({
                tasks:          sortTasksByGroup([newTask, ...tasks]),
                newTaskMessage: '',
            }));
        } );

    };

    _updateTasksFilter = (e) => {
        const tasksFilter = e.target.value.toLowerCase();
        this.setState({ tasksFilter });
    };

    _updateNewTaskMessage = (event) => {
        const newTaskMessage = event.target.value;
        this.setState({ newTaskMessage });
    };

    _updateTaskAsync = async (updatedTask) => {
        const { tasks } = this.state;

        this._asyncMediator( async ()=>{
            const dataTasks = await api.updateTask(updatedTask);

            this.setState({ tasks: sortTasksByGroup(this._updateTasks(tasks, dataTasks[0])) });
        } );

    };

    _removeTaskAsync = async (taskId) => {
        this._asyncMediator( async ()=>{
            await api.removeTask(taskId);
            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(tasks.filter((item) => item.id !== taskId)),
            }));
        } );
    };

    _getAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    _completeAllTasksAsync = async () => {
        const notCompleted = this.state.tasks.filter((item) => item.completed !== true);

        if(!notCompleted.length) return null;

        this._asyncMediator( async ()=>{
            await api.completeAllTasks(notCompleted);
            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(this._setAllTasksComplete(tasks)),
            }));
        } );
    };

    _setAllTasksComplete = (tasks) => {
        return tasks.map((item) => {
            return { ...item, completed: true };
        });
    };

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    };

    _updateTasks = (tasks, newTask) => {
        return tasks.map((item) => {
            return (item.id === newTask.id) ? newTask : item;
        });
    };

    render () {
        const { isTasksFetching, newTaskMessage, tasksFilter, tasks} = this.state;

        const tasksJSX = tasks.filter((task) => { return task.message.toLowerCase().includes(tasksFilter)})
                              .map((props) => (
                                  <Task
                                      _removeTaskAsync = { this._removeTaskAsync }
                                      _updateTaskAsync = { this._updateTaskAsync }
                                      key = { props.id } { ...props }
                                  />
                              ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>

                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>

                        <div className = { Styles.overlay }>
                            <ul>
                                <FlipMove
                                    duration = { 400 }
                                    easing = 'ease-in-out'>
                                    { tasksJSX }
                                </FlipMove>
                            </ul>
                        </div>
                    </section>

                    <footer>
                        <Checkbox
                            checked = { this._getAllCompleted() }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}