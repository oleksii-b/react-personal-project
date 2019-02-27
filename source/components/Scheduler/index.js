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
        loading: false,
        newTaskNameHolder: '',
        searchName: '',
        allTasks: false,
        tasks: []
    };

    _loadingState = (state) => {
        this.setState({ loading: state });
    };

    async componentDidMount  () {
        this._loadingState(true);

        api.get().then((req)=>{
            this.setState({ tasks: sortTasksByGroup(req.data.data) });
            this._checkAllTasks();

            this._loadingState(false)
        });
    }

    _updateSearchName = (e) => {
        e.preventDefault();
        const searchName = e.target.value.toLowerCase();

        this.setState({ searchName });
    };

    _updateNewTaskName = (e) => {
        this.setState({
            newTaskNameHolder: e.target.value,
        });
    };


    _addNewTask = (e) => {
        e.preventDefault();
        const { newTaskNameHolder } = this.state;

        if(!newTaskNameHolder.length) return;

        this._loadingState(true)

        api.post( '', { message: newTaskNameHolder } ).then((req)=>{
            this.setState(({ tasks }) => ({
                tasks:          sortTasksByGroup([req.data.data, ...tasks]),
                newTaskNameHolder: '',
                allTasks: false,
            }));

            this._loadingState(false)
        });

    };

    _removeTask = (id) => () => {
        this._loadingState(true)

        api.delete( `/${id}` ).then((req)=>{
            let filterTasks = this.state.tasks.filter((item)=>{
                return item.id !== id;
            });

            this.setState({ tasks: filterTasks });

            this._loadingState(false)
        });
    };

    _updateTask = (task) => {
        this._loadingState(true);

        api.put( '', [task] ).then((req)=>{
            const updateTask = req.data.data[0];

            let filterTasks = this.state.tasks.filter((item)=>{
                return item.id !== updateTask.id;
            });

            this.setState({
                tasks: sortTasksByGroup( [...filterTasks, updateTask] )
            });

            this._checkAllTasks();

            this._loadingState(false)
        });
    };


    _completeAllTasks = () => {
        let {allTasks, tasks } = this.state;
        let updateTasks = tasks.map((item)=>{
            return {
                ...item,
                ...{completed: !allTasks}
            }
        });

        this._loadingState(true)

        api.put( '', updateTasks ).then(()=>{
            this.setState({
                allTasks: !allTasks,
                tasks: updateTasks
            });

            this._loadingState(false)
        });
    };

    _checkAllTasks = () => {
        let { tasks } = this.state;

        let status = tasks.every((elm)=>{
            return !(elm.completed === false);
        });

        this.setState({
            allTasks: status
        });
    }


    render () {
        const { loading, newTaskNameHolder, searchName, tasks, allTasks } = this.state;

        const tasksJSX = tasks.filter((task) => { return task.message.toLowerCase().includes(searchName)})
                               .map((props)=>{
                                    return <Task
                                        _removeTask = { this._removeTask }
                                        _updateTask = { this._updateTask }
                                        key = { props.id } {...props} />
                                });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { loading } />
                    <header>
                        <h1>Task Manager</h1>
                        <input
                            placeholder="Search"
                            type="search"
                            value={searchName}
                            onChange = { this._updateSearchName }
                        />
                    </header>

                    <section>
                        <form onSubmit={ this._addNewTask }>
                            <input
                                maxLength="50"
                                placeholder="Description of my new task"
                                type="text"
                                value={ newTaskNameHolder }
                                onChange={ this._updateNewTaskName }
                            />
                            <button
                                disabled={ !newTaskNameHolder }
                                type="submit"
                                >Add new task</button>
                        </form>

                        <ul>
                            <FlipMove
                                duration = { 400 }
                                easing = 'ease-in-out'>
                                { tasksJSX }
                            </FlipMove>
                        </ul>
                    </section>

                    <footer>
                        <Checkbox
                            checked = { allTasks }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick={ this._completeAllTasks }
                        />
                        <span className = { Styles.completeAllTasks }>All tasks is done</span>
                    </footer>
                </main>
            </section>
        );
    }
}
