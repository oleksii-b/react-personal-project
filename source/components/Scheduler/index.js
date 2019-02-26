// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

//Components
import Task from 'components/Task';
import Checkbox from '../../theme/assets/Checkbox';


export default class Scheduler extends Component {
    state = {
        newTaskNameHolder: '',
        tasks: [
            {id: 0, message: 'task1', completed: false, favorite: false},
            {id: 1, message: 'task2', completed: false, favorite: true},
            {id: 2, message: 'task3', completed: true, favorite: true},
            {id: 3, message: 'task4', completed: false, favorite: false},
            {id: 4, message: 'task5', completed: true, favorite: false},
        ]
    };

    _addNewTask = (e) => {
        e.preventDefault();

        let tasks = [...this.state.tasks];

        tasks.push({
            id: `${ this.state.tasks[this.state.tasks.length - 1].id + 1}`,
            message: this.state.newTaskNameHolder,
            completed: false,
            favorite: false
        });

        this.setState({
            newTaskNameHolder: '',
            tasks
        });
    };

    _updateTask = (task) => {
        let filterTasks = this.state.tasks.filter((item)=>{
            return item.id !== task.id;
        });

        this.setState({
            tasks: [...filterTasks, task]
        });

        console.log(task)
    };

    _removeTask = (id) => () => {
        let filterTasks = this.state.tasks.filter((item)=>{
            return item.id !== id;
        });

        this.setState({ tasks: filterTasks });
    };

    _updateNewTaskName = (e) => {
        this.setState({
            newTaskNameHolder: e.target.value,
        });
    };

    _customSort = (arr) => {
        let arrTop = arr.filter((item)=>{
            return !item.completed;
        }).sort( (a,b)=>{
            return (a.favorite === b.favorite) ? 0 : ( a.favorite ? -1 : 1 );
        } );

        let arrBottom = arr.filter((item)=>{
            return item.completed;
        }).sort( (a,b)=>{
            return (a.favorite === b.favorite) ? 0 : ( a.favorite ? -1 : 1 );
        } );

        return ( [...arrTop, ...arrBottom] )
    };

    render () {
        const { newTaskNameHolder, tasks } = this.state;

        const todosJSX = this._customSort(tasks).map((props)=>{
            return <Task
                _removeTask = { this._removeTask }
                _updateTask = { this._updateTask }
                key = { props.id } {...props} />
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task Manager</h1>
                        <input placeholder="Search" type="search"/>
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
                            <button type="submit">Add new task</button>
                        </form>

                        <ul>
                            { todosJSX }
                        </ul>
                    </section>

                    <footer>
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#fff'
                        />
                        <span className = { Styles.completeAllTasks }>All tasks is done</span>
                    </footer>
                </main>
            </section>
        );
    }
}
