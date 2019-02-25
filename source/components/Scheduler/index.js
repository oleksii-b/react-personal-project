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
            {id: 0, value: 'task1'},
            {id: 1, value: 'task2'},
            {id: 2, value: 'task2'},
        ]
    };

    _addNewTask = (e) => {
        e.preventDefault();

        let tasks = [...this.state.tasks];

        tasks.push({
            id: `${ this.state.tasks[this.state.tasks.length - 1].id + 1}`, value: this.state.newTaskNameHolder
        });

        this.setState({
            newTaskNameHolder: '',
            tasks
        });
    };

    _removeTask = (id) => () => {
        let tasks = this.state.tasks.filter((item)=>{
            return item.id !== id;
        });

        this.setState({ tasks });
    };

    _updateNewTaskName = (e) => {
        this.setState({
            newTaskNameHolder: e.target.value,
        });
    };

    render () {
        const { newTaskNameHolder, tasks } = this.state;

        const todosJSX = tasks.map((props)=>{
            return <Task
                _removeTask = { this._removeTask }
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
