// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

//Components
import Checkbox from '../../theme/assets/Checkbox';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

export default class Task extends PureComponent {
    state = {
        edit: false
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

    input = React.createRef();

    _toggleTaskMessageState = () => {
        this.setState({
            edit: !this.state.edit,
        }, ()=>{
            this.state.edit && this.input.current.focus();

            this._changeTaskValue();
        });

    };

    _changeTaskValue = () => {
        const { message, _updateTask } = this.props;
        const value = this.input.current.value;

        if( value !== message ) {
            const updatedTask = this._getTaskShape({ message: value });
            _updateTask(updatedTask);
        }
    };

    _onKeyDownInput = (e) => {
        switch (e.key) {
            case 'Enter':
                this._changeTaskValue();
                this._toggleTaskMessageState();
                break;
            case 'Escape':
                this._onBlurInput(e);
                break;

        }
    };

    _onBlurInput = (e) => {
        e.target.value = this.props.message;
        this._toggleTaskMessageState();
    };



    _toggleTaskCompletedState = () => {
        const { _updateTask, completed } = this.props;
        const updateTask = this._getTaskShape({ completed: !completed });

        _updateTask(updateTask);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTask, favorite } = this.props;
        const updateTask = this._getTaskShape({ favorite: !favorite });

        _updateTask(updateTask);
    };

    render () {
        const { edit } = this.state;
        const { completed, message, favorite, id, _removeTask } = this.props;

        return (
            <>
                <li className = { `${Styles.task} ${ completed &&  Styles.completed}` }>
                    <div className = { Styles.content }>
                        <Checkbox
                            inlineBlock
                            checked = { completed }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#3B8EF3'
                            color2 = 'white'
                            onClick = { this._toggleTaskCompletedState }
                        />
                        <input
                            ref = { this.input }
                            disabled = { !edit }
                            maxLength="50"
                            type="text"
                            defaultValue= {message}
                            onKeyDown = { this._onKeyDownInput }
                            onBlur = { this._onBlurInput}
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
                            checked = { edit }
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._toggleTaskMessageState }
                        />
                        <Remove
                            inlineBlock
                            className = { Styles.removeTask }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { _removeTask( id ) }
                        />
                    </div>


                </li>
                <div className = { Styles.completed } >
                    <div className = { Styles.content } ></div>
                </div>
            </>
        );
    }
}
