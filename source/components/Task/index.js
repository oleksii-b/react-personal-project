// Core
import React, {PureComponent, createRef} from 'react';

// Instruments
import Styles from './styles.m.css';

//Components
import Checkbox from '../../theme/assets/Checkbox';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        newMessage: this.props.message,
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    taskInput = createRef();

    _updateNewTaskMessage = (e) => {
        const {value: newMessage} = e.target;

        this.setState({newMessage});
    };

    _updateTask = () => {
        const {_updateTaskAsync, message} = this.props;
        const {newMessage} = this.state;

        if (message === newMessage) {
            this._setTaskEditingState(false);

            return null;
        }
        const updatedTask = this._getTaskShape({message: newMessage});

        _updateTaskAsync(updatedTask);
        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnClick = () => {
        const {isTaskEditing} = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(!isTaskEditing);
    };

    _cancelUpdatingTaskMessage = () => {
        const {message} = this.props;

        this.setState({
            newMessage: message,
            isTaskEditing: false,
        });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const {newMessage} = this.state;

        if (!newMessage) return null;

        switch (event.key) {
            case 'Enter':
                this._updateTask();
                break;
            case 'Escape':
                this._cancelUpdatingTaskMessage();
                break;
        }
    };

    _setTaskEditingState = (isTaskEditing) => {
        this.setState(
            {isTaskEditing}, () => {
                if (isTaskEditing) {
                    this.taskInput.current.focus();
                }
            },
        );
    };

    _toggleTaskCompletedState = () => {
        const {_updateTaskAsync, completed} = this.props;
        const updatedTask = this._getTaskShape({
            completed: !completed
        });

        _updateTaskAsync(updatedTask);
    };

    _toggleTaskFavoriteState = () => {
        const {_updateTaskAsync, favorite} = this.props;
        const updatedTask = this._getTaskShape({
            favorite: !favorite
        });

        _updateTaskAsync(updatedTask);
    };

    _removeTask = () => {
        const {_removeTaskAsync, id} = this.props;

        _removeTaskAsync(id);
    };

    render() {
        const {isTaskEditing, newMessage} = this.state;
        const {completed, message, favorite} = this.props;

        return (
            <li className={ `${Styles.task}${ completed ? ' '+Styles.completed : ''}` }>
                <div className={ Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { isTaskEditing ? newMessage : message }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}